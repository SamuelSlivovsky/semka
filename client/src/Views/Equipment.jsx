import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import GetUserData from '../Auth/GetUserData';
import '../App.css';

export default function Equipment() {
  let emptyProduct = {
    ID_VYBAVENIA: null,
    TYP: null,
    ZAOBSTARANIE: null,
    ECV: null,
  };

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [products, setProducts] = useState(null);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [changeProductDialog, setChangeProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filter, setFilter] = useState(null);
  const [department, setDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const toast = useRef(null);
  const token = localStorage.getItem('hospit-user');
  const userDataHelper = GetUserData(token);
  useEffect(() => {
    const headers = { authorization: 'Bearer ' + token };
    fetch(`vybavenie/all/${userDataHelper.UserInfo.userid}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
    initFilter();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initFilter = () => {
    setFilter({
      global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    setGlobalFilter('');
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filter = { ...filter };
    _filter['global'].value = value;

    setFilter(_filter);
    setGlobalFilter(value);
  };

  const hideDialog = () => {
    setSelectedEquipment(null);
    setAddProductDialog(false);
    setChangeProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].ID_LIEK === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  async function insertData() {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        cis_zam: userDataHelper.UserInfo.userid,
        typ: product.TYP,
        dat_zaobstarania: product.ZAOBSTARANIE.toLocaleString('en-GB').replace(
          ',',
          ''
        ),
      }),
    };
    const response = await fetch(
      '/api/vybavenie/addEquip',
      requestOptions
    ).catch((err) => console.log(err));
  }

  const saveProduct = () => {
    let filledCells = false;

    let _products = [...products];
    let _product = { ...product };

    if (
      (product.TYP && product.ZAOBSTARANIE && product.ECV) ||
      product.ID_ODDELENIA
    ) {
      insertData();
      _product.ZAOBSTARANIE =
        product.ZAOBSTARANIE.getDate() +
        '.' +
        (product.ZAOBSTARANIE.getMonth() + 1) +
        '.' +
        product.ZAOBSTARANIE.getFullYear();
      _products.push(_product);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Liek bol pridaný',
        life: 3000,
      });
      filledCells = true;
      setAddProductDialog(false);
      setSelectedEquipment(null);
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Je potrebné vyplniť všetky polia',
        life: 3000,
      });
    }
    if (filledCells) {
      setProducts(_products);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (rowData) => {
    setProduct({ ...rowData });
    setChangeProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter(
      (val) => val.ID_VYBAVENIA !== product.ID_VYBAVENIA
    );
    deleteEquip(product);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Liek odstránený',
      life: 3000,
    });
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    selectedProducts.map((selProduct) => deleteProduct(selProduct));
    let _products = products.filter((val) => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Products Deleted',
      life: 3000,
    });
  };

  const onInputTextChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputChange = (val, name) => {
    let _product = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

  async function editEquipment(_product) {
    const token = localStorage.getItem('hospit-user');

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        id_vybavenia: product.ID_VYBAVENIA,
        dat_zaobstarania: product.ZAOBSTARANIE.toLocaleString('en-GB').replace(
          ',',
          ''
        ),
      }),
    };
    await fetch('/api/sklad/updateEquipment', requestOptions);
  }

  async function deleteEquip(_product) {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        id_vybavenia: _product.ID_VYBAVENIA,
      }),
    };
    await fetch('/api/vybavenie/deleteEquip', requestOptions);
  }

  const openNew = () => {
    if (departments.length < 1) {
      const headers = { authorization: 'Bearer ' + token };
      fetch(`lekar/oddelenia/${userDataHelper.UserInfo.userid}`, { headers })
        .then((response) => response.json())
        .then((data) => {
          //setDepartments(data);
          let array = data.map((item) => {
            const { ...rest } = item;
            return {
              label: item.NAZOV,
              value: item.ID_ODDELENIA,
              ...rest,
            };
          });
          setDepartments(array);
        });
    }
    setAddProductDialog(true);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label='New'
          icon='pi pi-plus'
          className='p-button-success mr-2'
          onClick={() => openNew()}
        />
        <Button
          label='Delete'
          icon='pi pi-trash'
          className='p-button-danger'
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon='pi pi-pencil'
          className='p-button-rounded p-button-success mr-2'
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-warning'
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className='table-header'>
      <h5 className='mx-0 my-1'>Lieky</h5>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          value={globalFilter}
          onInput={(e) => {
            onGlobalFilterChange(e);
          }}
          placeholder='Search...'
        />
      </span>
    </div>
  );
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
        onClick
      />
    </React.Fragment>
  );
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
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label='No'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        className='p-button-text'
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <div className='storage-table'>
      <Toast ref={toast} />

      <div className='card'>
        <Toolbar className='mb-4' left={leftToolbarTemplate}></Toolbar>

        <DataTable
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey='ID_VYBAVENIA'
          globalFilter={globalFilter}
          globalFilterFields={['ID_VYBAVENIA', 'TYP', 'ZAOBSTARANIE']}
          filters={filter}
          header={header}
          responsiveLayout='scroll'
        >
          <Column
            selectionMode='multiple'
            headerStyle={{ width: '3rem' }}
          ></Column>
          <Column
            field='ID_VYBAVENIA'
            header='Id vybavenia'
            style={{ minWidth: '12rem' }}
          ></Column>
          <Column
            field='TYP'
            header='Typ'
            style={{ minWidth: '16rem' }}
          ></Column>
          <Column
            field='ZAOBSTARANIE'
            header='Dátum zaobstarania'
            style={{ minWidth: '10rem' }}
          ></Column>
          <Column
            field='MIESTO'
            header='Miesto'
            style={{ minWidth: '10rem' }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            style={{ minWidth: '8rem' }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={addProductDialog}
        style={{ width: '500px' }}
        header='Pridať liek'
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className='formgrid grid'>
          {' '}
          <div className='field col'>
            <label htmlFor='oddelenie'>Oddelenie</label>
            <Dropdown
              id='oddelenieDrop'
              value={department !== null ? department : ''}
              options={departments}
              onChange={(e) => {
                setDepartment(e.target.value);
              }}
            />
          </div>
        </div>
        <div className='formgrid grid'>
          <div className='field col'>
            <label htmlFor='ECV'>EČV</label>
            <InputText
              id='ECV'
              value={product.ECV}
              onValueChange={(e) => onInputTextChange(e, 'ECV')}
              integeronly
            />
          </div>
        </div>
        <div className='formgird grid'>
          <div className='field col'>
            <label htmlFor='ZAOBSTARANIE'>Dátum zaobstarania</label>
            <Calendar
              value={product.ZAOBSTARANIE}
              dateFormat='dd.mm.yy'
              onChange={(e) => onInputChange(e.value, 'ZAOBSTARANIE')}
            ></Calendar>
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={changeProductDialog}
        style={{ width: '500px' }}
        header={product.TYP}
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className='formgrid grid'>
          <div className='field col'>
            <label htmlFor='ECV'>Počet</label>
          </div>
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
          {product && (
            <span>
              Naozaj chcete odstrániť vybavenie <b>{product.TYP}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductsDialog}
        style={{ width: '450px' }}
        header='Confirm'
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: '2rem' }}
          />
          {product && <span>Naozaj chcete odstrániť zvolené vybavenie?</span>}
        </div>
      </Dialog>
    </div>
  );
}
