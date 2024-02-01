import React, { useEffect, useState } from "react";
import GetUserData from "../../Auth/GetUserData";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
function TabMeetings() {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/konzilia/${userDataHelper.UserInfo.userid}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setMeetings(data);
      });
  }, []);

  const dateBodyTemplate = (option) => {
    return (
      <span>
        {new Date(option.DATUM).toLocaleString("sk-SK", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </span>
    );
  };

  return (
    <div className="card">
      <DataTable
        value={meetings}
        scrollable
        selectionMode="single"
        scrollHeight={`${window.innerHeight - 100}px`}
        paginator
        rows={25}
        emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
      >
        <Column field="DOVOD" header="Dôvod"></Column>
        <Column body={dateBodyTemplate} header="Dátum"></Column>
      </DataTable>
    </div>
  );
}

export default TabMeetings;
