import React, { useEffect, useState } from "react";
import socketService from "../service/socketService.js";
import "../styles/chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [mySocketId, setMySocketId] = useState("");

  useEffect(() => {
    socketService.connect();
    socketService.on("yourSocketId", (socketId) => {
      setMySocketId(socketId);
    });

    socketService.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketService.on("newImage", (imageMessage) => {
      setMessages((prevMessages) => [...prevMessages, imageMessage]);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (image) {
      // If an image is selected, send it as a separate event
      socketService.emit("sendImage", image, "group1");
      setImage(null);
    } else if (newMessage.trim() !== "") {
      // Send regular text message
      socketService.emit("sendMessage", newMessage, "group1");
    }

    setNewMessage("");
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openImageInNewTab = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  const isCurrentUser = (sender) => {
    return sender === mySocketId;
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender} ${
              isCurrentUser(message.sender) ? "current-user" : ""
            }`}
          >
            {isCurrentUser(message.sender) ? (
              <>
                {message.type === "image" ? (
                  <img
                    src={message.content}
                    alt="sent"
                    onClick={() => openImageInNewTab(message.content)}
                    className="image-preview"
                  />
                ) : (
                  <p style={{ marginLeft: "auto" }}>{message.content}</p>
                )}{" "}
                <div
                  className={`avatar`}
                  style={{ backgroundColor: "#3498db" }}
                ></div>
              </>
            ) : (
              <>
                <div
                  className={`avatar`}
                  style={{ backgroundColor: "#3498db" }}
                ></div>
                {message.type === "image" ? (
                  <img
                    src={message.content}
                    alt="sent"
                    onClick={() => openImageInNewTab(message.content)}
                    className="image-preview"
                  />
                ) : (
                  message.content
                )}{" "}
              </>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <div className="input-with-preview">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
          />
          {image && (
            <div className="image-preview">
              <img src={image} alt="preview" />
            </div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
