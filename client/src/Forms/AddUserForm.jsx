import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';

function AddUserForm(props) {
  const [name, setName] = useState(null);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    };
    fetch('/api/selects/zoznamLekarov', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setOptions(data);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Dropdown
        value={name}
        options={options}
        onChange={(e) => setName(e.value)}
        style={{ width: '100%' }}
        optionLabel='meno'
        filter
      ></Dropdown>
      <Button label='Pridaj' onClick={() => props.onClick(name)}></Button>
    </div>
  );
}

export default AddUserForm;
