import {Chart} from "primereact/chart";
import React from "react";

export default function WarehouseStatistics() {


    return (
        <div>
            <h2>Štatistiky skladu</h2>
            <div>
                <Chart
                    type="bar"
                    data={NaN}
                    options={NaN}
                    style={{ width: "35%" }}
                />
            </div>
        </div>
    );
}