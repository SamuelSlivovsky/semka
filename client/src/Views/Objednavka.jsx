import React, { useState, useRef } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import { Toast } from 'primereact/toast';
import ObjednavkaForm from '../Forms/ObjednavkaForm';
export default function Add() {
    const toast = useRef(null);
    const [eventTypeButton, setEventTypeButton] = useState(1);
    const eventTypes = [
        { name: 'Objednavka', code: 'OB', value: 1 }
    ];

    return (
        <div
            style={{ width: '90%', marginTop: '2rem' }}
            className='p-fluid grid formgrid'
        >
            <Toast ref={toast} />
            <div className='field col-12'>
                <SelectButton
                    value={eventTypeButton}
                    options={eventTypes}
                    onChange={(e) => setEventTypeButton(e.value)}
                    optionLabel='name'
                />
            </div>
            {<ObjednavkaForm />}
        </div>
    );
}
