import React, {useState, useRef, useEffect} from "react";
import TabPharmacyManagers from "./TabPharmacyManagers";
import GetUserData from "../../Auth/GetUserData";
import {useNavigate} from "react-router";
import {Toast} from "primereact/toast";

function TabManagersOfPharmacy() {
    const [manazeriLekarni, setManazeriLekarni] = useState(null);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);
        const headers = {authorization: "Bearer " + token};
        fetch(`/pharmacyManager/manazeriLekarni/${userDataHelper.UserInfo.userid}`, {headers})
            .then((response) => {
                // Kontrola ci response je ok (status:200)
                if (response.ok) {
                    return response.json();
                    // Kontrola ci je token expirovany (status:410)
                } else if (response.status === 410) {
                    // Token expiroval redirect na logout
                    toast.current.show({
                        severity: 'error',
                        summary: "Session timeout redirecting to login page",
                        life: 999999999
                    });
                    setTimeout(() => {
                        navigate("/logout")
                    }, 3000)
                }
            })
            .then((data) => {
                setManazeriLekarni(<TabPharmacyManagers manazeriLekarni={data}/>);
            });
    }, []);

    return <div><Toast ref={toast} position="top-center"/>
        {manazeriLekarni}</div>;
}

export default TabManagersOfPharmacy;
