import React, { useEffect, useState } from "react";
import socketService from "../service/socketService.js";
import GetUserData from "../Auth/GetUserData.jsx";

function User() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Connect to Socket.io when the component mounts
    socketService.connect();

    // Listen for incoming messages
    socketService.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Disconnect from Socket.io when the component unmounts
      socketService.disconnect();
    };
  }, []);

  const sendMessage = () => {
    // Emit a new message to the server
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    console.log(userDataHelper);
    socketService.emit("sendMessage", newMessage, "group1");
    setNewMessage("");
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default User;
