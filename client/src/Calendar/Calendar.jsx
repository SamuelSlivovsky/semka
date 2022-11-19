import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import "../styles/calendar.css";

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
  const [eventType, setEventType] = useState(null);
  const calendarRef = useRef(null);

  const eventTypes = [
    { name: "Operácia", code: "OP" },
    { name: "Vyšetrenie", code: "EX" },
    { name: "Hospitalizácia", code: "HOSP" },
  ];

  const handleDateSelect = (selectInfo) => {
    setShowAddEvent(true);
    setShowDialog(true);
    setCurrEventId(null);
    setEventDateStart(new Date(selectInfo.start));
    setEventDateEnd(null);
    setCurrEventTitle(null);
    setAllDay(null);
    setEventType(null);
  };

  const handleEventClick = (clickInfo) => {
    setShowDialog(true);
    switch (clickInfo.event._def.extendedProps.type) {
      case "OP":
        setEventType(eventTypes[0]);
        break;
      case "EX":
        setEventType(eventTypes[1]);
        break;
      case "HOSP":
        setEventType(eventTypes[2]);
        break;
      default:
        setEventType(clickInfo.event._def.extendedProps.type);
        break;
    }
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

  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  const onEventTypeChange = (e) => {
    setEventType(e.value);
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

      currentEvent.setProp("title", currEventTitle);
    } else {
      let backgroundColor = "";
      switch (eventType.code) {
        case "OP":
          backgroundColor = "#00916E";
          break;
        case "EX":
          backgroundColor = "#593F62";
          break;
        case "HOSP":
          backgroundColor = "#8499B1";
          break;
        default:
          break;
      }
      let calendarApi = calendarRef.current.getApi();
      calendarApi.unselect(); // clear date selection
      calendarApi.addEvent({
        id: createEventId(),
        title: currEventTitle,
        start: eventDateStart,
        end: eventDateEnd,
        allDay: allDay,
        type: eventType,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
      });
    }
    setShowConfirmChanges(false);
    setShowDialog(false);
  };

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          label="Nie"
          icon="pi pi-times"
          className="p-button-danger"
          onClick={() => onHide()}
        />
        <Button
          label="Áno"
          icon="pi pi-check"
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
          label="Zrušiť"
          onClick={() => onConfirmDialogHide(false)}
          className="p-button-text"
        />
        <Button
          label="Nie"
          icon="pi pi-times"
          className="p-button-danger"
          onClick={() => onConfirmDialogHide(true)}
        />
        <Button
          label="Áno"
          icon="pi pi-check"
          onClick={() => onSubmitChanges(showAddEvent)}
          autoFocus
        />
      </div>
    );
  };

  return (
    <div className="kalendar">
      <div className="kalendar-obal">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={calendarRef}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          weekends={true}
          initialEvents={currentEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
          locale="sk"
        />
      </div>
      <Dialog
        header={!showAddEvent ? "Zmena udalosti" : "Pridať udalosť"}
        visible={showDialog}
        style={{ width: "50vw" }}
        footer={renderDialogFooter()}
        onHide={() => onHide()}
      >
        <div className="p-fluid grid formgrid">
          <div className="field col-12">
            <label htmlFor="basic">Názov udalosti</label>
            <InputText
              value={currEventTitle !== null ? currEventTitle : ""}
              onChange={(e) => setCurrEventTitle(e.target.value)}
            />
          </div>
          <div className="field col-12 ">
            <label htmlFor="basic">Začiatok udalosti</label>
            <Calendar
              id="basic"
              value={eventDateStart}
              onChange={(e) => setEventDateStart(e.value)}
              showTime
              showIcon
              dateFormat="dd.mm.yy"
            />
          </div>
          <div className="field col-12 ">
            <label htmlFor="basic">Koniec udalosti</label>
            <Calendar
              id="basic"
              value={eventDateEnd}
              onChange={(e) => setEventDateEnd(e.value)}
              showTime
              showIcon
              dateFormat="dd.mm.yy"
            />
          </div>
          <div className="field col-12 ">
            <label htmlFor="basic">Typ udalosti</label>
            <Dropdown
              value={eventType}
              options={eventTypes}
              onChange={onEventTypeChange}
              optionLabel="name"
            />
          </div>
          <div className="field-checkbox col-12" style={{ marginTop: "10px" }}>
            <Checkbox
              inputId="binary"
              checked={allDay}
              onChange={(e) => setAllDay(e.checked)}
            />
            <label htmlFor="binary" style={{ marginLeft: "10px" }}>
              Celodenná udalosť
            </label>
          </div>
        </div>

        <Dialog
          header="Prajete si uložiť zmeny?"
          visible={showConfirmChanges}
          style={{ width: "50vw" }}
          footer={renderConfirmChangesFooter()}
          onHide={() => onConfirmDialogHide()}
        />
      </Dialog>
    </div>
  );
}

export default EventCalendar;
