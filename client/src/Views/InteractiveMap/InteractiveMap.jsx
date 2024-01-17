import 'leaflet/dist/leaflet.css';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

export default function InteractiveMap() {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [hospitalMap, setHospitalMap] = useState('');
  const [beds, setBeds] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/nemocnica/mapa/40`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setHospitalMap(JSON.parse(data.MAPA));
      });
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
    fetch(`/miestnost/40`, { headers })
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
    changeRoomColors();
  }, [hospitalMap]);

  const onMouseOver = (event) => {
    event.target.bringToFront();
    event.target.setStyle({
      color: 'black',
      weight: 3,
    });
  };

  //reseting the mouseover style, should use resetStyle() but it always error, so i did it
  const onMouseOut = (event) => {
    event.target.bringToBack();
    event.target.setStyle({
      color: 'white',
      weight: 2,
    });
  };

  const onEachFeature = (feature, layer) => {
    const roomNumber =
      feature.properties.room_number[
        getSelectedFloorFeature(feature.properties.level)
      ];
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

    layer.options.fillOpacity = 0.8;
    layer.options.color = '#000000';
    layer.options.weight = 0.5;
    layer.options.opacity = 0.6;

    layer.bindPopup(
      ReactDOMServer.renderToString(
        roomPopup(roomNumber, isWardRoom, departmentName)
      )
    );
  };

  const roomPopup = (roomNumber, isWardRoom, departmentName) => {
    return (
      <div className='room-popup-container'>
        <div className='room-popup-section-container room-popup-section-room-number'>
          <span>Oddelenie {departmentName}</span>
        </div>
        <div className='room-popup-section-container room-popup-section-room-number'>
          <span>Miestnosť {roomNumber}</span>
        </div>
        {isWardRoom ? (
          <div className='room-popup-section-container room-popup-section-beds'>
            <span>Lôžka</span>
            <DataTable value={beds} size='small'>
              <Column field='bedNumber' header='Lôžko'></Column>
              <Column field='patient' header='Pacient'></Column>
              <Column field='from' header='Pobyt od'></Column>
              <Column field='to' header='Pobyt do'></Column>
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

  const changeRoomColors = (feature) => {
    for (const room of rooms) {
      const availability = Math.round(Math.random() * (3 - 1) + 1);

      if (
        feature?.properties.room_number[
          getSelectedFloorFeature(feature?.properties.level)
        ] === room.ID_MIESTNOSTI
      ) {
        return determineRoomColor(availability);
      }
    }

    return { fillColor: '#3388ff' };
  };

  const determineRoomColor = (availability) => {
    switch (availability) {
      case 1:
        return { fillColor: '#FFFF00' };
      case 2:
        return { fillColor: '#FFA500' };
      case 3:
        return { fillColor: '#FF0000' };
      default:
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

  const filterRooms = (feature) => {
    const selectedFloorFeature = getSelectedFloorFeature(
      feature?.properties.level
    );
    const roomNumber = feature?.properties?.room_number[selectedFloorFeature];
    const department = feature?.properties?.department[selectedFloorFeature];

    const isDoctorRoom = isDoctorsRoom(roomNumber);
    const isNurseRoom = isNursesRoom(roomNumber);

    const isRoomForSelectedDepartment =
      selectedDepartment === null || department === selectedDepartment;

    if (selectedDoctor !== null && selectedNurse !== null) {
      // Both doctor and nurse are selected, show rooms for both in the selected department
      return (
        (isDoctorRoom && isRoomForSelectedDepartment) ||
        (isNurseRoom && isRoomForSelectedDepartment)
      );
    } else if (selectedDoctor !== null) {
      // Only doctor is selected, show only doctor rooms for the selected department
      return isDoctorRoom && isRoomForSelectedDepartment;
    } else if (selectedNurse !== null) {
      // Only nurse is selected, show only nurse rooms for the selected department
      return isNurseRoom && isRoomForSelectedDepartment;
    }

    // Neither doctor nor nurse is selected, show only the selected floor
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
        >
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
                  { label: 'Všetky oddelenia', value: null },
                  ...departments.map((department) => ({
                    label: department.TYP_ODDELENIA,
                    value: department.ID_ODDELENIA,
                  })),
                ]}
              />
              <Dropdown
                value={selectedDoctor}
                onChange={(e) => handleDoctorChange(Number(e.value) || null)}
                placeholder='Všetci doktori'
                className='left-map-menu-container-doctor'
                options={[
                  { label: 'Všetci doktori', value: null },
                  ...doctors.map((doctor) => ({
                    label: doctor.MENO + ' ' + doctor.PRIEZVISKO,
                    value: doctor.CISLO_ZAM,
                  })),
                ]}
              />
              <Dropdown
                value={selectedNurse}
                onChange={(e) => handleNurseChange(Number(e.value) || null)}
                placeholder='Všetky sestričky'
                className='left-map-menu-container-doctor'
                options={[
                  { label: 'Všetky sestričky', value: null },
                  ...nurses.map((nurse) => ({
                    label: nurse.MENO + ' ' + nurse.PRIEZVISKO,
                    value: nurse.CISLO_ZAM,
                  })),
                ]}
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

  return <div>{renderMap()}</div>;
}
