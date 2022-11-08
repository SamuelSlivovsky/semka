import React from "react";
import "./App.css";
import Menu from "./TabMenu/Menu";
import Calendar from './Calendar/Calendar'
function App() {
  return (
    <div>
      <Menu />

      <div className="calendar" style={{ width: '50%', height: '50%' }}>
        <Calendar></Calendar>
      </div>
    </div>
  );
}

export default App;
