import React from "react";
import { Button } from "primereact/button"; // Importujeme Button komponent
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Toto zabezpečí, že div zaberá celú výšku obrazovky
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>404 Stránka nebola nájdená</h1>
        <p>Ooops! Zdá sa, že stránka, ktorú hľadáte, neexistuje.</p>
        <Button
          label="Návrat na domovskú obrazovku"
          icon="pi pi-home"
          className="p-button-raised p-button-info"
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
