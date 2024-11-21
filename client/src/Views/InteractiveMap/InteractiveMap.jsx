import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'leaflet/dist/leaflet.css';
import * as moment from 'moment';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useRef, useState } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { GeoJSON, MapContainer, TileLayer, ZoomControl } from 'react-leaflet';

export default function InteractiveMap() {
  const [fontBinary, setFontBinary] = useState(null);
  const bedState = [
    {
      name: 'Oddelenie dlhodobo chorých',
      nurse: 'Sestrička Mária Meiselova',
      rooms: [
        {
          room: 'Miestnosť MH222',
          utilization: '34%',
          data: [
            {
              lozko: '2821',
              pacient: 'Lukas Hurych',
              pobytOd: '1. 2. 2024',
              pobytDo: '25. 5. 2024',
            },
            {
              lozko: '2820',
              pacient: 'Andrej Gunis',
              pobytOd: '29. 1. 2024',
              pobytDo: '8. 6. 2024',
            },
            { lozko: '2819', pacient: '-', pobytOd: '-', pobytDo: '-' },
          ],
        },
        {
          room: 'Miestnosť MH223',
          utilization: '50%',
          data: [
            {
              lozko: '2824',
              pacient: '-',
              pobytOd: '-',
              pobytDo: '-',
            },
            {
              lozko: '2823',
              pacient: 'Adam Nagy',
              pobytOd: '1. 4. 2024',
              pobytDo: '24. 5. 2024',
            },
            { lozko: '2822', pacient: '-', pobytOd: '-', pobytDo: '-' },
          ],
        },
      ],
    },
    {
      name: 'Oddelenie gynegologicko-pôrodnícke',
      nurse: 'Sestrička Jana Paulenova',
      rooms: [
        {
          room: 'Miestnosť MH222',
          utilization: '38%',
          data: [
            {
              lozko: '2821',
              pacient: 'Lukas Hurych',
              pobytOd: '1. 2. 2024',
              pobytDo: '25. 5. 2024',
            },
            {
              lozko: '2820',
              pacient: 'Andrej Gunis',
              pobytOd: '29. 1. 2024',
              pobytDo: '8. 6. 2024',
            },
            { lozko: '2819', pacient: '-', pobytOd: '-', pobytDo: '-' },
          ],
        },
        {
          room: 'Miestnosť MH223',
          utilization: '87%',
          data: [
            {
              lozko: '2824',
              pacient: '-',
              pobytOd: '-',
              pobytDo: '-',
            },
            {
              lozko: '2823',
              pacient: 'Adam Nagy',
              pobytOd: '1. 4. 2024',
              pobytDo: '24. 5. 2024',
            },
            { lozko: '2822', pacient: '-', pobytOd: '-', pobytDo: '-' },
          ],
        },
      ],
    },
  ];

  const REFRESH_INTERVAL = 300_000;
  const BedInfo = {
    MENO: 'meno',
    POBYT_OD: 'pobyt_od',
    POBYT_DO: 'pobyt_do',
  };
  const calendarRef = useRef(null);
  const [roomsFrom, setRoomsFrom] = useState(moment());
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [selectedSexTypeRoom, setSelectedSexTypeRoom] = useState(null);
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
  const [layerPopup, setLayerPopup] = useState({});
  const [possiblePatientMoveBedsInRoom, setPossiblePatientMoveBedsInRoom] =
    useState([]);
  const [displayPatientMoveDialog, setDisplayPatientMoveDialog] =
    useState(false);
  const [patientMoveData, setPatientMoveData] = useState({
    fromBedId: Number,
    toBedId: Number | null,
    fromRoomNumber: String,
    toRoomNumber: String | null,
    isMansRoom: Boolean,
    patientHospitalizedFrom: moment.Moment,
    patientHospitalizedTo: moment.Moment,
    dateWhenMove: moment.Moment,
  });
  const [moveRoomData, setMoveRoomData] = useState({
    roomNumber: String,
    isWardRoom: Boolean,
    isManRoom: Boolean,
    departmentName: String,
    doctor: Object,
    nurse: Object,
  });

  useEffect(() => {
    const fetchFont = async () => {
      try {
        const response = await fetch('/Roboto-Regular.ttf');
        const fontData = await response.blob();
        setFontBinary(fontData);
      } catch (error) {
        console.error('Error fetching font:', error);
      }
    };

    fetchFont();
  }, []);

  useEffect(() => {
    setEquipment([{ equipment: 'Teplomer', quantity: 3 }]);
  }, []);

  useEffect(() => {
    getWardRoomAvailability();
    getHospitalMapData();
  }, [roomsFrom]);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/nemocnica/oddelenia/40`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/miestnost/hospital/40`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/nemocnica/doctors/40`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/nemocnica/nurses/40`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setNurses(data);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/nemocnica/hospitalized/40`, { headers })
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
      let response = await fetch(`/api/nemocnica/mapa/40`, { headers });
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
      let response = await fetch(
        `/api/miestnost/bedAvailability/40/from/${
          roomsFrom ? moment(roomsFrom).format('DD.MM.YYYY HH:mm') : ''
        }`,
        {
          headers,
        }
      );
      response = await response.json();
      setBedAvailability(response);
    } catch (error) {
      console.error('Error fetching bed data:', error);
      throw error;
    }
  };

  const getPatientBirthNumberFromBedId = async (bedId) => {
    try {
      const token = localStorage.getItem('hospit-user');
      const headers = { authorization: 'Bearer ' + token };
      let response = await fetch(
        `/api/lozko/room/patientBirthNumber/${bedId}`,
        {
          headers,
        }
      );
      response = await response.json();
      return response;
    } catch (error) {
      console.error('Error fetching bed data:', error);
      throw error;
    }
  };

  const getBedRoomData = async (roomNumber) => {
    try {
      const token = localStorage.getItem('hospit-user');
      const headers = { authorization: 'Bearer ' + token };
      let response = await fetch(
        `/api/lozko/room/${roomNumber}/from/${moment(
          calendarRef?.current?.getCurrentDateTime()
        ).format('DD.MM.YYYY HH:mm')}`,
        { headers }
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching bed data:', error);
      throw error;
    }
  };

  const generatePDF = (rooms) => {
    const pdf = new jsPDF();
    pdf.setLanguage('sk-SK');
    pdf.setFont('times', 'normal');
    console.log(pdf.getFontList());

    rooms.forEach((department, departmentIndex) => {
      if (departmentIndex !== 0) {
        pdf.addPage();
      }

      pdf.text(department.name, 10, 10);
      pdf.text(department.nurse, 10, 20);

      let yPosition = 30;

      department.rooms.forEach((room) => {
        pdf.text(room.room, 10, yPosition);
        yPosition += 10;
        pdf.text('Vyťaženie: ' + room.utilization, 10, yPosition);
        yPosition += 10;

        const tableData = [];
        tableData.push(['Lôžko', 'Pacient', 'Pobyt od', 'Pobyt do']);
        room.data.forEach((item) => {
          tableData.push([
            item.lozko,
            item.pacient,
            item.pobytOd,
            item.pobytDo,
          ]);
        });

        pdf.autoTable({
          startY: yPosition,
          head: [tableData[0]],
          body: tableData.slice(1),
          theme: 'grid',
        });

        yPosition += (tableData.length - 1) * 10 + 10; // Adjust Y position for the next room
      });
    });

    pdf.save('oddelenia.pdf');
  };

  const movePatient = async () => {
    try {
      if (
        !patientMoveData.toBedId ||
        !patientMoveData.fromBedId ||
        !patientMoveData.patientHospitalizedFrom ||
        !patientMoveData.patientHospitalizedTo
      ) {
        throw new Error('Invalid patient move data');
      }

      const token = localStorage.getItem('hospit-user');
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      };
      await fetch(
        `/api/miestnost/movePatientToAnotherRoom/${patientMoveData.fromBedId}/${
          patientMoveData.toBedId
        }/${moment(patientMoveData.patientHospitalizedFrom).format(
          'DD.MM.YYYY'
        )}/${moment(patientMoveData.patientHospitalizedTo).format(
          'DD.MM.YYYY'
        )}/${moment(patientMoveData.dateWhenMove).format('DD.MM.YYYY HH:mm')}`,

        requestOptions
      );

      onPatientMoveDialogHide();
      const changedBeds = await changeBeds(
        moveRoomData.roomNumber,
        moveRoomData.isWardRoom,
        moveRoomData.departmentName,
        moveRoomData.doctor,
        moveRoomData.nurse
      );
      layerPopup.setContent(ReactDOMServer.renderToString(changedBeds));
      await getWardRoomAvailability();
      await getHospitalMapData();
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
      setLayerPopup(popup);

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

  /**
   * Function to be called from the popup button
   */
  window.displayPatientMovePopup = (
    bedID,
    hospitalizedFrom,
    hospitalizedTo,
    isMansRoom,
    roomNumber,
    departmentName,
    doctor,
    nurse
  ) => {
    setPatientMoveData({
      fromBedId: bedID,
      toBedId: null,
      fromRoomNumber: roomNumber,
      toRoomNumber: null,
      isMansRoom: Boolean(isMansRoom),
      patientHospitalizedFrom: moment(hospitalizedFrom),
      patientHospitalizedTo: moment(hospitalizedTo),
      dateWhenMove: null,
    });

    setMoveRoomData({
      roomNumber,
      isWardRoom: true,
      departmentName,
      doctor,
      nurse,
    });

    setDisplayPatientMoveDialog(true);
  };

  const onPatientMoveDialogHide = () => {
    setDisplayPatientMoveDialog(false);
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
              <Column
                field='button'
                body={(rowData) => {
                  return rowData.MENO ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `
                          <button class="p-button p-component pi pi-arrow-up-right" onClick="displayPatientMovePopup(
                            ${rowData.ID_LOZKA}, 
                            '${rowData.POBYT_OD}', 
                            '${rowData.POBYT_DO}', 
                            '${rowData.POHLAVIE === 'M' ? true : false}',
                            '${roomNumber}', 
                            '${departmentName}', 
                            ${JSON.stringify(doctor)?.replace(/"/g, '&quot;')}, 
                            ${JSON.stringify(nurse)?.replace(/"/g, '&quot;')}
                          )"></button>
                    `,
                      }}
                    ></div>
                  ) : null;
                }}
              ></Column>
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
    const roomData = await getBedRoomData(roomNumber);

    return roomPopup(
      roomNumber,
      isWardRoom,
      departmentName,
      doctor,
      nurse,
      roomData
    );
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

  const isMensRoom = (roomNumber) => {
    const selectedRoom = rooms.find(
      (room) => room.ID_MIESTNOSTI === roomNumber
    );

    return (
      selectedRoom?.KAPACITA > 1 && Boolean(selectedRoom?.JE_MUZSKA) === true
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
    const isMenRoom = isMensRoom(roomNumber);

    const isRoomForSelectedDepartment =
      selectedDepartment === null || department === selectedDepartment;

    if (selectedDoctor !== null && selectedNurse !== null) {
      // Both doctor and nurse are selected, show rooms for both in the selected department
      return (isDoctorRoom || isNurseRoom) && isRoomForSelectedDepartment;
    } else if (selectedDoctor !== null && selectedSexTypeRoom !== null) {
      // Doctor and gender filter are selected, show rooms for the doctor and matching the selected gender
      if (
        (isDoctorRoom && selectedSexTypeRoom === 'M' && isMenRoom) ||
        (isDoctorRoom && selectedSexTypeRoom === 'F' && !isMenRoom)
      ) {
        return isRoomForSelectedDepartment;
      } else {
        return false;
      }
    } else if (selectedDoctor !== null) {
      // Only doctor is selected, show only doctor rooms for the selected department
      return isDoctorRoom && isRoomForSelectedDepartment;
    } else if (selectedNurse !== null && selectedSexTypeRoom !== null) {
      // Nurse and gender filter are selected, show rooms for the nurse and matching the selected gender
      if (
        (isNurseRoom && selectedSexTypeRoom === 'M' && isMenRoom) ||
        (isNurseRoom && selectedSexTypeRoom === 'F' && !isMenRoom)
      ) {
        return isRoomForSelectedDepartment;
      } else {
        return false;
      }
    } else if (selectedNurse !== null) {
      // Only nurse is selected, show only nurse rooms for the selected department
      return isNurseRoom && isRoomForSelectedDepartment;
    } else if (selectedHospitalizedPatient !== null) {
      // Only hospitalized patient is selected, show rooms for the selected patient
      return isPatientRoom && isRoomForSelectedDepartment;
    } else if (selectedSexTypeRoom !== null) {
      // Gender filter is selected, show rooms based on selected gender
      if (selectedSexTypeRoom === 'M') {
        return isMenRoom && isRoomForSelectedDepartment;
      } else if (selectedSexTypeRoom === 'F') {
        return !isMenRoom && isRoomForSelectedDepartment;
      } else {
        return false; // Invalid gender selected
      }
    }

    // Neither doctor nor nurse nor patient nor gender filter is selected, show only the selected floor
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

  const setPatientMoveRoom = (roomNumber) => {
    setTimeout(() => {
      setPatientMoveData((prevData) => ({
        ...prevData,
        toRoomNumber: roomNumber,
      }));
    });

    getBedRoomData(roomNumber).then((data) => {
      setPossiblePatientMoveBedsInRoom(data.filter((bed) => !bed.MENO));
    });
  };

  const renderPatientMoveDialog = () => {
    const bed = bedAvailability.filter((availableBed) =>
      rooms.some((room) => {
        return (
          room.ID_MIESTNOSTI === availableBed.ID_MIESTNOSTI &&
          availableBed.POCET_PACIENTOV <= availableBed.KAPACITA &&
          Boolean(availableBed.JE_MUZSKA) === patientMoveData.isMansRoom
        );
      })
    );

    return (
      <Dialog
        visible={displayPatientMoveDialog}
        onHide={onPatientMoveDialogHide}
      >
        <div className='patient-move-dialog-inputs'>
          <label htmlFor='patientMoveFromRoom'>Z miestnosti</label>
          <Dropdown
            id='patientMoveFromRoom'
            value={patientMoveData.fromRoomNumber}
            onChange={(e) =>
              setPatientMoveData((prevData) => ({
                ...prevData,
                fromRoomNumber: e.value,
              }))
            }
            options={[patientMoveData.fromRoomNumber]}
            placeholder='Z miestnosti'
            disabled={true}
            showClear={true}
          />
        </div>
        <div className='patient-move-dialog-inputs'>
          <label htmlFor='patientMoveFromBedId'>Z lôžka</label>
          <Dropdown
            id='patientMoveFromBedId'
            value={patientMoveData.fromBedId}
            onChange={(e) =>
              setPatientMoveData((prevData) => ({
                ...prevData,
                fromBedId: Number(e.value) || null,
              }))
            }
            options={[patientMoveData.fromBedId]}
            placeholder='Z lôžka'
            disabled={true}
            showClear={true}
          />
        </div>
        <div className='patient-move-dialog-inputs'>
          <label htmlFor='patientMoveToRoom'>Do miestnosti</label>
          <Dropdown
            id='patientMoveToRoom'
            value={patientMoveData.toRoomNumber}
            onChange={(e) => setPatientMoveRoom(e.value || null)}
            options={[
              {
                label: 'Do miestnosti (Voľné lôžka/Celkovo počet lôžok)',
                value: null,
                disabled: true,
              },
              ...bed.map((room) => {
                const occupiedBeds = room.POCET_PACIENTOV || 0;
                const totalBeds = room.KAPACITA || 0;
                const freeBeds = totalBeds - occupiedBeds;
                const label = `${room.ID_MIESTNOSTI} (${freeBeds}/${totalBeds})`;

                return {
                  label: label,
                  value: room.ID_MIESTNOSTI,
                };
              }),
            ]}
            placeholder='Do miestnosti'
            showClear={true}
          />
        </div>
        <div className='patient-move-dialog-inputs'>
          <label htmlFor='patientMoveToBedId'>Na lôžko</label>
          <Dropdown
            id='patientMoveToBedId'
            value={patientMoveData.toBedId}
            onChange={(e) =>
              setPatientMoveData((prevData) => ({
                ...prevData,
                toBedId: Number(e.value) || null,
              }))
            }
            options={[
              { label: 'Na lôžko', value: null, disabled: true },
              ...possiblePatientMoveBedsInRoom.map((beds) => ({
                label: beds.ID_LOZKA,
                value: beds.ID_LOZKA,
              })),
            ]}
            placeholder='Na lôžko'
            showClear={true}
          />
        </div>
        <div className='patient-move-dialog-inputs'>
          <label htmlFor='patientMoveDate'>Kedy presunúť</label>
          <Calendar
            id='patientMoveDate'
            value={
              patientMoveData.dateWhenMove
                ? moment(patientMoveData.dateWhenMove).toDate()
                : null
            }
            dateFormat='dd.mm.yy'
            showTime
            hourFormat='24'
            onChange={(e) =>
              setPatientMoveData((prevData) => ({
                ...prevData,
                dateWhenMove: moment(e.value),
              }))
            }
            placeholder='Kedy presunúť'
          />
        </div>
        <div>
          <Button label='Presunúť pacienta' onClick={movePatient} />
        </div>
      </Dialog>
    );
  };

  const renderMap = () => {
    if (!hospitalMap) return;

    return (
      <div className='map-container'>
        {renderPatientMoveDialog()}
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
              <Calendar
                value={roomsFrom ? moment(roomsFrom).toDate() : null}
                ref={calendarRef}
                dateFormat='dd.mm.yy'
                showTime
                hourFormat='24'
                onChange={(e) => {
                  setRoomsFrom(moment(e.value));
                }}
                placeholder='Zobraziť od'
              ></Calendar>
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
              <Dropdown
                value={selectedSexTypeRoom}
                onChange={(e) => handleSexRoomTypeChange(e.value || null)}
                placeholder='Typ miestnosti podľa pohlavia'
                className='left-map-menu-container-patient'
                options={[
                  {
                    label: 'Typ miestnosti podľa pohlavia',
                    value: null,
                    disabled: true,
                  },
                  {
                    label: 'Mužské miestnosti',
                    value: 'M',
                  },
                  {
                    label: 'Ženské miestnosti',
                    value: 'F',
                  },
                ]}
                showClear={true}
              />
            </div>
            <Button
              label='Vyťaženosť miestností nemocnice'
              onClick={() => generatePDF(bedState)}
            />
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

  const handleSexRoomTypeChange = (roomType) => {
    setSelectedSexTypeRoom(roomType);
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
