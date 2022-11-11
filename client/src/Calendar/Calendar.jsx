import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

function EventCalendar() {
  const [currentEvents, setCurrentEvents] = useState(INITIAL_EVENTS);
  const [showDialog, setShowDialog] = useState(false);
  const [eventDateStart, setEventDateStart] = useState(null);
  const [eventDateEnd, setEventDateEnd] = useState(null);
  const [currEventId, setCurrEventId] = useState(null);
  const calendarRef = useRef(null);

  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo) => {
    /* if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }*/

    setShowDialog(true);
    setCurrEventId(clickInfo.event._def.publicId);
    setEventDateStart(new Date(clickInfo.event._instance.range.start));
    setEventDateEnd(new Date(clickInfo.event._instance.range.end));
  };

  const onHide = () => {
    setShowDialog(false);
  };

  const onSubmit = () => {
    let calendarApi = calendarRef.current.getApi();
    let currentEvent = calendarApi.getEventById(currEventId);
    currentEvent.setDates(eventDateStart, eventDateEnd);
    setShowDialog(false);
  };

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide()}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => onSubmit()}
          autoFocus
        />
      </div>
    );
  };

  const handleEvents = (events) => {
    setCurrentEvents(events);
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
        />
      </div>
      <Dialog
        header="Zmena udalosti"
        visible={showDialog}
        style={{ width: "50vw" }}
        footer={renderDialogFooter()}
        onHide={() => onHide()}
      >
        <div className="p-fluid grid formgrid">
          <div className="field col-12 md:col-4">
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
          <div className="field col-12 md:col-4">
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
        </div>
      </Dialog>
    </div>
  );
}

export default EventCalendar;
