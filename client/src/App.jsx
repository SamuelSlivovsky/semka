import React from "react";
import "./App.css";
import Menu from "./TabMenu/Menu";
import EventCalendar from "./Calendar/Calendar";
import Home from "./Home/Home";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
function App() {
  return (
    <div>
      <Menu />
      <Router>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route
            path="/calendar"
            element={<EventCalendar></EventCalendar>}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
