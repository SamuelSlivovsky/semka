import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import "primereact/resources/themes/lara-light-teal/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons

const root = ReactDOM.createRoot(document.getElementById("root"));
const value = {
  locale: "sk",
};
root.render(
  <Router>
    <PrimeReactProvider value={value}>
      <App />
    </PrimeReactProvider>
  </Router>
);

reportWebVitals();
