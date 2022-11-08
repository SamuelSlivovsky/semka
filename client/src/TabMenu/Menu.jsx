import React from "react";
import { TabMenu } from "primereact/tabmenu";
function Menu() {
  const items = [
    { label: "Home", icon: "pi pi-fw pi-home" },
    { label: "Calendar", icon: "pi pi-fw pi-calendar" },
    { label: "Edit", icon: "pi pi-fw pi-pencil" },
    { label: "Documentation", icon: "pi pi-fw pi-file" },
    { label: "Settings", icon: "pi pi-fw pi-cog" },
  ];

  return (
    <div className="card" style={{ backgroundColor: "#071426" }}>
      <TabMenu model={items} style={{}} />
    </div>
  );
}

export default Menu;
