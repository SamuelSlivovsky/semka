import 'leaflet/dist/leaflet.css';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { GeoJSON, MapContainer, TileLayer, ZoomControl } from 'react-leaflet';

export default function InteractiveMap() {
  const REFRESH_INTERVAL = 300_000;
  const BedInfo = {
    MENO: 'meno',
    POBYT_OD: 'pobyt_od',
    POBYT_DO: 'pobyt_do',
  };
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [selectedHospitalizedPatient, setSelectedHospitalizedPatient] =
    useState(null);
  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [hospitalizedPatients, setHospitalizedPatients] = useState([]);
  const [hospitalMap, setHospitalMap] = useState('');
  const [bedAvailability, setBedAvailability] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    setEquipment([{ equipment: 'Teplomer', quantity: 3 }]);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/nemocnica/oddelenia/40`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/miestnost/hospital/40`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/nemocnica/doctors/40`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/nemocnica/nurses/40`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setNurses(data);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/nemocnica/hospitalized/40`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setHospitalizedPatients(data);
      });
  }, []);

  useEffect(() => {
    async function refreshMap() {
      await getWardRoomAvailability();
      await getHospitalMapData();
      const interval = setInterval(async () => {
        await getWardRoomAvailability();
        await getHospitalMapData();
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }

    refreshMap();
  }, []);

  const getHospitalMapData = async () => {
    try {
      const token = localStorage.getItem('hospit-user');
      const headers = { authorization: 'Bearer ' + token };
      let response = await fetch(`/nemocnica/mapa/40`, { headers });
      response = await response.json();
      setHospitalMap(JSON.parse(response.MAPA));
    } catch (error) {
      console.error('Error fetching hospital map data:', error);
      throw error;
    }
  };

  const getWardRoomAvailability = async () => {
    try {
      const token = localStorage.getItem('hospit-user');
      const headers = { authorization: 'Bearer ' + token };
      let response = await fetch(`/miestnost/bedAvailability`, { headers });
      response = await response.json();
      setBedAvailability(response);
    } catch (error) {
      console.error('Error fetching bed data:', error);
      throw error;
    }
  };

  const onEachFeature = async (feature, layer) => {
    const roomNumber =
      feature.properties.room_number[
        getSelectedFloorFeature(feature.properties.level)
      ];
    const room = rooms.find((room) => room?.ID_MIESTNOSTI === roomNumber);
    const departmentId =
      feature.properties.department[
        getSelectedFloorFeature(feature.properties.level)
      ];
    const departmentName = departments.find(
      (department) => department.ID_ODDELENIA === departmentId
    )?.TYP_ODDELENIA;
    const isWardRoom =
      feature.properties.ward_room[
        getSelectedFloorFeature(feature.properties.level)
      ];
    const nurse = nurses.find((nurse) => nurse?.CISLO_ZAM === room?.CISLO_ZAM);
    const doctor = doctors.find(
      (doctor) => doctor?.CISLO_ZAM === room?.CISLO_ZAM
    );

    layer.options.fillOpacity = 0.8;
    layer.options.color = '#000000';
    layer.options.weight = 0.5;
    layer.options.opacity = 0.6;

    layer.bindPopup(
      ReactDOMServer.renderToString(
        roomPopup(roomNumber, isWardRoom, departmentName, doctor, nurse, [])
      )
    );

    layer.on('click', async () => {
      const popup = layer.getPopup();

      try {
        const roomPopupWithBedData = await changeBeds(
          roomNumber,
          isWardRoom,
          departmentName,
          doctor,
          nurse
        );
        popup.setContent(ReactDOMServer.renderToString(roomPopupWithBedData));
      } catch (error) {
        console.error('Error updating beds:', error);
      }
    });
  };

  const roomPopup = (
    roomNumber,
    isWardRoom,
    departmentName,
    doctor,
    nurse,
    bedData
  ) => {
    return (
      <div className='room-popup-container'>
        <div className='room-popup-section-container room-popup-section-room-number'>
          <span>Oddelenie {departmentName}</span>
        </div>
        <div className='room-popup-section-container room-popup-section-room-number'>
          <span>Miestnosť {roomNumber}</span>
        </div>
        {doctor ? (
          <div className='room-popup-section-container room-popup-section-room-number'>
            <span>Doktor {doctor?.MENO + ' ' + doctor?.PRIEZVISKO}</span>
          </div>
        ) : null}
        {nurse ? (
          <div className='room-popup-section-container room-popup-section-room-number'>
            <span>Sestrička {nurse?.MENO + ' ' + nurse?.PRIEZVISKO}</span>
          </div>
        ) : null}
        {isWardRoom ? (
          <div className='room-popup-section-container room-popup-section-beds'>
            <span>Lôžka</span>
            <DataTable value={bedData} size='small'>
              <Column field='ID_LOZKA' header='Lôžko'></Column>
              <Column
                field='MENO'
                header='Pacient'
                body={(rowData) => renderBedData(rowData, BedInfo.MENO)}
              ></Column>
              <Column
                field='POBYT_OD'
                header='Pobyt od'
                body={(rowData) => renderBedData(rowData, BedInfo.POBYT_OD)}
              ></Column>
              <Column
                field='POBYT_DO'
                header='Pobyt do'
                body={(rowData) => renderBedData(rowData, BedInfo.POBYT_DO)}
              ></Column>
              <Column field='button'></Column>
            </DataTable>
          </div>
        ) : null}
        <div className='room-popup-section-container room-popup-section-equipment'>
          <span>Vybavenie</span>
          <DataTable value={equipment} size='small'>
            <Column field='equipment' header='Vybavenie'></Column>
            <Column field='quantity' header='Množstvo'></Column>
          </DataTable>
        </div>
      </div>
    );
  };

  const changeBeds = async (
    roomNumber,
    isWardRoom,
    departmentName,
    doctor,
    nurse
  ) => {
    try {
      const token = localStorage.getItem('hospit-user');
      const headers = { authorization: 'Bearer ' + token };
      let response = await fetch(`/lozko/room/${roomNumber}`, { headers });
      response = await response.json();
      return roomPopup(
        roomNumber,
        isWardRoom,
        departmentName,
        doctor,
        nurse,
        response
      );
    } catch (error) {
      console.error('Error fetching bed data:', error);
      throw error;
    }
  };

  const changeRoomColors = (feature) => {
    for (const room of rooms) {
      let availability = 0;
      let bed = undefined;

      if (room.KAPACITA > 1) {
        bed = bedAvailability.find(
          (bed) => bed.ID_MIESTNOSTI === room.ID_MIESTNOSTI
        );

        availability = bed?.POCET_PACIENTOV / bed?.KAPACITA;
      } else {
        availability = Math.round(Math.random());
      }

      if (
        feature?.properties.room_number[
          getSelectedFloorFeature(feature?.properties.level)
        ] === room.ID_MIESTNOSTI
      ) {
        return determineRoomColor(availability, bed ? bed.KAPACITA : undefined);
      }
    }

    return { fillColor: '#3388ff' };
  };

  const determineRoomColor = (availability, maxCapacity) => {
    if (maxCapacity === undefined) {
      maxCapacity = 1;
    }

    if (maxCapacity === 1) {
      if (availability === 0) {
        return { fillColor: '#50C878' };
      } else {
        return { fillColor: '#FF0000' };
      }
    }

    const min = 1 / maxCapacity;
    const mid = 1 / (maxCapacity / 2);

    if (availability === 0) {
      return { fillColor: '#50C878' };
    } else if (availability <= min) {
      return { fillColor: '#FFFF00' };
    } else if (availability > min && availability <= mid) {
      return { fillColor: '#FFA500' };
    } else if (availability > mid) {
      return { fillColor: '#FF0000' };
    } else {
      return { fillColor: '#3388ff' };
    }
  };

  const getSelectedFloorFeature = (levels) => {
    return levels.findIndex((level) => level === selectedFloor);
  };

  const isDoctorsRoom = (roomNumber) => {
    const selectedRoom = rooms.find(
      (room) => room.ID_MIESTNOSTI === roomNumber
    );

    return (
      selectedDoctor === selectedRoom?.CISLO_ZAM || selectedDoctor === null
    );
  };

  const isNursesRoom = (roomNumber) => {
    const selectedRoom = rooms.find(
      (room) => room.ID_MIESTNOSTI === roomNumber
    );

    return selectedNurse === selectedRoom?.CISLO_ZAM || selectedNurse === null;
  };

  const isHospitalizedPatientRoom = (roomNumber) => {
    const selectedRoom = rooms.find(
      (room) => room.ID_MIESTNOSTI === roomNumber
    );

    return (
      selectedHospitalizedPatient?.ID_MIESTNOST ===
        selectedRoom?.ID_MIESTNOSTI || selectedHospitalizedPatient === null
    );
  };

  const filterRooms = (feature) => {
    const selectedFloorFeature = getSelectedFloorFeature(
      feature?.properties.level
    );
    const roomNumber = feature?.properties?.room_number[selectedFloorFeature];
    const department = feature?.properties?.department[selectedFloorFeature];

    const isDoctorRoom = isDoctorsRoom(roomNumber);
    const isNurseRoom = isNursesRoom(roomNumber);
    const isPatientRoom = isHospitalizedPatientRoom(roomNumber);

    const isRoomForSelectedDepartment =
      selectedDepartment === null || department === selectedDepartment;

    if (selectedDoctor !== null && selectedNurse !== null) {
      // Both doctor and nurse are selected, show rooms for both in the selected department
      return (isDoctorRoom || isNurseRoom) && isRoomForSelectedDepartment;
    } else if (selectedDoctor !== null) {
      // Only doctor is selected, show only doctor rooms for the selected department
      return isDoctorRoom && isRoomForSelectedDepartment;
    } else if (selectedNurse !== null) {
      // Only nurse is selected, show only nurse rooms for the selected department
      return isNurseRoom && isRoomForSelectedDepartment;
    } else if (selectedHospitalizedPatient !== null) {
      // Only hospitalized patient is selected, show rooms for the selected patient
      return isPatientRoom && isRoomForSelectedDepartment;
    }

    // Neither doctor nor nurse nor patient is selected, show only the selected floor
    return (
      feature?.properties.level.some((level) => level === selectedFloor) &&
      isRoomForSelectedDepartment
    );
  };

  const onSubmit = async () => {
    const token = localStorage.getItem('hospit-user');
    const requestOptionsPatient = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },

      body: JSON.stringify({
        mapa: ``,
      }),
    };
    /* const responsePatient = await fetch(
      '/add/mapa',
      requestOptionsPatient
    ).then(() => console.log('a')); */
  };

  const renderMap = () => {
    if (!hospitalMap) return;

    return (
      <div className='map-container'>
        <MapContainer
          center={[49.05198629377708, 20.303411113943554]}
          zoom={100}
          style={{ height: '100vh', width: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position='topright' />
          <div className='change-floors-container'>
            <Button onClick={() => handleFloorChange(1)}>Poschodie 1</Button>
            <Button onClick={() => handleFloorChange(2)}>Poschodie 2</Button>
            <Button onClick={() => handleFloorChange(3)}>Poschodie 3</Button>
          </div>
          <div className='left-map-menu-container'>
            {/* <Button onClick={() => onSubmit()}>Update</Button> */}
            <div className='left-map-menu-container-select-boxes'>
              <Dropdown
                value={selectedDepartment}
                onChange={(e) =>
                  handleDepartmentChange(Number(e.value) || null)
                }
                placeholder='Všetky oddelenia'
                className='left-map-menu-container-department'
                options={[
                  { label: 'Všetky oddelenia', value: null, disabled: true },
                  ...departments.map((department) => ({
                    label: department.TYP_ODDELENIA,
                    value: department.ID_ODDELENIA,
                  })),
                ]}
                disabled={selectedHospitalizedPatient != null}
                showClear={true}
              />
              <Dropdown
                value={selectedDoctor}
                onChange={(e) => handleDoctorChange(Number(e.value) || null)}
                placeholder='Všetci doktori'
                className='left-map-menu-container-doctor'
                options={[
                  { label: 'Všetci doktori', value: null, disabled: true },
                  ...doctors.map((doctor) => ({
                    label: doctor.MENO + ' ' + doctor.PRIEZVISKO,
                    value: doctor.CISLO_ZAM,
                  })),
                ]}
                disabled={selectedHospitalizedPatient != null}
                showClear={true}
              />
              <Dropdown
                value={selectedNurse}
                onChange={(e) => handleNurseChange(Number(e.value) || null)}
                placeholder='Všetky sestričky'
                className='left-map-menu-container-doctor'
                options={[
                  { label: 'Všetky sestričky', value: null, disabled: true },
                  ...nurses.map((nurse) => ({
                    label: nurse.MENO + ' ' + nurse.PRIEZVISKO,
                    value: nurse.CISLO_ZAM,
                  })),
                ]}
                disabled={selectedHospitalizedPatient != null}
                showClear={true}
              />
              <Dropdown
                value={selectedHospitalizedPatient}
                onChange={(e) =>
                  handleHospitalizedPatientChange(e.value || null)
                }
                placeholder='Hospitalizovaní pacienti'
                className='left-map-menu-container-patient'
                options={[
                  {
                    label: 'Hospitalizovaní pacienti',
                    value: null,
                    disabled: true,
                  },
                  ...hospitalizedPatients.map((hospitalizedPatient) => ({
                    label:
                      hospitalizedPatient.MENO +
                      ' ' +
                      hospitalizedPatient.PRIEZVISKO,
                    value: hospitalizedPatient,
                  })),
                ]}
                disabled={
                  selectedDoctor !== null ||
                  selectedNurse !== null ||
                  selectedDepartment !== null
                }
                showClear={true}
              />
            </div>
          </div>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          {hospitalMap?.features
            .filter((feature) => {
              return filterRooms(feature);
            })
            .map((feature) => (
              <GeoJSON
                key={`${feature.id}-${selectedFloor}`}
                onEachFeature={(featureD, layer) =>
                  onEachFeature(feature, layer)
                }
                data={feature.geometry}
                style={changeRoomColors(feature)}
              />
            ))}
        </MapContainer>
      </div>
    );
  };

  const handleFloorChange = (floorNumber) => {
    setSelectedFloor(floorNumber);
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  const handleDoctorChange = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleNurseChange = (nurse) => {
    setSelectedNurse(nurse);
  };

  const handleHospitalizedPatientChange = (hospitalizedPatient) => {
    setSelectedHospitalizedPatient(hospitalizedPatient);
  };

  const renderBedData = (rowData, bedInfo) => {
    switch (bedInfo) {
      case BedInfo.MENO:
        return rowData?.MENO !== null ? rowData.MENO : '-';
      case BedInfo.POBYT_OD:
        return rowData?.POBYT_OD !== null ? formatDate(rowData.POBYT_OD) : '-';
      case BedInfo.POBYT_DO:
        return rowData?.POBYT_DO !== null ? formatDate(rowData.POBYT_DO) : '-';
      default:
        return;
    }
  };

  const formatDate = (date) => {
    if (!date) return;
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(date).toLocaleDateString('sk-SK', options);
  };

  return <div>{renderMap()}</div>;
}
