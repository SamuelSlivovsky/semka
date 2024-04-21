import {Chart} from "primereact/chart";
import {Toast} from "primereact/toast";
import React, {useEffect, useRef, useState} from "react";
import GetUserData from "../Auth/GetUserData";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";

export default function WarehouseStatistics() {

    //Declaration of Constants
    const toast = useRef(null);
    const [name, setName] = useState(null);
    const [medAmount, setMedAmount] = useState(null);
    const [warehouseMedications, setWarehouseMedications] = useState([]);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [avgAmount, setAvgAmout] = useState(null);
    const [requestedOrdersAmount, setRequestedOrdersAmount] = useState(null);
    const [finishedOrdersAmount, setFinishedOrdersAmount] = useState(null);
    const [requestedTransfersAmount, setRequestedTransfersAmount] = useState(null);
    const [finishedTransfersAmount, setFinishedTransfersAmount] = useState(null);
    const [deniedTransfersAmount, setDeniedTransfersAmount] = useState(null);
    const [requestedDeprTransfersAmount, setRequestedDeprTransfersAmount] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [showOrderDialog, setShowOrderDialog] = useState(false);
    const [firstChartData, setFirstChartData] = useState(null);
    const [secondChartData, setSecondChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState(null);
    const [months, setMonths] = useState(null);
    const [days, setDays] = useState(null);
    const [orderAmount, setOrderAmount] = useState(0);

    let formattedString = null;

    /*
    ----------------------------------------------------------------------------------------
    First called functions
    ----------------------------------------------------------------------------------------
    */

    //Function for getting name of hospital
    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);
        const headers = { authorization: "Bearer " + token };
        fetch(`sklad/getIdOdd/${userDataHelper.UserInfo.userid}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setName(data[0].NAZOV_NEM);
                if(data[0].ID_LEKARNE !== null) {
                    //Employee is from pharmacy
                    setName(data[0].NAZOV_LEK);
                }
            });
    }, []);

    //Function for getting current amount of medication on warehouse
    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);
        const headers = { authorization: "Bearer " + token };
        fetch(`/skladStatistiky/getMedAmount/${userDataHelper.UserInfo.userid}`, { headers })
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
                    setMedAmount(data[0].POCET);
                    setRequestedOrdersAmount(data[1].POCET);
                    setFinishedOrdersAmount(data[2].POCET);
                    setRequestedTransfersAmount(data[3].POCET);
                    setFinishedTransfersAmount(data[4].POCET);
                    setDeniedTransfersAmount(data[5].POCET);
                    setRequestedDeprTransfersAmount(data[6].POCET);
                }
            });
    }, []);

    //Function for getting warehouse medications
    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);
        const headers = { authorization: "Bearer " + token };
        fetch(`/skladStatistiky/getMedications/${userDataHelper.UserInfo.userid}`, { headers })
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
                    setWarehouseMedications(data);
                }
            });
    }, []);

    /*
    ----------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------
    */

    const stats = (selectedValue) => {

        if(!isNaN(selectedValue.value) && selectedValue.value > 0) {
            const token = localStorage.getItem("hospit-user");
            const userDataHelper = GetUserData(token);
            const headers = { authorization: "Bearer " + token };

            fetch(`/skladStatistiky/getMedStats/${userDataHelper.UserInfo.userid}/${selectedValue.value}`, { headers })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message) {
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: data.message,
                            life: 3000,
                        });
                    } else {
                        setSelectedMedication(selectedValue.value);
                        setShowStats(true);

                        const documentStyle = getComputedStyle(document.documentElement);
                        const textColor = documentStyle.getPropertyValue('--text-color');
                        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
                        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

                        const firstChart = {
                            labels: data[3],
                            datasets: [
                                {
                                    label: 'Vývoj počtu lieku v sklade',
                                    data: data[0],
                                    fill: false,
                                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                                    tension: 0.4
                                }
                            ]
                        };

                        const secondChart = {
                            labels: data[3],
                            datasets: [
                                {
                                    label: 'Vývoj výberu liekov zo skladu',
                                    data: data[1],
                                    fill: false,
                                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                                    tension: 0.4
                                }
                            ]
                        };

                        const options = {
                            maintainAspectRatio: false,
                            aspectRatio: 0.6,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: textColor
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        color: textColorSecondary
                                    },
                                    grid: {
                                        color: surfaceBorder
                                    },
                                },
                                y: {
                                    ticks: {
                                        color: textColorSecondary
                                    },
                                    grid: {
                                        color: surfaceBorder
                                    }
                                }
                            },

                            backgroundColor: "#51504f",
                            color: "#51504f"

                        }

                        let currentValue = data[0][6];
                        let mon = Math.floor(currentValue / data[2]);
                        setMonths(mon);
                        setDays(Math.floor(((currentValue / data[2]) - mon) * 30.41));

                        setAvgAmout(Number(parseFloat(data[2]).toFixed(1)));
                        setChartOptions(options);
                        setFirstChartData(firstChart);
                        setSecondChartData(secondChart);

                    }
                });

        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Chybné ID lieku",
                life: 3000,
            });
        }
    }

    async function createOrder() {
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
                usr_id: userDataHelper.UserInfo.userid
            }),
        };

        fetch(`/objednavky/add`, requestOptions)
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
                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Objednávka bola vytvorená",
                        life: 3000,
                    });
                    hideDialog();
                }

            });

    }

    const addOrder = () => {

        if(orderAmount < 0 ) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Zadaný počet musí byť kladný",
                life: 3000,
            });
        } else {
            const transformedData = {
                id: selectedMedication,
                name: warehouseMedications.find(medication => medication.ID_LIEK === selectedMedication)?.NAZOV,
                amount: orderAmount
            }

            formattedString = JSON.stringify(transformedData);

            createOrder();
        }

    }

    const handleInputChange = (event) => {
        const { value } = event.target;
        let inputValue = value === '' ? '' : parseInt(value.replace(/\D/g, ''), 10);

        if (inputValue < 1) {
            inputValue = 0;
        }

        setOrderAmount(inputValue);
    };

    /*
    ----------------------------------------------------------------------------------------
    Show functions
    ----------------------------------------------------------------------------------------
    */

    const showOrder = () => {
        setShowOrderDialog(true);
    }

    const hideDialog = () => {
        setShowOrderDialog(false);
        formattedString = null;
        setOrderAmount(0);
        setSelectedMedication(null);
        setFirstChartData(null);
        setSecondChartData(null);
        setChartOptions(null);
        setMonths(null);
        setDays(null);
    };

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
                onClick={addOrder}
            />
        </React.Fragment>
    );

    return (
        <div>

            <Toast ref={toast} />

            <div style={{marginLeft: "20px"}}>
                <h2>Štatistiky skladu {name}</h2>
            </div>

            <div className="xl:col-12">
                <div className="grid">
                    <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                        Počet liekov na sklade
                        <p>{medAmount}</p>
                    </div>
                    <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                        Požiadané objednávky
                        <p>{requestedOrdersAmount}</p>
                    </div>
                    <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                        Vybavené objednávky
                        <p>{finishedOrdersAmount}</p>
                    </div>
                    <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                        Požiadané presuny
                        <p>{requestedTransfersAmount}</p>
                    </div>
                    <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                        Vybavené presuny
                        <p>{finishedTransfersAmount}</p>
                    </div>
                    <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                        Zamietnuté presuny
                        <p>{deniedTransfersAmount}</p>
                    </div>
                    <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                        Požadované presuny
                        <p>{requestedDeprTransfersAmount}</p>
                    </div>
                </div>
            </div>

            <div className="stats-view border-round-lg">
                <div className="formgrid grid">
                    <div className="field col">
                        <Dropdown
                            style={{width: "auto", minWidth: "300px"}}
                            value={selectedMedication}
                            options={warehouseMedications.map(medication => ({ label: medication.NAZOV, value: medication.ID_LIEK }))}
                            onChange={(selectedOption) => stats(selectedOption)}
                            optionLabel="label"
                            filter
                            showClear
                            filterBy="label"
                            filterMatchMode="startsWith"
                            placeholder="Vybrať liek"
                            resetFilterOnHide
                        />
                    </div>
                </div>

                {showStats ? <div>
                    <h3>Štatistiky lieku</h3>
                    <div className="xl:col-12 align-content-center flex">
                        <Chart
                            type="line"
                            data={firstChartData}
                            options={chartOptions}
                            style={{ width: "40%" }}
                        />

                        <Chart
                            type="line"
                            data={secondChartData}
                            options={chartOptions}
                            style={{ width: "40%", paddingLeft: "5%" }}
                        />


                    </div>

                    <div>
                        <h3>Vybranému lieku sa vyčerpajú zásoby do {months} mesiacov a {days} dní</h3>

                        <Button style={{width: "20%"}} label="Objednať liek" onClick={showOrder} />
                    </div>

                </div> : null}

            </div>

            <Dialog
                visible={showOrderDialog}
                style={{ width: "400px", height: "400px"}}
                header="Vytvoriť objednávku"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}
            >
                <p>Objednávka sa vytvára pre liek:
                    <h4>{warehouseMedications.find(medication => medication.ID_LIEK === selectedMedication)?.NAZOV}</h4></p>
                <p>Priemerne sa mesačne spotrebuje {avgAmount} z tohto lieku</p>
                <p style={{paddingTop:"20px"}}>Počet lieku: <input
                    type="text"
                    value={orderAmount}
                    onChange={(e) => handleInputChange(e)}
                    pattern="[0-9]*"
                    inputMode="numeric"
                /></p>
            </Dialog>

        </div>
    );
}