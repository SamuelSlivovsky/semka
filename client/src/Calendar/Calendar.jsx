import React, { useState, useRef, useEffect, Suspense } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { ProgressBar } from 'primereact/progressbar';
import '../styles/calendar.css';

function EventCalendar(props) {
  const [currentEvents, setCurrentEvents] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showConfirmChanges, setShowConfirmChanges] = useState(false);
  const [eventDateStart, setEventDateStart] = useState(null);
  const [currEventId, setCurrEventId] = useState(null);
  const [currEventTitle, setCurrEventTitle] = useState(null);
  const [eventType, setEventType] = useState(null);
  const [selectButtonValue, setSelectButtonValue] =
    useState('Detaily udalosti');

  const calendarRef = useRef(null);
  const eventTypes = [
    { name: 'Operácia', code: 'OP' },
    { name: 'Vyšetrenie', code: 'EX' },
    { name: 'Hospitalizácia', code: 'HOSP' },
  ];
  const options = ['Detaily udalosti', 'Zmeniť dátum udalosti'];
  const patientOptions = ['Detaily udalosti'];

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    let route =
      props.userData.UserInfo.role === 2 || props.userData.UserInfo.role === 3
        ? 'calendar/udalostiLekara/'
        : props.userData.UserInfo.role === 4
        ? 'calendar/udalostiPacienta/'
        : 'calendar/udalostiLekara/';
    fetch(`${route}${props.userData.UserInfo.userid}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data.forEach((element) => {
          switch (element.type) {
            case 'OPE':
              element.backgroundColor = '#00916E';
              break;
            case 'VYS':
              element.backgroundColor = '#593F62';
              break;
            case 'HOS':
              element.backgroundColor = '#8499B1';
              break;
            case 'KONZ':
              element.backgroundColor = 'blue';
              break;
            default:
              break;
          }
        });
        console.log(data);
        setCurrentEvents(data);
        setCalendarVisible(true);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEventClick = (clickInfo) => {
    setShowDialog(true);
    setShowAddEvent(false);
    switch (clickInfo.event._def.extendedProps.type) {
      case 'OPE':
        setEventType(eventTypes[0]);
        break;
      case 'VYS':
        setEventType(eventTypes[1]);
        break;
      case 'HOS':
        setEventType(eventTypes[2]);
        break;
      default:
        setEventType(clickInfo.event._def.extendedProps.type);
        break;
    }
    setCurrEventId(clickInfo.event._def.publicId);
    const startDate = new Date(clickInfo.event._instance.range.start);
    startDate.setHours(startDate.getHours() - 1);
    setEventDateStart(startDate);
    setCurrEventTitle(
      clickInfo.event._def.extendedProps.type +
        ' - ' +
        clickInfo.event._def.extendedProps.MENO +
        ' ' +
        clickInfo.event._def.extendedProps.PRIEZVISKO
    );
  };

  const onHide = () => {
    setShowDialog(false);
  };

  const onConfirmDialogHide = (hideDialog) => {
    setShowConfirmChanges(false);
    hideDialog ? setShowDialog(false) : setShowDialog(true);
  };

  const onSubmit = () => {
    setShowConfirmChanges(true);
  };

  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  const onSubmitChanges = (addEvent) => {
    if (!addEvent) {
      const token = localStorage.getItem('hospit-user');
      let calendarApi = calendarRef.current.getApi();
      let currentEvent = calendarApi.getEventById(currEventId);
      let endDate = new Date(eventDateStart.getTime());
      let startDate = new Date(eventDateStart.getTime());
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          datum: startDate.toLocaleString('en-GB').replace(',', ''),
          id: currEventId,
        }),
      };
      fetch('/api/calendar/zmenaZaznamu', requestOptions)
        .then((response) => response.json())
        .then((res) => {
          currentEvent.setDates(startDate, endDate, {
            allDay: false,
          });
          console.log('first');
          setShowConfirmChanges(false);
          setShowDialog(false);
        });
    }
  };

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          label='Nie'
          icon='pi pi-times'
          className='p-button-danger'
          onClick={() => onHide()}
        />
        <Button
          label='Áno'
          icon='pi pi-check'
          onClick={() => onSubmit()}
          autoFocus
        />
      </div>
    );
  };

  const renderConfirmChangesFooter = () => {
    return (
      <div>
        <Button
          label='Zrušiť'
          onClick={() => onConfirmDialogHide(false)}
          className='p-button-text'
        />
        <Button
          label='Nie'
          icon='pi pi-times'
          className='p-button-danger'
          onClick={() => onConfirmDialogHide(true)}
        />
        <Button
          label='Áno'
          icon='pi pi-check'
          onClick={() => onSubmitChanges(showAddEvent)}
          autoFocus
        />
      </div>
    );
  };

  const renderAddEventContent = () => {
    return selectButtonValue === 'Zmeniť dátum udalosti' || showAddEvent ? (
      <>
        <div className='field col-12'>
          <h3 htmlFor='basic'>Udalosť</h3>
          <p>{currEventTitle}</p>
        </div>
        <div className='field col-12 '>
          <label htmlFor='basic'>Začiatok udalosti</label>
          <Calendar
            id='basic'
            value={eventDateStart}
            onChange={(e) => setEventDateStart(e.value)}
            showTime
            showIcon
            dateFormat='dd.mm.yy'
          />
        </div>
        <div className='field col-12 '>
          <h3 htmlFor='basic'>Typ udalosti</h3>
          <p>{eventType !== null ? eventType.name : ''}</p>
        </div>
      </>
    ) : !showAddEvent ? (
      <>
        <div className='field col-12'>
          <h3 htmlFor='basic'>Názov udalosti</h3>
          <p>{currEventTitle}</p>
        </div>
        <div className='field col-12 '>
          <h3 htmlFor='basic'>Začiatok udalosti</h3>
          <p>
            {console.log(eventDateStart)}
            {eventDateStart !== null
              ? eventDateStart.toLocaleString('sk').replaceAll('. ', '.')
              : ''}
          </p>
        </div>
        <div className='field col-12 '>
          <h3 htmlFor='basic'>Typ udalosti</h3>
          <p>{eventType !== null ? eventType.name : ''}</p>
        </div>
      </>
    ) : (
      ''
    );
  };

  return (
    <div className='kalendar'>
      <div className='kalendar-obal'>
        <Suspense>
          {!calendarVisible ? (
            <ProgressBar
              mode='indeterminate'
              style={{ height: '6px' }}
            ></ProgressBar>
          ) : (
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              ref={calendarRef}
              headerToolbar={{
                left: 'prev,next today prevYear,nextYear',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              initialView='dayGridMonth'
              editable={true}
              selectable={true}
              weekends={true}
              initialEvents={currentEvents}
              eventClick={handleEventClick}
              eventsSet={handleEvents}
              locale='SK'
            />
          )}
        </Suspense>
      </div>
      <Dialog
        header={!showAddEvent ? selectButtonValue : 'Pridať udalosť'}
        visible={showDialog}
        style={{ width: '50vw' }}
        footer={
          selectButtonValue === 'Zmeniť dátum udalosti'
            ? renderDialogFooter()
            : ''
        }
        onHide={() => onHide()}
      >
        {!showAddEvent || props.userData.UserInfo.role !== 4 ? (
          <div className='p-fluid grid formgrid'>
            <SelectButton
              value={selectButtonValue}
              options={
                props.userData.UserInfo.role === 4 ? patientOptions : options
              }
              onChange={(e) => setSelectButtonValue(e.value)}
              style={{
                height: '80px',
                width: '300px',
                marginBottom: '1rem',
                marginLeft: '0.75rem',
              }}
            />
            {renderAddEventContent()}
          </div>
        ) : (
          <div className='p-fluid grid formgrid'>{renderAddEventContent()}</div>
        )}
        <Dialog
          header='Prajete si uložiť zmeny?'
          visible={showConfirmChanges}
          style={{ width: '50vw' }}
          footer={renderConfirmChangesFooter()}
          onHide={() => onConfirmDialogHide()}
        />
      </Dialog>
    </div>
  );
}

export default EventCalendar;
