import React from "react";
import { Card } from "primereact/card";

function Patient() {
  return (
    <div>
      <div className="col-6">
        <Card
          title="Simple Card"
          style={{ width: "25rem", marginBottom: "2em" }}
        >
          <p className="m-0" style={{ lineHeight: "1.5" }}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
            sed consequuntur error repudiandae numquam deserunt quisquam
            repellat libero asperiores earum nam nobis, culpa ratione quam
            perferendis esse, cupiditate neque quas!
          </p>
        </Card>

        <Card title="Recepty" style={{ width: "25em" }}>
          <p className="m-0" style={{ lineHeight: "1.5" }}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
            sed consequuntur error repudiandae numquam deserunt quisquam
            repellat libero asperiores earum nam nobis, culpa ratione quam
            perferendis esse, cupiditate neque quas!
          </p>
        </Card>
      </div>
    </div>
  );
}
export default Patient;
