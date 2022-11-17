import React from "react";
import { Card } from "primereact/card";

function Patient() {
  return (
    <div>
      {" "}
      <div className="grid">
        <div className="col-5">
          <Card title="Simple Card" style={{ width: "100%", height: "100%" }}>
            <p className="m-0" style={{ lineHeight: "1.5" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Inventore sed consequuntur error repudiandae numquam deserunt
              quisquam repellat libero asperiores earum nam nobis, culpa ratione
              quam perferendis esse, cupiditate neque quas! Lorem ipsum dolor
              sit amet, consectetur adipisicing elit. Inventore sed consequuntur
              error repudiandae numquam earum nam nobis, culpa ratione quam
              perferendis esse, cupiditate neque quas!
            </p>
          </Card>
        </div>

        <div className="col-3">
          <div class="grid">
            <div class="col-12">
              <Card
                title="Advanced Card"
                style={{ width: "100%", height: "100%" }}
              >
                <p className="m-0" style={{ lineHeight: "1.5" }}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Inventore sed consequuntur error repudiandae numquam deserunt
                  quisquam repellat libero asperiores earum nam nobis, culpa
                  ratione quam perferendis esse, cupiditate neque quas!
                </p>
              </Card>
            </div>
            <div class="col-12">
              <Card
                title="Advanced Card"
                style={{ width: "100%", height: "100%" }}
              >
                <p className="m-0" style={{ lineHeight: "1.5" }}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Inventore sed consequuntur error repudiandae numquam deserunt
                  quisquam repellat libero asperiores earum nam nobis, culpa
                  ratione quam perferendis esse, cupiditate neque quas!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="grid">
        <div className="col-5">
          <Card title="Simple Card" style={{ width: "100%", height: "100%" }}>
            <p className="m-0" style={{ lineHeight: "1.5" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Inventore sed consequuntur error repudiandae numquam deserunt
              quisquam repellat libero asperiores earum nam nobis, culpa ratione
              quam perferendis esse, cupiditate neque quas! Lorem ipsum dolor
              sit amet, consectetur adipisicing elit. Inventore sed consequuntur
              error repudiandae numquam earum nam nobis, culpa ratione quam
              perferendis esse, cupiditate neque quas!
            </p>
          </Card>
        </div>

        <div class="col-6">
          <Card title="Advanced Card" style={{ width: "100%", height: "100%" }}>
            <p className="m-0" style={{ lineHeight: "1.5" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Inventore sed consequuntur error repudiandae numquam deserunt
              quisquam repellat libero asperiores earum nam nobis, culpa ratione
              quam perferendis esse, cupiditate neque quas!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default Patient;
