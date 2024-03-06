import {TabPanel, TabView} from "primereact/tabview";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import React, {useEffect, useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import GetUserData from "../Auth/GetUserData";
import {ProgressSpinner} from "primereact/progressspinner";
import {Dialog} from "primereact/dialog";

export default function WarehouseTransfers() {
    let emptyTransfer = {
        ID_PRESUN: null,
        ID_SKLAD_OBJ: null,
        ID_SKLAD_PRIJ: null,
        DATUM_PRESUNU: null,
        ZOZNAM_LIEKOV: null,
        STATUS: null
    };

    let dialog = {
        dialog: true
    };

    //Constants
    const toast = useRef(null);
    const [newTransfer, setNewTransfer] = useState(emptyTransfer);
    const [waitingTransfers, setWaitingTransfers] = useState(null);
    const [finishedTransfers, setFinishedTransfers] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [xmlContent, setXmlContent] = useState("");


    useEffect(() => {
        //@TODO function for getting data to both tableviews, need 2 fetches
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);
        const headers = { authorization: "Bearer " + token };

        //Finished transfers
        fetch(`presuny/allFin`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setFinishedTransfers(data);
            });

        //Waiting transfers
        fetch(`presuny/allWait`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setWaitingTransfers(data);
            });
    }, []);

    /*
    ----------------------------------------------------------------------------------------
    Functions section
    ----------------------------------------------------------------------------------------
    */

    const handleClick = (value) => {
        setShowDialog(true);
        setLoading(true);
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        setSelectedRow(value);

        fetch(`/presuny/list/${value.ID_PRESUN}`, { headers })
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


    //@TODO needs to be changed to suit this site
    //New/Delete toolbar function
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="New"
                    icon="pi pi-plus"
                    className="p-button-success mr-2"
                    onClick={NaN} //openNew
                />
                <Button
                    label="Delete"
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={NaN} /*confirmDeleteSelected*/
                    disabled={NaN} /*!selectedProducts || !selectedProducts.length*/
                />
            </React.Fragment>
        );
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

    return (
        <div>
            <Toast ref={toast} />

            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

            <TabView>
                //Tab for pending orders
                <TabPanel header="Čakajúce objednávky">
                    <DataTable
                        value={waitingTransfers}
                        selection={selectedRow}
                        selectionMode="single"
                        onSelectionChange={(e) => (dialog ? handleClick(e.value) : "")}
                        dataKey="ID_LIEK"
                        globalFilter={NaN} //globalFilter
                        globalFilterFields={["ID_PRESUN","ID_SKLAD_OBJ", "ID_SKLAD_PRIJ", "DATUM_PRESUNU"]}
                        filters={NaN} //filter
                        header={NaN} //header
                        responsiveLayout="scroll"
                    >
                        <Column
                            field="ID_PRESUN"
                            header="Id presunu"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="ID_SKLAD_OBJ"
                            header="Id objednávajúceho skladu"
                            style={{ minWidth: "16rem" }}
                        ></Column>
                        <Column
                            field="ID_SKLAD_PRIJ"
                            header="Id prijímajúceho skladu"
                            style={{ minWidth: "14rem" }}
                        ></Column>
                        <Column
                            field="DATUM_PRESUNU"
                            header="Dátum presunu"
                            style={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            field="STATUS"
                            header="Status presunu"
                            style={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            body={NaN} //actionBodyTemplate
                            style={{ minWidth: "8rem" }}
                        ></Column>
                    </DataTable>
                </TabPanel>


                //Tab for finished orders
                <TabPanel header="Vybavené objednávky">
                    <DataTable
                        value={finishedTransfers}
                        selection={selectedRow}
                        selectionMode="single"
                        onSelectionChange={(e) => (dialog ? handleClick(e.value) : "")}
                        dataKey="ID_LIEK"
                        globalFilter={NaN} //globalFilter
                        globalFilterFields={["","ID_SKLAD_OBJ", "ID_SKLAD_PRIJ", "DATUM_PRESUNU"]}
                        filters={NaN} //filter
                        header={NaN} //header
                        responsiveLayout="scroll"
                    >
                        <Column
                            field="ID_PRESUN"
                            header="Id presunu"
                            style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                            field="ID_SKLAD_OBJ"
                            header="Id objednávajúceho skladu"
                            style={{ minWidth: "16rem" }}
                        ></Column>
                        <Column
                            field="ID_SKLAD_PRIJ"
                            header="Id prijímajúceho skladu"
                            style={{ minWidth: "14rem" }}
                        ></Column>
                        <Column
                            field="DATUM_PRESUNU"
                            header="Dátum presunu"
                            style={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            field="STATUS"
                            header="Status presunu"
                            style={{ minWidth: "10rem" }}
                        ></Column>
                        <Column
                            body={NaN} //actionBodyTemplate
                            style={{ minWidth: "8rem" }}
                        ></Column>
                    </DataTable>
                </TabPanel>
            </TabView>

            <Dialog
                visible={showDialog && dialog}
                style={{ width: "50vw" }}
                footer={NaN} //productDialogFooter
                onHide={() => onHide()}
            >
                {loading ? (
                    <div style={{ width: "100%", display: "flex" }}>
                        <ProgressSpinner />
                    </div>
                ) : selectedRow !== null ? (
                    <div style={{ maxWidth: "100%", overflowWrap: "break-word" }}>
                        <h3>Zoznam objednaných liekov</h3>
                        {xmlContent.map((item, index) => (
                            <div key={index}>
                                <p>Názov: {item.name}</p>
                                <p>Počet: {item.amount}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    ""
                )}
            </Dialog>

        </div>
    );
}