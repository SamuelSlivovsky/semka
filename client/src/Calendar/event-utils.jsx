let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    start: todayStr,
    type: "OP",
  },
  {
    id: createEventId(),
    start: todayStr + "T12:00:00",
    type: "EX",
  },
  {
    id: createEventId(),
    start: todayStr + "T12:00:00",
    type: "HOSP",
  },
];

export function createEventId() {
  return String(eventGuid++);
}
