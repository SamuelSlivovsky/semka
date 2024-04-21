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
import {Dropdown} from "primereact/dropdown";
import "../styles/warehouses.css";
import {Calendar} from "primereact/calendar";
import {InputNumber} from "primereact/inputnumber";
import {useNavigate} from "react-router";

export default function WarehouseTransfers() {
    let emptyTransfer = {
        ID_PRESUN: null,
        ID_SKLAD_OBJ: null,
        ID_ODDELENIA_LIEKU: null,
        DATUM_PRESUNU: null,
        ZOZNAM_LIEKOV: null,
        STATUS: null
    };

    let emptyExpDate = {
        DAT_EXPIRACIE: null
    }

    let emptyAmount = {
        AMOUNT: null
    }

    let dialog = {
        dialog: true
    };

    let emptyHospital = {
        NAZOV: null,
        ID_NEMOCNICE: null
    };

    //Constants
    const toast = useRef(null);
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({});
    const [transfer, setTransfer] = useState(emptyTransfer);
    const [idOdd, setIdOdd] = useState(null);
    const [nazov, setNazov] = useState(null);
    const [hospitalSearchOption, setHospitalSearchOption] = useState(false);
    const [medicineSearchOption, setMedicineSearchOption] = useState(false);
    const [drugs, setDrugs] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedHospital, setSelectedHospital] = useState(emptyHospital);
    const [expirityDate, setExpirityDate] = useState(emptyExpDate);
    const [medAmount, setMedAmount] = useState(emptyAmount);
    const [showNewTransfer, setShowNewTransfer] = useState(false);
    const [waitingTransfers, setWaitingTransfers] = useState(null);
    const [finishedTransfers, setFinishedTransfers] = useState(null);
    const [deniedTransfers, setDeniedTransfers] = useState(null);
    const [requestedTransfers, setRequestedTransfers] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [hospitalMedications, setHospitalMedication] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showHospitalMedications, setShowHospitalMedications] = useState(false);
    const [showDeleteTransferDialog ,setDeleteTransferDialog] = useState(false);
    const [showSelectedMedicationsSearch, setShowSelectedMedicationsSearch] = useState(false);
    const [showConfirmTransferDialog, setShowConfirmTransferDialog] = useState(false);
    const [showDeniedTransferDialog, setShowDeniedTransferDialog] = useState(false);
    const [showExpirityDateTransferDialog, setShowExpirityDateTransferDialog] = useState(false);
    const [showAmountTransferDialog, setShowAmountTransferDialog] = useState(false);
    const [showMedAmountTransferDialog, setShowMedAmountTransferDialog] = useState(false);
    const [selectedMedications, setSelectedMedications] = useState([]);
    const [xmlContent, setXmlContent] = useState("");

    const dropdownOptions = [
        { value: 'hospital', label: 'Vyhľadať podľa nemocnice' },
        { value: 'medicine', label: 'Vyhľadať podľa liekov' },
        { value: 'expirity', label: 'Vyhľadať expirované lieky'},
        { value: 'amount', label: 'Vyhľadať podľa nedostatku liekov'},
        { value: 'medAmount', label: 'Vyhľadať podľa lieku a počtu'}
    ];


    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        const userDataHelper = GetUserData(token);

        //Finished transfers
        fetch(`presuny/allFin`, { headers })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                    // Kontrola ci je token expirovany (status:410)
                } else if (response.status === 410) {
                    // Token expiroval redirect na logout
                    toast.current.show({
                        severity: "error",
                        summary: "Session timeout redirecting to login page",
                        life: 999999999,
                    });
                    setTimeout(() => {
                        navigate("/logout");
                    }, 3000);
                }
            })
            .then((data) => {
                setFinishedTransfers(data);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        const userDataHelper = GetUserData(token);

        //Waiting transfers
        fetch(`/presuny/allWait/${userDataHelper.UserInfo.userid}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setWaitingTransfers(data);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        const userDataHelper = GetUserData(token);

        //Finished transfers
        fetch(`/presuny/allDec/${userDataHelper.UserInfo.userid}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setDeniedTransfers(data);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        const userDataHelper = GetUserData(token);

        //Finished transfers
        fetch(`/presuny/reqTransfers/${userDataHelper.UserInfo.userid}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setRequestedTransfers(data);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);
        const headers = { authorization: "Bearer " + token };
        fetch(`sklad/getIdOdd/${userDataHelper.UserInfo.userid}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setNazov(data[0].NAZOV_NEM);
                if(data[0].ID_ODDELENIA !== null) {
                    //Employee is from department
                    setIdOdd(true);
                } else if(data[0].ID_LEKARNE !== null) {
                    //Employee is from pharmacy
                    setIdOdd(true);
                    setNazov(data[0].NAZOV_LEK);
                }
            });
    }, []);

    /*
    ----------------------------------------------------------------------------------------
    Functions section
    ----------------------------------------------------------------------------------------
    */

    //Function for openning list of medication that are in JSON format
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
                        const zoznamLiekov = JSON.parse(jsonData[0].ZOZNAM_LIEKOV);

                        // Ensure that zoznamLiekov is always an array
                        const zoznamLiekovArray = Array.isArray(zoznamLiekov) ? zoznamLiekov : [zoznamLiekov];


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

    //Function for just openning Dialog menu
    const openNewTransfer = () => {
        setShowNewTransfer(true);
    }

    //Function for getting all hospitals from DB into Dropdown
    const getHospitalsList = () => {
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        fetch(`/presuny/getWarehouses`, { headers })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setHospitals(data);
            });
    }

    //Function for searching all medications that are in table medicine
    const getMedicationList = () => {
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        fetch(`lieky/all`, { headers })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setDrugs(data);
            });
    }

    //Function for creating new Transfer from selected hospital
    async function createHospitalTransfer() {
        //@TODO when creating Transfer Hospital and Department are not added into Array

        //Declaration of constants
        const _transfer = [...waitingTransfers];
        const _tr = {...emptyTransfer};
        let nonEmptyRows, transformedData, formattedString = null;

        //Getting rid of empty rows
        nonEmptyRows = hospitalMedications.filter(row => {
            return inputValues[row.ID_LIEK] !== undefined;
        });

        if(nonEmptyRows.length > 0) {
            //Sorting all data by ID_ODDELENIA
            nonEmptyRows.sort((a, b) => a.ID_ODDELENIA - b.ID_ODDELENIA);
            let finishedInserts = 0;

            //Grouping same ID_ODDELENIA into one position in array
            const groupedData = nonEmptyRows.reduce((acc, currentValue) => {
                const idOddelenia = currentValue.ID_ODDELENIA;
                if (!acc[idOddelenia]) {
                    acc[idOddelenia] = [];
                }
                acc[idOddelenia].push(currentValue);
                return acc;
            }, {});

            const arrays = Object.values(groupedData);

            for(const array of arrays) {
                //Creating JSON from data
                transformedData = array.map(row => ({
                    id: row.ID_LIEK,
                    name: row.NAZOV,
                    amount: inputValues[row.ID_LIEK]
                }));

                formattedString = JSON.stringify(transformedData);

                const token = localStorage.getItem("hospit-user");
                const userDataHelper = GetUserData(token);

                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + token,
                    },
                    body: JSON.stringify({
                        zoznam_liekov: formattedString,
                        id_oddelenia: array[0].ID_ODDELENIA,
                        user_id: userDataHelper.UserInfo.userid
                    }),
                };

                fetch(`/presuny/createTransfer`, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        if(data.message) {
                            toast.current.show({
                                severity: "error",
                                summary: "Error",
                                detail: data.message,
                                life: 3000,
                            });
                        } else {
                            finishedInserts++;

                            _tr.STATUS = "Cakajuca";
                            _tr.ZOZNAM_LIEKOV = JSON.stringify(formattedString);
                            _tr.ID_PRESUN = data[0].ID_PRESUN;
                            _tr.ID_SKLAD_OBJ = data[0].ID_SKLAD_OBJ;
                            _tr.ID_ODDELENIA_LIEKU = data[0].ID_ODDELENIA_LIEKU;

                            _transfer.push({..._tr});

                            if(finishedInserts === arrays.length) {
                                setShowHospitalMedications(false);
                                setWaitingTransfers(_transfer);
                                toast.current.show({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: "Presuny boli vytvorené",
                                    life: 3000,
                                });
                            }
                        }
                    });
            }
        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Musíte vyplniť požadovaný počet",
                life: 3000,
            });
        }

    }

    async function deleteTransferFromDB(_transfer) {
        const token = localStorage.getItem("hospit-user");
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                id_presun: _transfer.ID_PRESUN
            }),
        };
        fetch(`/presuny/deleteTransfer`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if(data.message) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: data.message,
                        life: 3000,
                    });
                }
            });
    }

    //Function that will send request onto DB to denie request and update it
    async function denieTransfer() {
        const token = localStorage.getItem("hospit-user");
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                id_pres: transfer.ID_PRESUN
            }),
        };

        fetch(`/presuny/deniedTransfer`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if(data.message) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: data.message,
                        life: 3000,
                    });
                }
            });
    }

    //Function for confirming transfer and updating data in DB
    async function confTransfer() {
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        //Fetch for getting JSON data from DB that contains all medications in PRESUN_LIEKOV for transfer
        fetch(`/presuny/list/${transfer.ID_PRESUN}`, { headers })
            .then((response) => response.json())
            .then(async (data) => {
                //Data now should contain JSON with all required medications for transfer, now it needs to be separated
                const zoznamLiekovArray = JSON.parse(data[0].ZOZNAM_LIEKOV);

                for (const medications of zoznamLiekovArray) {
                    console.log(medications);
                    const requestOptions = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: "Bearer " + token,
                        },
                        body: JSON.stringify({
                            id_pres: transfer.ID_PRESUN,
                            id_l: medications.id,
                            poc: medications.amount
                        }),
                    };
                    fetch(`/presuny/confirmTransfer`, requestOptions)
                        .then((response) => response.json())
                        .then((data) => {
                            if(data.message) {
                                toast.current.show({
                                    severity: "error",
                                    summary: "Error",
                                    detail: data.message,
                                    life: 3000,
                                });
                            }
                        });
                }

            });
    }

    //Function for searching medication in selected hospital
    const searchHospitalMedicine = () => {
        const token = localStorage.getItem("hospit-user");
        const headers = {authorization: "Bearer " + token};
        fetch(`presuny/hospitalMedications/${selectedHospital.ID_NEMOCNICE}`, {headers})
            .then((response) => response.json())
            .then((data) => {
                if(data.message) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: data.message,
                        life: 3000,
                    });
                } else {
                    console.log(data);
                    setHospitalMedication(data);
                    setShowHospitalMedications(true);
                    setShowSelectedMedicationsSearch(false);
                    setSelectedMedications([]);
                }
            });
    }

    const searchSelectedMedications = (selectedDrugs) => {
        const token = localStorage.getItem("hospit-user");
        const headers = {authorization: "Bearer " + token};
        const userDataHelper = GetUserData(token);
        let finishedFetches = 0;
        const newDataArray = [];

        console.log(selectedDrugs);
        for (let i = 0; i < selectedDrugs.length; i++) {
            const medication = selectedDrugs[i];
            //console.log(`Index ${i}:`, medication);
            fetch(`/presuny/selectedMedications/${medication.ID_LIEK}/${expirityDate.DAT_EXPIRACIE}/${userDataHelper.UserInfo.userid}`, {headers})
                .then((response) => response.json())
                .then((data) => {
                    if (data.length > 0) {
                        newDataArray.push(...data);
                    }
                    finishedFetches++;

                    if(finishedFetches === selectedDrugs.length && newDataArray.length > 0) {
                        setHospitalMedication(newDataArray);
                        setShowSelectedMedicationsSearch(true);
                        setShowHospitalMedications(false);
                    }
                });
        }
    }

    const searchExpiredMedications = () => {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                usr_id: userDataHelper.UserInfo.userid,
                exp_date: expirityDate.DAT_EXPIRACIE
            }),
        };

        fetch(`/sklad/getExpiredMedications`,  requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if(data.length > 0) {
                    searchSelectedMedications(data);
                    setShowSelectedMedicationsSearch(true);
                    setExpirityDate(emptyExpDate);
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Pre zadaný dátum neboli nájdené žiadne lieky",
                        life: 3000,
                    });
                }
            });
    }

    //Function for searching medications by input amount from employee warehouse
    const searchMedAmount = () => {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                usr_id: userDataHelper.UserInfo.userid,
                amount: medAmount.AMOUNT
            }),
        };

        fetch(`/sklad/getMedicationsByAmount`,  requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if(data.length > 0) {
                    searchSelectedMedications(data);
                    setShowSelectedMedicationsSearch(true);
                    setMedAmount(emptyAmount);
                } else if (data.message) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: data.message,
                        life: 3000,
                    });
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Pre zadaný počet neboli nájdené žiadne lieky",
                        life: 3000,
                    });
                }
            });
    }

    //Function for searching selected medications by amount
    const searchSelectedMedAmount = () => {

        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                usr_id: userDataHelper.UserInfo.userid,
                medications: selectedMedications
            }),
        };

        let insertedData = 0;
        let _transfers = [...waitingTransfers];
        let _transfer =  {...transfer};

        fetch(`/presuny/createTransferSelMedAmount`,  requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: data.message,
                        life: 3000,
                    });
                } else if(data.length > 0) {
                    //Adding returned data into array of requested transfers
                    for (const retData of data) {
                        _transfer.ID_PRESUN = retData.ID_PRESUN;
                        _transfer.ID_SKLAD_OBJ = retData.ID_SKLAD_OBJ;
                        _transfer.ID_ODDELENIA_LIEKU = retData.ID_ODDELENIA_LIEKU;
                        _transfer.DATUM_PRESUNU = retData.DATUM_PRESUNU;
                        _transfer.STATUS = retData.STATUS;
                        _transfers.push({..._transfer});
                        insertedData++;

                        if(insertedData === data.length) {
                            setWaitingTransfers(_transfers);
                            toast.current.show({
                                severity: "success",
                                summary: "Successful",
                                detail: "Presuny boli vytvorené",
                                life: 3000,
                            });
                        }
                    }
                }
            });

    }

    //Function for updating
    const handleDropdownChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        switch (selectedValue) {
            case 'hospital':
                setHospitalSearchOption(true);
                setShowMedAmountTransferDialog(false);
                setShowAmountTransferDialog(false);
                setMedicineSearchOption(false);
                setShowExpirityDateTransferDialog(false);
                if(hospitals.length <= null) {
                    getHospitalsList();
                }
                break;
            case 'medicine':
                setMedicineSearchOption(true);
                setShowMedAmountTransferDialog(false);
                setShowAmountTransferDialog(false);
                setHospitalSearchOption(false);
                setShowExpirityDateTransferDialog(false);
                if(drugs == null) {
                    getMedicationList();
                }
                break;
            case 'expirity':
                setShowExpirityDateTransferDialog(true);
                setShowMedAmountTransferDialog(false);
                setShowAmountTransferDialog(false);
                setMedicineSearchOption(false);
                setHospitalSearchOption(false);
                break;
            case 'amount':
                setShowAmountTransferDialog(true);
                setShowMedAmountTransferDialog(false);
                setShowExpirityDateTransferDialog(false);
                setMedicineSearchOption(false);
                setHospitalSearchOption(false);
                break;
            case 'medAmount':
                setShowMedAmountTransferDialog(true);
                setShowAmountTransferDialog(false);
                setShowExpirityDateTransferDialog(false);
                setMedicineSearchOption(false);
                setHospitalSearchOption(false);
                if(drugs == null) {
                    getMedicationList();
                }
                break;
        }
    };

    //Search function for searching medication
    const searchMedication = () => {
        setHospitalMedication(null);
        //Switch for checking user chosen option to search medications
        switch (selectedOption) {
            case 'hospital':
                if(selectedHospital.NAZOV !== null) {
                    searchHospitalMedicine();
                    hideDialog();
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Musíte vybrať nemocnicu",
                        life: 3000,
                    });
                }
                break;
            case 'medicine':
                if(selectedMedications.length > 0) {
                    const selectedDrugs = selectedMedications.map((medication) => medication.selectedDrug);
                    const uniqueDrugs = new Set(selectedDrugs);
                    if(selectedDrugs.length !== uniqueDrugs.size) {
                        //Medications are not unique
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: "Lieky v zozname musia byť unikátne",
                            life: 3000,
                        });
                    } else {
                        //Selected medications are unique
                        searchSelectedMedications(selectedDrugs);
                        hideDialog();
                    }
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Musíte vybrať aspoň jeden liek",
                        life: 3000,
                    });
                }
                break;
            case 'expirity':
                const date = new Date(expirityDate.DAT_EXPIRACIE);
                if(expirityDate.DAT_EXPIRACIE !== null && !isNaN(date.getTime())) {
                    //Date is valid and set
                    searchExpiredMedications();
                    hideDialog();
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Musíte zadať dátum expirácie",
                        life: 3000,
                    });
                }
                break;
            case 'amount':
                if(!isNaN(medAmount.AMOUNT) && medAmount.AMOUNT !== null) {
                    searchMedAmount();
                    hideDialog();
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Zadaný počet musí byť číslo",
                        life: 3000,
                    });
                }
                break;
            case 'medAmount':
                if(selectedMedications.length > 0) {
                    searchSelectedMedAmount();
                    hideDialog();
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Musíte vybrať liek zo zoznamu",
                        life: 3000,
                    });
                }
                break;
        }
    }

    //Function for checking number in Požadovaný počet, there should be only numbers and not greater then Počet
    const handleInputChange = (event, rowData) => {
        const { value } = event.target;
        const { ID_LIEK, POCET } = rowData;
        const numericValue = value === '' ? '' : Math.min(parseInt(value.replace(/\D/g, ''), 10), POCET);
        setInputValues(prevState => ({
            ...prevState,
            [ID_LIEK]: numericValue
        }));
    };

    const handleAmountChange = (e) => {
        const { value } = e.target;
        const numericValue = value.replace(/\D/g, '');
        setMedAmount({ AMOUNT: numericValue });
    }

    const confirmDeleteProduct = (product) => {
        setTransfer(product);
        setDeleteTransferDialog(true);
    }

    const deleteTransfer = () => {
        let _transfers = waitingTransfers.filter((val) => val.ID_PRESUN !== transfer.ID_PRESUN);
        deleteTransferFromDB(transfer);
        setWaitingTransfers(_transfers);
        setDeleteTransferDialog(false);
        setTransfer(emptyTransfer);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Presun bol odstránený",
            life: 3000,
        });
    }

    //Function for confirming requested transfer and then calling update fetch
    const confirmRequestedTransfer = () => {
        let _confirmedTransfers = finishedTransfers;
        let _requestedTransfers = requestedTransfers.filter((val) => val.ID_PRESUN !== transfer.ID_PRESUN);

        confTransfer();

        setFinishedTransfers(_confirmedTransfers);
        setRequestedTransfers(_requestedTransfers);
        hideConfirmDeniedDialog();

        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Presun bol potvrdený a počty liekov boli aktualizované",
            life: 3000,
        });
    }

    //Function for declining requested transfer and then updating that transfer, so it will be denied
    const deniedRequestedTransfer = () => {
        let _deniedTransfers = deniedTransfers;
        let _requestedTransfers = requestedTransfers.filter((val) => val.ID_PRESUN !== transfer.ID_PRESUN);

        denieTransfer();

        setRequestedTransfers(_requestedTransfers);
        setDeniedTransfers(_deniedTransfers);
        hideConfirmDeniedDialog();
        setTransfer(emptyTransfer);

        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Presun bol úspešne zamietnutý",
            life: 3000,
        });

    }

    // Function to remove medication from the list
    const removeMedication = (index) => {
        const updatedMedications = [...selectedMedications];
        updatedMedications.splice(index, 1);
        setSelectedMedications(updatedMedications);
    };

    // Function to add selected medication to the list
    const addMedication = () => {
        setSelectedMedications([...selectedMedications, { medication: "", quantity: 0, id: 0 }]);
    };

    //Functions for setting confirm/denied dialog TRUE false
    const confirmTransfer = (_transfer) => {
        setShowConfirmTransferDialog(true);
        setTransfer(_transfer);
    }

    const deniedTransfer = (_transfer) => {
        setShowDeniedTransferDialog(true);
        setTransfer(_transfer);
    }

    const hideConfirmDeniedDialog = () => {
        setShowDeniedTransferDialog(false);
        setShowConfirmTransferDialog(false);
        setTransfer(emptyTransfer);
    }

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
        setShowNewTransfer(false);
    };

    const hideDeleteTransferDialog = () => {
        setDeleteTransferDialog(false);
    }

    /*
    ******************************************************************************************************************
                                                    Functions for content
    ******************************************************************************************************************
    */

    //New/Delete toolbar function
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="Hľadať lieky"
                    icon="pi pi-plus"
                    className="p-button-success mr-2"
                    onClick={openNewTransfer}
                />
                <Button
                    visible={showHospitalMedications || showSelectedMedicationsSearch}
                    label="Vytvoriť presun"
                    icon="pi pi-check-square"
                    className="p-button-success mr-2"
                    onClick={createHospitalTransfer}
                />
            </React.Fragment>
        );
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={NaN} //hideDialog
            />
            <Button
                label="Save"
                icon="pi pi-check-square"
                className="p-button-text"
                onClick={NaN} //addOrder
            />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteProduct(rowData)}
                />
            </React.Fragment>
        );
    };

    const reqTransfersBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-check"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => confirmTransfer(rowData)}
                />
                <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-warning"
                    onClick={() => deniedTransfer(rowData)}
                />
            </React.Fragment>
        );
    };

    const deleteTransferDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDeleteTransferDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                className="p-button-text"
                onClick={deleteTransfer}
            />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />

            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

            {idOdd !== null ? <div style={{marginLeft: "20px"}}>
                    <h2>{nazov}</h2>
                </div> :
                <div style={{marginLeft: "20px"}}>
                    <h2>Centrálny sklad {nazov}</h2>
                </div>
            }

            {showHospitalMedications ? <div>
                <DataTable
                    value={hospitalMedications}
                    dataKey="DATUM_TRVANLIVOSTI"
                    paginator={true}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Zobrazuje sa {first} - {last} z celkových {totalRecords} záznamov"
                    rows={10}
                    rowsPerPageOptions={[15, 20]}
                >
                    <Column
                        field="DATUM_TRVANLIVOSTI"
                        header="Dátum trvanlivosti"
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="ID_LIEK"
                        header="Id lieku"
                        style={{ minWidth: "8rem" }}
                    ></Column>
                    <Column
                        field="NAZOV"
                        header="Názov lieku"
                        style={{ minWidth: "16rem" }}
                    ></Column>
                    <Column
                        field="TYP_ODDELENIA"
                        header="Oddelenie"
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="POCET"
                        header="Voľný počet na sklade"
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="Input"
                        header="Požadovaný počet"
                        style={{ minWidth: "10rem" }}
                        body={(rowData) => (
                            <input
                                type="text"
                                value={inputValues[rowData.ID_LIEK] || ''}
                                onChange={(e) => handleInputChange(e, rowData)}
                                pattern="[0-9]*" // Allow only numeric input
                                inputMode="numeric"
                            />
                        )}
                    ></Column>
                </DataTable>
            </div> : null}

            {showSelectedMedicationsSearch ? <div>
                <DataTable
                    value={hospitalMedications}
                    dataKey="ID_LIEK"
                    paginator={true}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Zobrazuje sa {first} - {last} z celkových {totalRecords} záznamov"
                    rows={10}
                    rowsPerPageOptions={[15, 20]}
                >
                    <Column
                        field="ID_LIEK"
                        header="Id lieku"
                        style={{ minWidth: "8rem" }}
                    ></Column>
                    <Column
                        field="NAZOV"
                        header="Názov lieku"
                        style={{ minWidth: "16rem" }}
                    ></Column>
                    <Column
                        field="DATUM_TRVANLIVOSTI"
                        header="Dátum trvanlivosti"
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="ID_ODDELENIA"
                        header="ID oddelenia"
                        style={{ minWidth: "10rem" }}
                    ></Column>
                    <Column
                        field="NEMOCNICA"
                        header="Názov nemocnice"
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="POCET"
                        header="Voľný počet na sklade"
                        style={{ minWidth: "10rem" }}
                    ></Column>
                    <Column
                        field="Input"
                        header="Požadovaný počet"
                        style={{ minWidth: "10rem" }}
                        body={(rowData) => (
                            <input
                                type="text"
                                value={inputValues[rowData.ID_LIEK] || ''}
                                onChange={(e) => handleInputChange(e, rowData)}
                                pattern="[0-9]*" // Allow only numeric input
                                inputMode="numeric"
                            />
                        )}
                    ></Column>
                </DataTable>
            </div> :null}

            <TabView>
                <TabPanel header="Čakajúce objednávky">
                    <DataTable
                        value={waitingTransfers}
                        selection={selectedRow}
                        selectionMode="single"
                        onSelectionChange={(e) => (dialog ? handleClick(e.value) : "")}
                        dataKey="ID_PRESUN"
                        globalFilter={NaN} //globalFilter
                        globalFilterFields={["ID_PRESUN","ID_SKLAD_OBJ", "NAZOV", "TYP_ODDELENIA", "DATUM_PRESUNU"]}
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
                            field="NAZOV"
                            header="Dodávajúca nemocnica"
                            style={{ minWidth: "14rem" }}
                        ></Column>
                        <Column
                            field="TYP_ODDELENIA"
                            header="Oddelenie"
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
                            body={actionBodyTemplate}
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
                        dataKey="ID_PRESUN"
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
                            field="NAZOV"
                            header="Dodávajúca nemocnica"
                            style={{ minWidth: "14rem" }}
                        ></Column>
                        <Column
                            field="TYP_ODDELENIA"
                            header="Oddelenie"
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
                    </DataTable>
                </TabPanel>

                <TabPanel header="Zamietnuté objednávky">
                    <DataTable
                        value={deniedTransfers}
                        selection={selectedRow}
                        selectionMode="single"
                        onSelectionChange={(e) => (dialog ? handleClick(e.value) : "")}
                        dataKey="ID_PRESUN"
                        globalFilter={NaN} //globalFilter
                        globalFilterFields={["ID_PRESUN","ID_SKLAD_OBJ", "ID_ODDELENIA_LIEKU", "DATUM_PRESUNU"]}
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
                            field="NAZOV"
                            header="Dodávajúca nemocnica"
                            style={{ minWidth: "14rem" }}
                        ></Column>
                        <Column
                            field="TYP_ODDELENIA"
                            header="Oddelenie"
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
                    </DataTable>
                </TabPanel>

                <TabPanel header="Požadované presuny">
                    <DataTable
                        value={requestedTransfers}
                        selection={selectedRow}
                        selectionMode="single"
                        onSelectionChange={(e) => (dialog ? handleClick(e.value) : "")}
                        dataKey="ID_PRESUN"
                        globalFilter={NaN} //globalFilter
                        globalFilterFields={["ID_PRESUN","ID_SKLAD_OBJ", "ID_ODDELENIA_LIEKU", "DATUM_PRESUNU"]}
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
                            field="NAZOV"
                            header="Objednávajúca nemocnica"
                            style={{ minWidth: "14rem" }}
                        ></Column>
                        <Column
                            field="TYP_ODDELENIA"
                            header="Objednávajúce oddelenie"
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
                            body={reqTransfersBodyTemplate}
                            style={{ minWidth: "8rem" }}
                        ></Column>
                    </DataTable>
                </TabPanel>
            </TabView>

            <Dialog
                visible={showDialog && dialog}
                style={{ width: "40vw" }}
                //footer={NaN} //productDialogFooter
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
                                <h4>ID lieku: {item.id}</h4>
                                <p>Názov: {item.name}</p>
                                <p>Počet: {item.amount}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    ""
                )}
            </Dialog>

            <Dialog
                visible={showNewTransfer}
                style={{ width: "500px"}}
                header="Pridať objednávku"
                modal
                className="p-fluid"
                //footer={productDialogFooter}
                onHide={hideDialog}
            >
                <Dropdown
                    value={selectedOption}
                    options={dropdownOptions}
                    onChange={handleDropdownChange}
                />
                {hospitalSearchOption ? <div>
                    <h2>Hladanie liekov podľa nemocnice</h2>
                    <div className="formgrid grid">
                        <div className="field col">
                            <Dropdown
                                style={{width: "auto"}}
                                value={selectedHospital}
                                options={hospitals.map(hospital => ({ value: hospital, label: hospital.NAZOV }))}
                                onChange={(selectedOption) => {
                                    setSelectedHospital(selectedOption.value);
                                }}
                                optionLabel="label"
                                filter
                                showClear
                                filterBy="label"
                                filterMatchMode="startsWith"
                                placeholder="Vyberte nemocnicu"
                                resetFilterOnHide
                                required
                            />
                        </div>
                    </div>
                </div> : null}

                {medicineSearchOption ? <div>
                    <h2>Hľadanie podľa zoznamu liekov</h2>
                    <div>
                        {selectedMedications.map((selectedMedication, index) => (
                            <div key={index} style={{paddingTop: "20px"}}>
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <Dropdown
                                            style={{width: "auto"}}
                                            value={selectedMedication.selectedDrug}
                                            options={drugs}
                                            onChange={(e) => {
                                                const updatedMedications = [...selectedMedications];
                                                updatedMedications[index].selectedDrug = e.value;
                                                setSelectedMedications(updatedMedications);
                                            }}
                                            optionLabel="NAZOV"
                                            filter
                                            showClear
                                            filterBy="NAZOV"
                                            filterMatchMode="startsWith"
                                            placeholder="Vyberte liek"
                                            resetFilterOnHide
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        style={{marginLeft: "10px"}}
                                        icon="pi pi-times"
                                        onClick={() => removeMedication(index)}
                                    />
                                </div>
                            </div>
                        ))}
                    <div className={"submit-button"}>
                        <Button style={{width: "15%"}} label="+" onClick={addMedication} />
                    </div>
                        </div>
                </div> : null}
                {showExpirityDateTransferDialog ? <div>
                    <h2>Hľadanie podľa expirácie lieku</h2>
                    <div className="formgird grid">
                        <div className="field col" style={{paddingTop: "50px"}}>
                            <label htmlFor="DAT_EXPIRACIE">Dátum expirácie</label>
                            <Calendar
                                value={expirityDate.DAT_EXPIRACIE}
                                dateFormat="dd.mm.yy"
                                onChange={(e) =>
                                    setExpirityDate({ ...expirityDate, DAT_EXPIRACIE: e.value })
                                }
                            ></Calendar>
                        </div>
                    </div>
                </div> : null}
                {showAmountTransferDialog ? <div>
                    <h2>Hladanie podľa počtu liekov</h2>
                    <div>
                        <input
                            type="text"
                            value={medAmount.AMOUNT || ''}
                            onChange={handleAmountChange}
                            pattern="[0-9]*"
                            inputMode="numeric"
                        />
                        <label
                            style={{
                                paddingLeft: "10px",
                                cursor: 'pointer'
                            }}
                            onMouseEnter={() => setShowHint(true)}
                            onMouseLeave={() => setShowHint(false)}
                        >
                            ?
                        </label>
                        {showHint && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: 'white',
                                    padding: '5px',
                                    border: '1px solid black',
                                    borderRadius: '3px',
                                    zIndex: '999'
                                }}
                            >
                                Podľa zadaného počtu sa budú hľadať lieky v iných skladoch, ktorých počet je menší ako zadaný.
                            </div>
                        )}
                    </div>
                </div> : null}
                { showMedAmountTransferDialog ? <div>

                    {selectedMedications.map((selectedMedication, index) => (
                        <div key={index} style={{paddingTop: "20px"}}>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <Dropdown
                                        style={{width: "auto"}}
                                        value={selectedMedication.selectedDrug}
                                        options={drugs}
                                        onChange={(e) => {
                                            const updatedMedications = [...selectedMedications];
                                            updatedMedications[index].selectedDrug = e.value;
                                            setSelectedMedications(updatedMedications);
                                        }}
                                        optionLabel="NAZOV"
                                        filter
                                        showClear
                                        filterBy="NAZOV"
                                        filterMatchMode="startsWith"
                                        placeholder="Vyberte liek"
                                        resetFilterOnHide
                                        required
                                    />
                                </div>
                            </div>
                            <label style={{paddingLeft: "15px"}} htmlFor="quantity">Počet</label>
                            <div className="field col">
                                <InputNumber
                                    style={{width: "100px"}}
                                    value={selectedMedication.quantity}
                                    onChange={(e) => {
                                        const updatedMedications = [...selectedMedications];
                                        updatedMedications[index].quantity = e.value;
                                        setSelectedMedications(updatedMedications);
                                    }}
                                    integeronly
                                />
                                <Button
                                    style={{marginLeft: "10px"}}
                                    icon="pi pi-times"
                                    onClick={() => removeMedication(index)}
                                />
                            </div>
                        </div>
                    ))}
                    <div className={"submit-button"}>
                        <Button style={{width: "15%"}} label="+" onClick={addMedication} />
                    </div>
                </div> : null}
                {hospitalSearchOption || medicineSearchOption || showExpirityDateTransferDialog
                || showAmountTransferDialog || showMedAmountTransferDialog ?
                    <div className={"submit-button"}>
                    <Button style={{width: "50%"}} label="Vyhľadať" onClick={searchMedication} />
                </div> : null}
            </Dialog>

            <Dialog
                visible={showDeleteTransferDialog}
                style={{ width: "450px" }}
                header="Confirm"
                modal
                footer={deleteTransferDialogFooter}
                onHide={hideDeleteTransferDialog}
            >
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem" }}
                    />
                    {transfer && (
                        <span>
              Naozaj chcete odstrániť presun s ID: <b>{transfer.ID_PRESUN}</b> ?
            </span>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={showConfirmTransferDialog}
                style={{ width: "500px" }}
                header="Naozaj chcete potvrdiť presun?"
                modal
                onHide={hideConfirmDeniedDialog}
            >
                <div className={"submit-button"}>
                    <Button style={{width: "45%"}} label="Potvrdiť presun" onClick={confirmRequestedTransfer} />
                    <Button style={{width: "45%", backgroundColor: "red"}} label="Zrušiť" onClick={confirmRequestedTransfer} />
                </div>
            </Dialog>

            <Dialog
                visible={showDeniedTransferDialog}
                style={{ width: "500px" }}
                header="Chcete zamietnuť presun?"
                modal
                onHide={hideConfirmDeniedDialog}
            >
                <div className={"submit-button"}>
                    <Button style={{width: "45%"}} label="Zamietnuť presun" onClick={deniedRequestedTransfer} />
                    <Button style={{width: "45%", backgroundColor: "red"}} label="Zrušiť" onClick={confirmRequestedTransfer} />
                </div>
            </Dialog>
        </div>
    );
}