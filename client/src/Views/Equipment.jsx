import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import GetUserData from "../Auth/GetUserData";
import "../App.css";

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
  const [globalFilter, setGlobalFilter] = useState("");
  const [filter, setFilter] = useState(null);
  const [department, setDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const toast = useRef(null);

  const oddelenie = 3;

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(`vybavenie/all/${oddelenie}`, { headers })
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
    setGlobalFilter("");
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filter = { ...filter };
    _filter["global"].value = value;

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

  /*async function insertData() {
    const token = localStorage.getItem("hospit-user");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id_oddelenia: oddelenie,
        nazov_lieku: product.NAZOV,
        dat_expiracie: product.DAT_EXPIRACIE.toLocaleString("en-GB").replace(
          ",",
          ""
        ),
        pocet: product.POCET,
      }),
    };
    const response = await fetch("/sklad/add", requestOptions).catch((err) =>
      console.log(err)
    );
    console.log(response);
  }*/

  /* const saveProduct = () => {
    let filledCells = false;

    let _products = [...products];
    let _product = { ...product };

    let checkPocet = true;
    if (product.POCET <= 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Počet liekov musí byť kladný",
        life: 3000,
      });
      console.log("Pocet je zaporny");
      checkPocet = false;
    }

    if (addProductDialog) {
      let sarzaExists = false;
      products.map((p) => {
        if (p.ID_LIEK === product.ID_LIEK) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Šarža musí byť unikátna",
            life: 3000,
          });
          console.log("Sarza uz existuje");
          sarzaExists = true;
        }
        return "";
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
            "." +
            (product.DAT_EXPIRACIE.getMonth() + 1) +
            "." +
            product.DAT_EXPIRACIE.getFullYear();
          _products.push(_product);
          console.log("_products po pushnuti");
          console.log(_products);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Liek bol pridaný",
            life: 3000,
          });
          filledCells = true;
          setAddProductDialog(false);
          setSelectedDrug(null);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Je potrebné vyplniť všetky polia",
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
          severity: "success",
          summary: "Successful",
          detail: "Liek bol upravený",
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
  };*/

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
      severity: "success",
      summary: "Successful",
      detail: "Liek odstránený",
      life: 3000,
    });
  };

  const setSelectedDrugFromDropdown = (e) => {
    if (typeof e.target.value === "undefined") {
      selectedEquipment(null);
      onInputChange(null, "NAZOV");
    } else {
      setSelectedEquipment(e.target.value);
      onInputChange(e.target.value.NAZOV, "NAZOV");
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
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
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

  async function editDrug(_product) {
    const token = localStorage.getItem("hospit-user");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id_liek: product.ID_LIEK,
        pocet: product.POCET,
        dat_expiracie: product.DAT_EXPIRACIE.toLocaleString("en-GB").replace(
          ",",
          ""
        ),
      }),
    };
    await fetch("/sklad/updateQuantity", requestOptions);
  }

  async function deleteSarza(_product) {
    const token = localStorage.getItem("hospit-user");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id_vybavenia: _product.ID_VYBAVENIA,
      }),
    };
    await fetch("/vybavenie/deleteEquip", requestOptions);
  }

  const openNew = () => {
    if (departments.length < 1) {
      const token = localStorage.getItem("hospit-user");
      const userDataHelper = GetUserData(token);
      const headers = { authorization: "Bearer " + token };
      console.log(userDataHelper);
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
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={() => openNew()}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
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
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Lieky</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={globalFilter}
          onInput={(e) => {
            onGlobalFilterChange(e);
          }}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick
      />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <div className="storage-table">
      <Toast ref={toast} />

      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="ID_VYBAVENIA"
          globalFilter={globalFilter}
          globalFilterFields={[
            "ID_VYBAVENIA",
            "NAZOV",
            "POCET",
            "DAT_EXPIRACIE",
          ]}
          filters={filter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            field="ID_VYBAVENIA"
            header="Id vybavenia"
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="TYP"
            header="Typ"
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="ZAOBSTARANIE"
            header="Dátum zaobstarania"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="MIESTO"
            header="Miesto"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={addProductDialog}
        style={{ width: "500px" }}
        header="Pridať liek"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className="formgrid grid">
          {" "}
          <div className="field col">
            <label htmlFor="oddelenie">Oddelenie</label>
            <Dropdown
              id="oddelenieDrop"
              value={department !== null ? department : ""}
              options={departments}
              onChange={(e) => {
                setDepartment(e.target.value);
                console.log(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="ECV">EČV</label>
            <InputText
              id="ECV"
              value={product.ECV}
              onValueChange={(e) => onInputTextChange(e, "ECV")}
              integeronly
            />
          </div>
        </div>
        <div className="formgird grid">
          <div className="field col">
            <label htmlFor="ZAOBSTARANIE">Dátum zaobstarania</label>
            <Calendar
              value={product.ZAOBSTARANIE}
              dateFormat="dd.mm.yy"
              onChange={(e) => onInputChange(e.value, "ZAOBSTARANIE")}
            ></Calendar>
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={changeProductDialog}
        style={{ width: "500px" }}
        header={product.NAZOV}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="ECV">Počet</label>
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
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
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && <span>Naozaj chcete odstrániť zvolené vybavenie?</span>}
        </div>
      </Dialog>
    </div>
  );
}
