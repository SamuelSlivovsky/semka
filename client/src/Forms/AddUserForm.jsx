import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import GetUserData from "../Auth/GetUserData";
import { Checkbox } from "primereact/checkbox";
import {Toast} from "primereact/toast";


const toast = useRef(null);
function AddUserForm(props) {
  const [name, setName] = useState(null);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    };
    fetch(
      `/selects/zoznamLekarov/${userDataHelper.UserInfo.userid}`,
      requestOptions
    )
      .then((response) => {
          if (response.ok) {
              return response.json();
              // Kontrola ci je token expirovany (status:410)
          } else if (response.status === 410) {
              // Token expiroval redirect na logout
              toast.current.show({
                  severity: "error",
                  summary: "Session timeout redirecting to login page",
                  life: 999999999,
              });
              setTimeout(() => {
                  navigate("/logout");
              }, 3000);
          }
      })
      .then((data) => {
        setOptions(data);
      });
  }, []);

  return (
      <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
          <div><Toast ref={toast} position="top-center"/></div>
          <Dropdown
              value={name}
              options={options}
              onChange={(e) => setName(e.value)}
              style={{width: "100%"}}
              optionLabel="meno"
              filter
          ></Dropdown>
          <div>
              {" "}
              <label>Povoliť históriu?</label>{" "}
              <Checkbox
                  checked={props.historyCheck}
                  onChange={(e) => props.setHistoryCheck(e.checked)}
              ></Checkbox>
          </div>

          <Button label="Pridaj" onClick={() => props.onClick(name)}></Button>
      </div>
  );
}

export default AddUserForm;
