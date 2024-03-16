import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

function ChatSettings(props) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };

    fetch(`chat/pouzivatelia/${props.groupId}/${props.userid}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsers(data);
        setUser(data[0]);
      });
  }, []);

  const updateUser = (e) => {
    const token = localStorage.getItem("hospit-user");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        historia: e.checked ? 1 : 0,
        id_skupiny: props.groupId,
        userid: user.USERID,
      }),
    };

    fetch("chat/updateHistoria", requestOptions);
    setUser({ ...user, HISTORIA: e.checked ? 1 : 0 });
    setUsers(
      users.map((item) => {
        if (item.USERID == user.USERID)
          return { ...item, HISTORIA: e.checked ? 1 : 0 };
        else return item;
      })
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Dropdown
        options={users}
        optionLabel="meno"
        value={user}
        onChange={(e) => setUser(e.value)}
      />
      {user ? (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Checkbox
            checked={user.HISTORIA == 1}
            onChange={(e) => {
              updateUser(e);
            }}
          />
          <h2>Povolenie histórie správ</h2>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ChatSettings;
