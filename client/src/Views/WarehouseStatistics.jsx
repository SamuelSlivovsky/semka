import {Chart} from "primereact/chart";
import {Toast} from "primereact/toast";
import React, {useEffect, useRef, useState} from "react";
import GetUserData from "../Auth/GetUserData";

export default function WarehouseStatistics() {

    //Declaration of Constants
    const toast = useRef(null);
    const [name, setName] = useState(null);
    const [medAmount, setMedAmount] = useState(null);
    const [requestedOrdersAmount, setRequestedOrdersAmount] = useState(null);
    const [finishedOrdersAmount, setFinishedOrdersAmount] = useState(null);
    const [requestedTransfersAmount, setRequestedTransfersAmount] = useState(null);
    const [finishedTransfersAmount, setFinishedTransfersAmount] = useState(null);
    const [deniedTransfersAmount, setDeniedTransfersAmount] = useState(null);
    const [requestedDeprTransfersAmount, setRequestedDeprTransfersAmount] = useState(null);


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

    /*
    ----------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------
    */


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

            <div>
                <Chart
                    type="bar"
                    data={NaN}
                    options={NaN}
                    style={{ width: "35%" }}
                />
            </div>
        </div>
    );
}