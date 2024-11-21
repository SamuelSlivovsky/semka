import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import GetUserData from '../Auth/GetUserData';
import '../App.css';

export default function Storage() {
  let emptyProduct = {
    ID_LIEK: null,
    ID_ODDELENIA: null,
    NAZOV: null,
    POCET: null,
    DAT_EXPIRACIE: null,
  };

  const [selectedDrug, setSelectedDrug] = useState(null);
  const [drugs, setDrugs] = useState(null);
  const [products, setProducts] = useState(null);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [changeProductDialog, setChangeProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filter, setFilter] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const userDataHelper = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    fetch(`sklad/all/${userDataHelper.UserInfo.userid}`, { headers })
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

  const openNew = () => {
    if (drugs == null) {
      const token = localStorage.getItem('hospit-user');
      const headers = { authorization: 'Bearer ' + token };
      fetch(`lieky/all`, { headers })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setDrugs(data);
        });
    }

    setProduct(emptyProduct);
    setAddProductDialog(true);
  };

  const hideDialog = () => {
    setSelectedDrug(null);
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
        id_oddelenia: 216,
        nazov_lieku: product.NAZOV,
        dat_expiracie: product.DAT_EXPIRACIE.toLocaleString('en-GB').replace(
          ',',
          ''
        ),
        pocet: product.POCET,
      }),
    };
    const response = await fetch('/api/sklad/add', requestOptions).catch(
      (err) => console.log(err)
    );
  }

  const saveProduct = () => {
    let filledCells = false;
    let _products = [...products];
    let _product = { ...product };

    let checkPocet = true;
    if (product.POCET <= 0) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Počet liekov musí byť kladný',
        life: 3000,
      });
      checkPocet = false;
    }

    if (addProductDialog) {
      let sarzaExists = false;
      products.map((p) => {
        if (p.ID_LIEK === product.ID_LIEK) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Šarža musí byť unikátna',
            life: 3000,
          });
          sarzaExists = true;
        }
        return '';
      });
      if (!sarzaExists && checkPocet) {
        if (
          product.NAZOV &&
          product.DAT_EXPIRACIE &&
          product.POCET &&
          product.ID_LIEK
        ) {
          insertData();
          _product.DAT_EXPIRACIE =
            product.DAT_EXPIRACIE.getDate() +
            '.' +
            (product.DAT_EXPIRACIE.getMonth() + 1) +
            '.' +
            product.DAT_EXPIRACIE.getFullYear();
          _products.push(_product);
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Liek bol pridaný',
            life: 3000,
          });
          filledCells = true;
          setAddProductDialog(false);
          setSelectedDrug(null);
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Je potrebné vyplniť všetky polia',
            life: 3000,
          });
        }
      }
    } else {
      if (checkPocet) {
        const index = findIndexById(product.ID_LIEK);
        _products[index] = _product;
        setProduct(product);
        editDrug(_product);
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Liek bol upravený',
          life: 3000,
        });
        filledCells = true;
        setChangeProductDialog(false);
      }
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
    let _products = products.filter((val) => val.ID_LIEK !== product.ID_LIEK);
    deleteSarza(product);
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

  const setSelectedDrugFromDropdown = (e) => {
    if (typeof e.target.value === 'undefined') {
      setSelectedDrug(null);
      onInputChange(null);
    } else {
      setSelectedDrug(e.target.value);
      onInputChange(e.target.value);
    }
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    selectedProducts.map((selProduct) => deleteSarza(selProduct));
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

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputChange = (val) => {
    let _product = { ...product };
    _product[`NAZOV`] = val.NAZOV;
    _product['ID_LIEK'] = val.ID_LIEK;
    setProduct(_product);
  };

  async function editDrug(_product) {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        id_liek: product.ID_LIEK,
        pocet: product.POCET,
        dat_expiracie: product.DAT_EXPIRACIE.toLocaleString('en-GB').replace(
          ',',
          ''
        ),
      }),
    };
    const response = await fetch('/api/sklad/updateQuantity', requestOptions);
  }

  async function deleteSarza(_product) {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        id_liek: _product.ID_LIEK,
        datum: product.DAT_EXPIRACIE.toLocaleString('en-GB').replace(',', ''),
      }),
    };
    const response = await fetch('/api/sklad/deleteSarza', requestOptions);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label='New'
          icon='pi pi-plus'
          className='p-button-success mr-2'
          onClick={openNew}
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
        onClick={saveProduct}
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
          dataKey='ID_LIEK'
          globalFilter={globalFilter}
          globalFilterFields={[
            'ID_LIEK',
            'ID_ODDELENIA',
            'NAZOV',
            'POCET',
            'DAT_EXPIRACIE',
          ]}
          filters={filter}
          header={header}
          responsiveLayout='scroll'
        >
          <Column
            selectionMode='multiple'
            headerStyle={{ width: '3rem' }}
          ></Column>
          <Column
            field='ID_LIEK'
            header='Id lieku'
            style={{ minWidth: '12rem' }}
          ></Column>
          <Column
            field='ID_ODDELENIA'
            header='Id oddelenia'
            style={{ minWidth: '16rem' }}
          ></Column>
          <Column
            field='NAZOV'
            header='Názov lieku'
            style={{ minWidth: '16rem' }}
          ></Column>
          <Column
            field='POCET'
            header='Počet liekov'
            style={{ minWidth: '10rem' }}
          ></Column>
          <Column
            field='DAT_EXPIRACIE'
            header='Dátum expirácie'
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
          <div className='field col'>
            <Dropdown
              value={selectedDrug}
              options={drugs}
              onChange={(e) => setSelectedDrugFromDropdown(e)}
              optionLabel='NAZOV'
              filter
              showClear
              filterBy='NAZOV'
              filterMatchMode='startsWith'
              placeholder='Vybrať liek'
              resetFilterOnHide
              required
            />
          </div>
        </div>
        <div className='formgrid grid'>
          <div className='field col'>
            <label htmlFor='POCET'>Počet</label>
            <InputNumber
              id='POCET'
              value={product.POCET}
              onValueChange={(e) => onInputNumberChange(e, 'POCET')}
              integeronly
            />
          </div>
        </div>
        <div className='formgird grid'>
          <div className='field col'>
            <label htmlFor='DAT_EXPIRACIE'>Dátum expirácie</label>
            <Calendar
              value={product.DAT_EXPIRACIE}
              inline
              dateFormat='dd.mm.yy'
              onChange={(e) =>
                setProduct({ ...product, DAT_EXPIRACIE: e.value })
              }
            ></Calendar>
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={changeProductDialog}
        style={{ width: '500px' }}
        header={product.NAZOV}
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className='formgrid grid'>
          <div className='field col'>
            <label htmlFor='POCET'>Počet</label>
            <InputNumber
              id='POCET'
              value={product.POCET}
              onValueChange={(e) => onInputNumberChange(e, 'POCET')}
              integeronly
              required
            />
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
              Naozaj chcete odstrániť liek <b>{product.NAZOV}</b>?
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
          {product && <span>Naozaj chcete odstrániť zvolené lieky?</span>}
        </div>
      </Dialog>
    </div>
  );
}
