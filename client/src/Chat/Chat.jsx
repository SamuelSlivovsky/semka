import React, { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import Messages from "./Messages.jsx";
import GetUserData from "../Auth/GetUserData.jsx";
import "../styles/chat.css";
import CreateNewGroup from "./CreateNewGroup.jsx";
import {Toast} from "primereact/toast";
const Chat = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  const toast = useRef(null);
  const userDataHelper = GetUserData(localStorage.getItem("hospit-user"));
  const addGroup = (
    <div
      style={{
        margin: "5px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "1em",
        backgroundColor: "gray",
        height: "50px",
        padding: "5px",
        borderRadius: "5px",
        cursor: "pointer",
        width: "170px",
      }}
      onClick={() => setShow(true)}
    >
      <div
        style={{
          backgroundColor: `#aef7ee`,
          height: "30px",
          minWidth: "30px",
          borderRadius: "10px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <i className="pi pi-plus"></i>
      </div>
      Nová skupina
    </div>
  );

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("hospit-user"),
      },
    };
    fetch(`/chat/groups/${userDataHelper.UserInfo.userid}`, requestOptions)
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
        setGroups([
          addGroup,
          ...data.map((item) => {
            return (
              <div
                style={{
                  margin: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "1em",
                  backgroundColor: "gray",
                  height: "50px",
                  padding: "5px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "170px",
                }}
                onClick={() => setGroup(item)}
              >
                <div
                  style={{
                    backgroundColor: `#aef7ee`,
                    height: "30px",
                    width: "30px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                    position: "relative",
                  }}
                >
                    <div><Toast ref={toast} position="top-center"/></div>
                  <p>{item.NAZOV[0]}</p>
                  {item.POCET > 0 ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "-4px",
                        left: "25px",
                        display: "inline-block",
                        padding: "0 4px",
                        minWidth: "8px",
                        maxWidth: "18px",
                        height: "16px",
                        borderRadius: "22px",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: "400",
                        lineHeight: "16px",
                        backgroundColor: "#c00",
                        color: "#fff",
                        zIndex: 9999,
                      }}
                    >
                      {item.POCET}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {item.NAZOV}
              </div>
            );
          }),
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="chat-container">
      <div
        style={{
          width: "200px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#454545",
          alignItems: "start",
        }}
      >
        {loading ? <ProgressSpinner /> : groups}
      </div>
      {group ? (
        <Messages group={group} setGroups={setGroups} groups={groups} />
      ) : (
        "Vyber skupinu"
      )}
      <Dialog
        style={{ maxWidth: "80%" }}
        visible={show}
        onHide={() => setShow(false)}
        header={<h2>Vytvorenie novej skupiny</h2>}
      >
        <CreateNewGroup userDataHelper={userDataHelper} />
      </Dialog>
    </div>
  );
};

export default Chat;
