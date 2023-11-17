// ChatApp.js

import React, { useEffect, useState } from "react";
import socketService from "../service/socketService.js";
import GetUserData from "../Auth/GetUserData.jsx";
import "../styles/chat.css";

const Chat = () => {
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

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleInputChange}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
