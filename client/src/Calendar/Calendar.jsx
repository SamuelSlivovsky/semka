import React, { useState, useRef, useEffect, Suspense } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { ProgressBar } from "primereact/progressbar";
import { Dropdown } from "primereact/dropdown";
import "../styles/calendar.css";

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
    useState("Detaily udalosti");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [calendarKey, setCalendarKey] = useState(Date.now());
  const [currentEvent, setCurrentEvent] = useState(null);

  const calendarRef = useRef(null);
  const eventTypes = [
    { name: "Operácia", code: "OP" },
    { name: "Vyšetrenie", code: "EX" },
    { name: "Hospitalizácia", code: "HOSP" },
    { name: "Konzílium", code: "KONZ" },
  ];
  const options = ["Detaily udalosti", "Zmeniť dátum udalosti"];
  const patientOptions = ["Detaily udalosti"];

  useEffect(() => {
    fetchCalendar(props.userData.UserInfo.userid);
    if (props.userData.UserInfo.role === 3) fetchDoctors();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isAfterToday = (element) => {
    return new Date(element.DAT_DO) > new Date();
  };

  const fetchCalendar = (userid) => {
    setCalendarVisible(false);

    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    let route =
      props.userData.UserInfo.role === 2 || props.userData.UserInfo.role === 3
        ? "calendar/udalostiLekara/"
        : props.userData.UserInfo.role === 9999
        ? "calendar/udalostiPacienta/"
        : "calendar/udalostiLekara/";
    fetch(
      `${route}${
        props.userData.UserInfo.role === 9999
          ? userid.replace("/", "$")
          : userid
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        data.forEach((element) => {
          switch (element.type) {
            case "OPE":
              element.backgroundColor = "#00916E";

              break;
            case "VYS":
              element.backgroundColor = "#593F62";

              break;
            case "HOS":
              element.backgroundColor = "#8499B1";
              element.end =
                element.DAT_DO != null && isAfterToday(element)
                  ? element.DAT_DO
                  : null;
              break;
            case "KONZ":
              element.backgroundColor = "blue";
              break;
            default:
              break;
          }
        });
        setCurrentEvents(data);
        setCalendarVisible(true);
        setCalendarKey(Date.now());
      });
  };

  const fetchDoctors = () => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/lekari/${props.userData.UserInfo.userid}`, { headers })
      .then((res) => res.json())
      .then((result) => {
        result = result.map((item) => {
          return { ...item, name: `${item.MENO} ${item.PRIEZVISKO}` };
        });
        setSelectedDoctor(
          result.find(
            (item) => item.CISLO_ZAM == props.userData.UserInfo.userid
          )
        );
        setDoctors(result);
      });
  };

  const handleEventClick = (clickInfo) => {
    setShowDialog(true);
    setShowAddEvent(false);
    switch (clickInfo.event._def.extendedProps.type) {
      case "OPE":
        setEventType(eventTypes[0]);
        break;
      case "VYS":
        setEventType(eventTypes[1]);
        break;
      case "HOS":
        setEventType(eventTypes[2]);
        break;
      default:
        setEventType(eventTypes[3]);
        break;
    }
    setCurrEventId(clickInfo.event._def.publicId);
    const startDate = new Date(clickInfo.event._instance.range.start);
    startDate.setHours(startDate.getHours() - 1);
    setEventDateStart(startDate);
    setCurrentEvent(clickInfo.event);
    setCurrEventTitle(
      clickInfo.event._def.extendedProps.type +
        " - " +
        (clickInfo.event._def.extendedProps.MENO
          ? clickInfo.event._def.extendedProps.MENO +
            " " +
            clickInfo.event._def.extendedProps.PRIEZVISKO
          : clickInfo.event._def.extendedProps.DOVOD)
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
      const token = localStorage.getItem("hospit-user");
      let calendarApi = calendarRef.current.getApi();
      let currentEvent = calendarApi.getEventById(currEventId);
      let endDate = new Date(eventDateStart.getTime());
      let startDate = new Date(eventDateStart.getTime());
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          datum: startDate.toLocaleString("en-GB").replace(",", ""),
          id: currEventId,
        }),
      };
      fetch("/calendar/zmenaZaznamu", requestOptions)
        .then((response) => response.json())
        .then((res) => {
          currentEvent.setDates(startDate, endDate, {
            allDay: false,
          });
          setShowConfirmChanges(false);
          setShowDialog(false);
        });
    }
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

  const renderAddEventContent = () => {
    return selectButtonValue === "Zmeniť dátum udalosti" || showAddEvent ? (
      <>
        <div className="field col-12">
          <h3 htmlFor="basic">Udalosť</h3>
          <p>{currEventTitle}</p>
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
          <h3 htmlFor="basic">Typ udalosti</h3>
          <p>{eventType !== null ? eventType.name : ""}</p>
        </div>
      </>
    ) : !showAddEvent ? (
      <>
        {console.log(currentEvent)}
        <div className="field col-12">
          <h3 htmlFor="basic">Názov udalosti</h3>
          <p>{currEventTitle}</p>
        </div>
        <div className="field col-12 ">
          <h3 htmlFor="basic">Začiatok udalosti</h3>
          <p>
            {eventDateStart !== null
              ? eventDateStart.toLocaleString("sk").replaceAll(". ", ".")
              : ""}
          </p>
        </div>
        {currentEvent &&
        currentEvent != null &&
        currentEvent._def.extendedProps.DAT_DO ? (
          <div className="field col-12 ">
            <h3 htmlFor="basic">Koniec udalosti</h3>
            <p>
              {new Date(
                currentEvent._def.extendedProps.DAT_DO
              ).toLocaleDateString("de", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
              {" " +
                new Date(
                  currentEvent._def.extendedProps.DAT_DO
                ).toLocaleTimeString()}
            </p>
          </div>
        ) : (
          ""
        )}
        <div className="field col-12 ">
          <h3 htmlFor="basic">Typ udalosti</h3>
          <p>{eventType !== null ? eventType.name : ""}</p>
        </div>
      </>
    ) : (
      ""
    );
  };

  return (
    <div className="kalendar">
      <div className="kalendar-obal">
        <Suspense>
          {!calendarVisible ? (
            <ProgressBar
              mode="indeterminate"
              style={{ height: "6px" }}
            ></ProgressBar>
          ) : (
            <div>
              {props.userData.UserInfo.role === 3 ? (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    alignItems: "center",
                  }}
                >
                  <label>
                    <h2>Kalendár lekára</h2>
                  </label>
                  <Dropdown
                    style={{ height: "50px" }}
                    value={selectedDoctor}
                    options={doctors}
                    optionLabel="name"
                    onChange={(e) => {
                      setSelectedDoctor(e.value);
                      fetchCalendar(e.value.CISLO_ZAM);
                    }}
                  />
                </div>
              ) : (
                ""
              )}

              <FullCalendar
                locales={allLocales}
                key={calendarKey}
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                ref={calendarRef}
                headerToolbar={{
                  left: "prev,next today prevYear,nextYear",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                weekends={true}
                initialEvents={currentEvents}
                eventClick={handleEventClick}
                eventsSet={handleEvents}
                locale={"sk"}
              />
            </div>
          )}
        </Suspense>
      </div>
      <Dialog
        header={!showAddEvent ? selectButtonValue : "Pridať udalosť"}
        visible={showDialog}
        style={{ width: "50vw" }}
        footer={
          selectButtonValue === "Zmeniť dátum udalosti"
            ? renderDialogFooter()
            : ""
        }
        onHide={() => onHide()}
      >
        {!showAddEvent || props.userData.UserInfo.role !== 4 ? (
          <div className="p-fluid grid formgrid">
            <SelectButton
              value={selectButtonValue}
              options={
                props.userData.UserInfo.role === 9999 ||
                (eventType != null && eventType.code == "KONZ")
                  ? patientOptions
                  : options
              }
              onChange={(e) => setSelectButtonValue(e.value)}
              style={{
                height: "80px",
                width: "300px",
                marginBottom: "1rem",
                marginLeft: "0.75rem",
              }}
            />
            {renderAddEventContent()}
          </div>
        ) : (
          <div className="p-fluid grid formgrid">{renderAddEventContent()}</div>
        )}
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
