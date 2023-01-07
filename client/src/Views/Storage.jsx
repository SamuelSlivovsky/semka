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
import '../App.css';

export default function Storage() {

    let emptyProduct = {
        id: null,
        drug_name: '',
        drug_quantity: null,
        drug_expiration: null
    };

    const [selectedDrug,setSelectedDrug] = useState(null);
    const [drugs, setDrugs] = useState(null);
    const [products, setProducts] = useState(null);
    const [addProductDialog, setAddProductDialog] = useState(false);  //vyskakuje pri zmene produktu
    const [changeProductDialog, setChangeProductDialog] = useState(false);  //vyskakuje pri zmene produktu
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);  //vyskakuje pri mazani produktu
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);  //vyskakuje pri mazani viacerych produktov
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null); //pamata si zvolene produkty v check boxe
    const [submitted, setSubmitted] = useState(false);    //pri zmeneni produktu uklada
    const [globalFilter, setGlobalFilter] = useState(null);   //filtre ?
    const toast = useRef(null);


    useEffect(() => {
    fetch(`sklad/all/${1}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
      

  }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const openNew = () => {   //otvori sa pri vytvarani noveho produktu
        if(drugs==null){
            fetch(`sklad/lieky/all`)
            .then((response) => response.json())
            .then((data) => {
            setDrugs(data);
              console.log(data);
            });
        }
       
        setProduct(emptyProduct);
        setSubmitted(false);
        setAddProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setSelectedDrug(null);
        setAddProductDialog(false);
        setChangeProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const findIndexById = (id) => {     //pri uprave treba najst ten ktory treba upravit
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    async function insertData() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_sarze: product.id,
            id_oddelenia: 1,
            nazov_lieku: product.drug_name,
            dat_expiracie: product.drug_expiration.toLocaleString("en-GB").replace(",", ""),
            pocet_liekov: product.drug_quantity,
          }),
        };
        const response = await fetch("/sklad/add", requestOptions).catch(err => console.log(err));
        console.log("RESPONSEE")
        console.log(response);
      }

    const saveProduct = () => {
        setSubmitted(true);
        if (product.drug_name && product.drug_expiration && product.drug_quantity && product.id) {
            insertData();
            let _products = [...products];
            let _product = {...product};
            // if (product.id) {
            //     const index = findIndexById(product.id);
            //     _products[index] = _product;
            //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Liek bol upravený', life: 3000 });
            // }
            // else {
            _products.push(_product);    
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Liek bol priadný', life: 3000 });
           // }

           
            setProducts(_products);
            setAddProductDialog(false);
            setChangeProductDialog(false);
            setSelectedDrug(null);
            setProduct(emptyProduct);
        }else
        {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Je potrebné vyplniť všetky polia', life: 3000 });
        }
    }

    const editProduct = (product) => {
        setProduct({...product});
        setChangeProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {
        let _products = products.filter(val => val.ID_SARZE !== product.ID_SARZE);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Liek odstránený', life: 3000 });
    }

    const setSelectedDrugFromDropdown = (e) =>{
        console.log(e.target.value)
        if(typeof e.target.value === 'undefined'){
            setSelectedDrug(null);
            onInputChange(null,'drug_name');
          }else{
            setSelectedDrug(e.target.value);
            onInputChange(e.target.value.NAZOV,'drug_name');
          }
        
    }


    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }


    const deleteSelectedProducts = () => {
        let _products = products.filter(val => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    //uprava existujucixh numerickych dat
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = {...product};
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const onInputChange = (val, name) => {
      let _product = {...product};
        _product[`${name}`] = val;
        setProduct(_product);
      
  }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Lieky</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText  value={globalFilter} onChange={(e)=>setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div className="storage-table">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    filterMatchMode = "startsWith"
                    dataKey="ID_SARZE" 
                    globalFilter={globalFilter}
                    header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="ID_SARZE" header="Id šarže" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="NAZOV" header="Názov lieku" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="POCET_LIEKOV" header="Počet liekov" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="DAT_EXPIRACIE" header="Dátum exspirácie" sortable style={{ minWidth: '10rem' }}></Column>
                 </DataTable>
            </div>
            
          {/*pridanie dat*/}
            <Dialog visible={addProductDialog} style={{ width: '500px' }} header="Pridať liek" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
              <div className="formgird grid">
                    <div className="field col">
                        <label htmlFor="id">Šarža</label>
                        <InputNumber id="id" value={product.drug_quantity} onValueChange={(e) => onInputNumberChange(e, 'id')} integeronly/>
                    </div>
              </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <Dropdown value={selectedDrug} options={drugs} onChange={(e)=>setSelectedDrugFromDropdown(e)} optionLabel="NAZOV" filter showClear filterBy="NAZOV" 
                        filterMatchMode="startsWith" placeholder="Vybrať liek" resetFilterOnHide required/>
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="drug_quantity">Počet</label>
                        <InputNumber id="drug_quantity" value={product.drug_quantity} onValueChange={(e) => onInputNumberChange(e, 'drug_quantity')} integeronly />
                    </div>
                </div>
                <div className="formgird grid">
                    <div className="field col">
                        <label htmlFor="drug_expiration">Dátum exspirácie</label>
                       <Calendar style={{ height: '400px' }} inline value={product.drug_expiration} onChange={(e) => onInputChange(e.value, 'drug_expiration')}></Calendar> 
                    </div>
              </div>
            </Dialog>

            {/*uprava dat*/}
            <Dialog visible={changeProductDialog} style={{ width: '500px' }} header={product.name} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="drug_quantity">Počet</label>
                        <InputNumber id="drug_quantity" value={product.drug_quantity} onValueChange={(e) => onInputNumberChange(e, 'drug_quantity')} integeronly  required/>
                    </div>
                </div>
                <div className="formgird grid">
                    <div className="field col">
                        <label htmlFor="drug_expiration">Dátum exspirácie</label>
                       <Calendar style={{ height: '400px' }} inline value={product.drug_expiration} onValueChange={(e) => onInputChange(e.target.value, 'drug_expiration')} /*onChange={(e) => setDate(e.value)}*/></Calendar> 
                        {/*<input type="date" id="drug_expiration" value={product.drug_quantity} onValueChange={(e) => onInputNumberChange(e, 'id')}  required/>*/}
                    </div>
              </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Naozaj chcete odstrániť tento liek<b>{product.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Naozaj chcete odstrániť zvolené lieky</span>}
                </div>
            </Dialog>
        </div>
    );
}
                 