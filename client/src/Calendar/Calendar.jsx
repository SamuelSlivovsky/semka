import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import '../styles/calendar.css';

function EventCalendar() {
  const [currentEvents, setCurrentEvents] = useState(INITIAL_EVENTS);
  const [allDay, setAllDay] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showConfirmChanges, setShowConfirmChanges] = useState(false);
  const [eventDateStart, setEventDateStart] = useState(null);
  const [eventDateEnd, setEventDateEnd] = useState(null);
  const [currEventId, setCurrEventId] = useState(null);
  const [currEventTitle, setCurrEventTitle] = useState(null);
  const calendarRef = useRef(null);

  const handleDateSelect = (selectInfo) => {
    //let title = prompt("Please enter a new title for your event");
    setCurrEventId(null);
    setEventDateStart(null);
    setEventDateEnd(null);
    setCurrEventTitle(null);
    setAllDay(null);
    setShowAddEvent(true);
    setShowDialog(true);
    // let calendarApi = selectInfo.view.calendar;
  };

  const handleEventClick = (clickInfo) => {
    setShowDialog(true);
    setCurrEventId(clickInfo.event._def.publicId);
    setEventDateStart(new Date(clickInfo.event._instance.range.start));
    setEventDateEnd(new Date(clickInfo.event._instance.range.end));
    setCurrEventTitle(clickInfo.event._def.title);
    setAllDay(clickInfo.event._def.allDay);
  };

  const onHide = () => {
    setShowDialog(false);
    setShowAddEvent(false);
  };

  const onConfirmDialogHide = (hideDialog) => {
    setShowConfirmChanges(false);
    hideDialog ? setShowDialog(false) : setShowDialog(true);
  };

  const onSubmit = () => {
    setShowConfirmChanges(true);
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

  const onSubmitChanges = (addEvent) => {
    if (!addEvent) {
      let calendarApi = calendarRef.current.getApi();
      let currentEvent = calendarApi.getEventById(currEventId);
      allDay
        ? currentEvent.setDates(eventDateStart, eventDateEnd, { allDay: true })
        : currentEvent.setDates(eventDateStart, eventDateEnd, {
            allDay: false,
          });

      currentEvent.setProp('title', currEventTitle);
      setShowConfirmChanges(false);
      setShowDialog(false);
    } else {
      let calendarApi = calendarRef.current.getApi();
      calendarApi.unselect(); // clear date selection
      calendarApi.addEvent({
        id: createEventId(),
        title: currEventTitle,
        start: eventDateStart,
        end: eventDateEnd,
        allDay: allDay,
      });
    }
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

  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  return (
    <div className='kalendar'>
      <div className='kalendar-obal'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={calendarRef}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          weekends={true}
          initialEvents={currentEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
      </div>
      <Dialog
        header={!showAddEvent ? 'Zmena udalosti' : 'Pridať udalosť'}
        visible={showDialog}
        style={{ width: '50vw' }}
        footer={renderDialogFooter()}
        onHide={() => onHide()}
      >
        <div className='p-fluid grid formgrid'>
          <label htmlFor='basic'>Názov udalosti</label>
          <InputText
            value={currEventTitle}
            onChange={(e) => setCurrEventTitle(e.target.value)}
          />
          <div className='field col-12 md:col-4'>
            <label htmlFor='basic'>Začiatok udalosti</label>
            <Calendar
              id='basic'
              value={!showAddEvent ? eventDateStart : ''}
              onChange={(e) => setEventDateStart(e.value)}
              showTime
              showIcon
              dateFormat='dd.mm.yy'
            />
          </div>
          <div className='field col-12 md:col-4'>
            <label htmlFor='basic'>Koniec udalosti</label>
            <Calendar
              id='basic'
              value={!showAddEvent ? eventDateEnd : ''}
              onChange={(e) => setEventDateEnd(e.value)}
              showTime
              showIcon
              dateFormat='dd.mm.yy'
            />
          </div>
          <div className='field-checkbox' style={{ marginTop: '10px' }}>
            <Checkbox
              inputId='binary'
              checked={allDay}
              onChange={(e) => setAllDay(e.checked)}
            />
            <label htmlFor='binary' style={{ marginLeft: '10px' }}>
              Celodenná udalosť
            </label>
          </div>
        </div>

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
