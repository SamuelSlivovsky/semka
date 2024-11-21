//@TODO add ordering on critical stock in warehouse for all medications that are in hospital
//@TODO also add ordering when medicine will expire in X days

//Imports
import React, { useState, useEffect, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import GetUserData from '../Auth/GetUserData';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

export default function Orders() {
  //------------------------------------------------------------------------------------------------
  let skladId = 30;
  //------------------------------------------------------------------------------------------------

  let emptyOrders = {
    ID_OBJEDNAVKY: null,
    ID_SKLAD: null,
    DATUM_OBJEDNAVKY: null,
    ZOZNAM_LIEKOV: null,
    DATUM_DODANIA: null,
  };

  let dialog = {
    dialog: true,
  };

  let formattedString = null;

  //Defined constants
  const [products, setProducts] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [order, setOrder] = useState(emptyOrders);
  const [drugs, setDrugs] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [addOrderDialog, setAddOrderDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [changeProductDialog, setChangeProductDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [xmlContent, setXmlContent] = useState('');
  const toast = useRef(null);
  const [selectedMedications, setSelectedMedications] = useState([]);

  /*
    ----------------------------------------------------------------------------------------
    Functions section
    ----------------------------------------------------------------------------------------
    */

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const userDataHelper = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    fetch(`objednavky/all`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
    //initFilter();
  }, []);

  //Async function for inserting new data into DB
  //@TODO add ID_SKLAD
  async function insertData() {
    const token = localStorage.getItem('hospit-user');

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        zoznam_liekov: formattedString,
        id_sklad: skladId,
      }),
    };
    const response = await fetch('/api/objednavky/add', requestOptions).catch(
      (err) => console.log(err)
    );
  }

  //Async function for removing order
  async function deleteOrder(_order) {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        id_obj: _order.ID_OBJEDNAVKY,
      }),
    };
    const response = await fetch('/api/objednavky/deleteOrder', requestOptions);
  }

  //Function that will be called after clicking on one of the rows
  const handleClick = (value) => {
    setShowDialog(true);
    setLoading(true);
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    setSelectedRow(value);

    fetch(`/api/objednavky/list/${value.ID_OBJEDNAVKY}`, { headers })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        return res.text();
      })
      .then((data) => {
        try {
          const jsonData = JSON.parse(data);

          // If ZOZNAM_LIEKOV is a string, parse it as JSON
          if (jsonData && jsonData[0] && jsonData[0].ZOZNAM_LIEKOV) {
            const zoznamLiekovArray = JSON.parse(jsonData[0].ZOZNAM_LIEKOV);

            // Now zoznamLiekovArray should be an array of objects
            //console.log('Parsed ZOZNAM_LIEKOV:', zoznamLiekovArray);

            setLoading(false);
            setXmlContent(zoznamLiekovArray);
          } else {
            console.error('Invalid ZOZNAM_LIEKOV structure:', jsonData);
          }
        } catch (error) {
          console.error('Error parsing data:', error);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  //Function for adding new order
  const openNew = () => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`lieky/all`, { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDrugs(data);
      });

    setOrder(emptyOrders);
    setAddOrderDialog(true);
  };

  //Add new order function
  const addOrder = () => {
    //Checking if there are any values below 0
    let _orders = [...products];
    let _order = { ...order };

    let checkPocet = true;
    if (selectedMedications.some((medication) => medication.quantity <= 0)) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Počet liekov musí byť kladný',
        life: 3000,
      });
      checkPocet = false;
    }

    //Checking if all medicines are unique
    let unique = true;

    if (addOrderDialog) {
      const selectedDrugs = selectedMedications.map(
        (medication) => medication.selectedDrug.NAZOV
      );
      const uniqueDrugs = new Set(selectedDrugs);

      if (selectedDrugs.length !== uniqueDrugs.size) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Lieky v zozname musia byť unikátne',
          life: 3000,
        });
        unique = false;
      }
    }

    //Add whole list and create new order
    if (unique && checkPocet && selectedMedications.length > 0) {
      const transformedData = selectedMedications.map((item) => ({
        name: item.selectedDrug.NAZOV,
        amount: item.quantity,
      }));
      formattedString = JSON.stringify(transformedData);

      insertData();

      const lastOrder = _orders[_orders.length - 1];
      _order.ID_OBJEDNAVKY = lastOrder ? lastOrder.ID_OBJEDNAVKY + 1 : 1;
      _order.ID_SKLAD = skladId;
      _order.ZOZNAM_LIEKOV = formattedString;

      var currentDate = new Date();
      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();

      _order.DATUM_OBJEDNAVKY = day + '.' + month + '.' + year;
      _orders.push(_order);

      console.log(_order);
      console.log(_orders);

      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Objednávka vola vytvorená',
        life: 3000,
      });

      setSelectedDrug(null);
      setSelectedMedications([]);
      setAddOrderDialog(false);
      setProducts(_orders);
      setOrder(emptyOrders);
    }
    hideDialog();
  };

  const deleteProduct = () => {
    let _orders = products.filter(
      (val) => val.ID_OBJEDNAVKY !== order.ID_OBJEDNAVKY
    );
    deleteOrder(order);
    setProducts(_orders);
    setDeleteProductDialog(false);
    setOrder(emptyOrders);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Objednávka bola odstránená',
      life: 3000,
    });
  };

  const confirmDeleteProduct = (product) => {
    setOrder(product);
    setDeleteProductDialog(true);
  };

  // Function to add selected medication to the list
  const addMedication = () => {
    setSelectedMedications([
      ...selectedMedications,
      { medication: '', quantity: 0 },
    ]);
  };

  // Function to remove medication from the list
  const removeMedication = (index) => {
    const updatedMedications = [...selectedMedications];
    updatedMedications.splice(index, 1);
    setSelectedMedications(updatedMedications);
  };

  /*
    ******************************************************************************************************************
                                                    Hide functions
    ******************************************************************************************************************
    */

  //Selected Order hide
  const onHide = () => {
    setXmlContent(null);
    setShowDialog(false);
    setSelectedRow(null);
  };

  //New order hide
  const hideDialog = () => {
    setSelectedDrug(null);
    setAddOrderDialog(false);
    setChangeProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  //New/Delete toolbar function
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label='New'
          icon='pi pi-plus'
          className='p-button-success mr-2'
          onClick={openNew}
        />
      </React.Fragment>
    );
  };

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDialog}
      />
      <Button
        label='Save'
        icon='pi pi-check'
        className='p-button-text'
        onClick={addOrder}
      />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-warning'
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label='No'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDeleteProductDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        className='p-button-text'
        onClick={deleteProduct}
      />
    </React.Fragment>
  );

  /*
    ----------------------------------------------------------------------------------------
    Page content
    ----------------------------------------------------------------------------------------
    */
  //Default page looks when it is loaded
  return (
    //Header DIV for adding new orders and for table
    <div>
      <Toast ref={toast} />

      <Toolbar className='mb-4' left={leftToolbarTemplate}></Toolbar>

      <DataTable
        value={products} //products
        selection={selectedRow} //selectedProducts
        selectionMode='single'
        onSelectionChange={(e) => (dialog ? handleClick(e.value) : '')}
        dataKey='ID_OBJEDNAVKY'
        globalFilter={NaN} //globalFilter
        globalFilterFields={[
          'ID_OBJEDNAVKY',
          'ID_SKLAD',
          'DATUM_OBJEDNAVKY',
          'DATUM_DODANIA',
        ]}
        filters={NaN} //filter
        header={NaN} //header
        responsiveLayout='scroll'
      >
        <Column
          field='ID_OBJEDNAVKY'
          header='Id objednavky'
          style={{ minWidth: '10rem' }}
        ></Column>
        <Column
          field='ID_SKLAD'
          header='Id skladu'
          style={{ minWidth: '8rem' }}
        ></Column>
        <Column
          field='DATUM_OBJEDNAVKY'
          header='Dátum objednania'
          style={{ minWidth: '12rem' }}
        ></Column>
        <Column
          field='DATUM_DODANIA'
          header='Dátum dodania'
          style={{ minWidth: '10rem' }}
        ></Column>
        <Column body={actionBodyTemplate} style={{ minWidth: '8rem' }}></Column>
      </DataTable>

      <Dialog
        visible={showDialog && dialog}
        style={{ width: '50vw' }}
        footer={NaN} //productDialogFooter
        onHide={() => onHide()}
      >
        {loading ? (
          <div style={{ width: '100%', display: 'flex' }}>
            <ProgressSpinner />
          </div>
        ) : selectedRow !== null ? (
          <div style={{ maxWidth: '100%', overflowWrap: 'break-word' }}>
            <h3>Zoznam objednaných liekov</h3>
            {xmlContent.map((item, index) => (
              <div key={index}>
                <p>Názov: {item.name}</p>
                <p>Počet: {item.amount}</p>
              </div>
            ))}
          </div>
        ) : (
          ''
        )}
      </Dialog>

      <Dialog
        visible={addOrderDialog}
        style={{ width: '500px', height: '700px' }}
        header='Pridať objednávku'
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <label>Zoznam liekov</label>
        {selectedMedications.map((selectedMedication, index) => (
          <div key={index} style={{ paddingTop: '20px' }}>
            <div className='field col'>
              <Dropdown
                style={{ width: 'auto' }}
                value={selectedMedication.selectedDrug}
                options={drugs}
                onChange={(e) => {
                  const updatedMedications = [...selectedMedications];
                  updatedMedications[index].selectedDrug = e.value;
                  setSelectedMedications(updatedMedications);
                }}
                optionLabel='NAZOV'
                placeholder='Vyberte liek'
              />
            </div>
            <label style={{ paddingLeft: '15px' }} htmlFor='quantity'>
              Počet
            </label>
            <div className='field col'>
              <InputNumber
                style={{ width: '100px' }}
                value={selectedMedication.quantity}
                onChange={(e) => {
                  const updatedMedications = [...selectedMedications];
                  updatedMedications[index].quantity = e.value;
                  setSelectedMedications(updatedMedications);
                }}
                integeronly
              />
              <Button
                style={{ marginLeft: '10px' }}
                icon='pi pi-times'
                onClick={() => removeMedication(index)}
              />
            </div>
          </div>
        ))}
        <div className={'submit-button'}>
          <Button
            style={{ width: '50%' }}
            label='Pridať do zoznamu'
            onClick={addMedication}
          />
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: '450px' }}
        header='Confirm'
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: '2rem' }}
          />
          {order && (
            <span>
              Naozaj chcete odstrániť objednávku s ID:{' '}
              <b>{order.ID_OBJEDNAVKY}</b> ?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
