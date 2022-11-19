let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: "All-day event",
    start: todayStr,
    type: "OP",
    borderColor: "#00916E",
    backgroundColor: "#00916E",
  },
  {
    id: createEventId(),
    title: "Timed event",
    start: todayStr + "T12:00:00",
    type: "EX",
    borderColor: "#593F62",
    backgroundColor: "#593F62",
  },
  {
    id: createEventId(),
    title: "Timed event",
    start: todayStr + "T12:00:00",
    type: "HOSP",
    borderColor: "#8499B1",
    backgroundColor: "#8499B1",
  },
];

export function createEventId() {
  return String(eventGuid++);
}
