import React, { useEffect, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import socketService from "../service/socketService.js";
import GetUserData from "../Auth/GetUserData.jsx";
import "../styles/chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [mySocketId, setMySocketId] = useState("");
  const userDataHelper = GetUserData(localStorage.getItem("hospit-user"));

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
      socketService.emit("sendImage", image, {
        userId: userDataHelper.UserInfo.userid,
      });
      setImage(null);
    } else if (newMessage.trim() !== "") {
      // Send regular text message
      socketService.emit("sendMessage", newMessage, {
        userId: userDataHelper.UserInfo.userid,
      });
    }

    setNewMessage("");
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.files[0];
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
    return sender === userDataHelper.UserInfo.userid;
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-container  ${message.sender} `}>
            {isCurrentUser(message.sender) ? (
              <>
                <div
                  className={`message ${
                    isCurrentUser(message.sender) ? "current-user" : ""
                  }`}
                >
                  {message.type === "image" ? (
                    <img
                      src={message.content}
                      alt="sent"
                      onClick={() => openImageInNewTab(message.content)}
                      className="image-preview"
                    />
                  ) : (
                    <span style={{ marginLeft: "auto" }}>
                      {message.content}
                    </span>
                  )}{" "}
                </div>
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
                <div
                  className={`message ${
                    isCurrentUser(message.sender) ? "current-user" : ""
                  }`}
                >
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
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <div className="input-with-preview">
          <InputTextarea
            style={{
              width: "100%",
              marginBottom: "10px",
              resize: "none",
            }}
            rows={5}
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
          />
        </div>
        <FileUpload
          customUpload
          accept="image/*"
          maxFileSize={1000000}
          onSelect={handleImageChange}
          style={{ marginBottom: "10px" }}
          emptyTemplate={
            <p className="m-0">Drag and drop files to here to upload.</p>
          }
        />

        <Button
          onClick={sendMessage}
          style={{ width: "100px" }}
          label="Send"
        ></Button>
      </div>
    </div>
  );
};

export default Chat;
