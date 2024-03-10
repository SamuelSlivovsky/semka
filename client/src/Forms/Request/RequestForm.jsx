import React, { useState } from "react";

import { RadioButton } from "primereact/radiobutton";
import Basic from "./Basic";
export default function RequestForm() {
  const categories = [
    { name: "Základná", key: "B" },
    { name: "Splomocnenie", key: "M" },
    { name: "Žiadosť o zaslanie výsledkov e-mailom", key: "R" },
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div
      style={{ width: "100%", marginTop: "2rem", marginLeft: "10px" }}
      className="p-fluid grid formgrid"
    >
      <div className="flex flex-row gap-3 ml-3">
        {categories.map((category) => {
          return (
            <div key={category.key} className="flex align-items-center">
              <RadioButton
                inputId={category.key}
                name="category"
                value={category}
                onChange={(e) => setSelectedCategory(e.value)}
                checked={selectedCategory.key === category.key}
              />
              <label htmlFor={category.key} className="ml-2">
                {category.name}
              </label>
            </div>
          );
        })}
      </div>
      {selectedCategory.key == "B" ? (
        <Basic />
      ) : selectedCategory.key == "M" ? (
        ""
      ) : (
        ""
      )}
    </div>
  );
}
