import React, { useEffect, useState } from "react";
import "../styles/chat.css";
import Messages from "./Messages.jsx";
import GetUserData from "../Auth/GetUserData.jsx";
const Chat = () => {
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const userDataHelper = GetUserData(localStorage.getItem("hospit-user"));

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("hospit-user"),
      },
    };
    fetch(`/chat/groups/${userDataHelper.UserInfo.userid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setGroups(
          data.map((item) => {
            return (
              <div
                style={{
                  backgroundColor: `#${Math.floor(
                    Math.random() * 16777215
                  ).toString(16)}`,
                  height: "60px",
                  width: "60px",
                  marginTop: "10px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "40px",
                }}
                onClick={() => setGroup(item.ID_SKUPINY)}
              >
                <p>{item.NAZOV[0]}</p>
              </div>
            );
          })
        );
      });
  }, []);

  return (
    <div className="chat-container">
      <div
        style={{
          width: "100px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#aefdf3",
          alignItems: "center",
        }}
      >
        {groups}
      </div>
      {group ? <Messages group={group} /> : "Vyber skupinu"}
    </div>
  );
};

export default Chat;
