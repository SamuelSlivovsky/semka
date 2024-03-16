import React, {useEffect, useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {FilterMatchMode, FilterOperator} from "primereact/api";
import {useNavigate} from "react-router";
import GetUserData from "../Auth/GetUserData"
import {Toast} from "primereact/toast";

export default function ErrorLogs() {
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const toast = useRef(null);
    const [errorLogs, setErrorLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);
        const headers = {authorization: "Bearer " + token};
        fetch(`logs/getLogs`, {headers})
            .then((response) => {
                // Kontrola ci response je ok (status:200)
                if (response.ok) {
                    return response.json();
                } else if (response.status === 410) {
                    // Token expiroval redirect na logout
                    toast.current.show({
                        severity: 'error',
                        summary: "Časový limit relácie vypršal presmerovanie na prihlasovaciu stránku",
                        life: 999999999
                    });
                    setTimeout(() => {
                        navigate("/logout")
                    }, 3000)
                }
            })
            .then((data) => {
                setErrorLogs(data);
            });
    }, []);

    const onHide = () => {
        setShowDialog(false);
        setSelectedRow(null);
    };


    return (
        <div>
            <Toast ref={toast}/>
            <div className="card">
                <DataTable
                    value={errorLogs}
                    paginator={true}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    globalFilter={globalFilterValue}
                    filters={filters}
                    className="p-datatable-customers"
                    dataKey="id"
                    selection={selectedRow}
                    onSelectionChange={(e) => setSelectedRow(e.value)}
                >
                    <Column
                        field="ID_LOGU"
                        header="Id"
                        sortable
                        filter
                        filterMatchMode={FilterMatchMode.contains}
                    />
                    <Column
                        field="DATUM"
                        header="Datum"
                        sortable
                        filter
                        filterMatchMode={FilterMatchMode.contains}
                    />

                    <Column
                        field="TABULKA"
                        header="Tabulka"
                        sortable
                        filter
                        filterMatchMode={FilterMatchMode.contains}
                    />
                    <Column
                        field="TYP"
                        header="Status"
                        sortable
                        filter
                        filterMatchMode={FilterMatchMode
                            .contains}
                    />
                    <Column
                        field="POPIS"
                        header="Popis"
                        sortable
                        filter
                        filterMatchMode={FilterMatchMode.contains}
                    />
                    <Column
                        field="IP"
                        header="IP"
                        sortable
                        filter
                        filterMatchMode={FilterMatchMode.contains}
                    />
                    <Column
                        field="RIADOK"
                        header="Riadok"
                        sortable
                        filter
                        filterMatchMode={FilterMatchMode.contains}
                    />
                </DataTable>
            </div>
        </div>
    );
}