import React, {useState, useRef} from 'react';
import '../styles/adminPanel.css';
import {TabView, TabPanel} from 'primereact/tabview';
import Register from '../Auth/Register'
import "../icons.css";
import ErrorLogs from "./ErrorLogs";

export default function AdminPanel() {

    return (
        <div className='card' style={{marginTop: 10}}>
            <TabView>
                <TabPanel header="Registracia Zamestnancov" leftIcon='pi pi-user mr-2'>
                    <Register/>
                </TabPanel>
                <TabPanel header="Error Logy" leftIcon='log-icon mr-2'>
                    <ErrorLogs/>
                </TabPanel>
            </TabView>
        </div>
    );
}
