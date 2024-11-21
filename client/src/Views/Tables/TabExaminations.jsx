import React, { useEffect, useRef, useState } from 'react';
import TableMedicalRecords from './TableMedicalRecords';
import GetUserData from '../../Auth/GetUserData';
import { useNavigate } from 'react-router';
import { Toast } from 'primereact/toast';

export default function TabExaminations() {
  const [vysetrenia, setVysetrenia] = useState([]);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const userDataHelper = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/lekar/vysetrenia/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => {
        // Kontrola ci response je ok (status:200)
        if (response.ok) {
          return response.json();
          // Kontrola ci je token expirovany (status:410)
        } else if (response.status === 410) {
          // Token expiroval redirect na logout
          toast.current.show({
            severity: 'error',
            summary: 'Session timeout redirecting to login page',
            life: 999999999,
          });
          setTimeout(() => {
            navigate('/logout');
          }, 3000);
        }
      })
      .then((data) => {
        setVysetrenia(data);
      });
  }, []);

  const data = {
    tableName: 'Vyšetrenia',
    cellData: vysetrenia,
    titles: [
      { field: 'ROD_CISLO', header: 'Rodné číslo' },
      { field: 'MENO', header: 'Meno' },
      { field: 'PRIEZVISKO', header: 'Priezvisko' },
      { field: 'DATUM', header: 'Dátum' },
    ],
    allowFilters: true,
    dialog: true,
    eventType: 'Vyšetrenie',
  };

  return (
    <div>
      <Toast ref={toast} position='top-center' />
      {data && <TableMedicalRecords {...data} />}
    </div>
  );
}
