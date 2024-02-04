import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import socketService from "../service/socketService.js";
import GetUserData from "../Auth/GetUserData.jsx";
import "../styles/chat.css";
import { Dialog } from "primereact/dialog";
import AddUserForm from "../Forms/AddUserForm.jsx";

const Messages = (props) => {
  const messagesEndRef = useRef([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [mySocketId, setMySocketId] = useState("");
  const userDataHelper = GetUserData(localStorage.getItem("hospit-user"));
  const [show, setShow] = useState(false);
  const [typers, setTypers] = useState([]);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    };
    fetch(`/chat/spravy/${props.group}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        messagesEndRef.current = messagesEndRef.current.slice(0, data.length);
        setMessages(
          data.map((item) => {
            return {
              content: item.SPRAVA,
              date: item.DATUM,
              sender: Number(item.USERID),
              type: "text",
              fullName: item.MENO + " " + item.PRIEZVISKO,
              unformatedDate: new Date(item.UNFORMATED_DATE),
              unreadId: item.unreadId,
              unreadUserId: item.unreadUserId,
              messageId: item.ID_SPRAVY,
            };
          })
        );
      });
  }, [props.group]);

  useEffect(() => {
    if (messagesEndRef.current) {
      const unreadIndex = messages.findIndex(
        (message) =>
          message.unreadId &&
          message.unreadUserId == userDataHelper.UserInfo.userid
      );
      if (unreadIndex >= 0)
        messagesEndRef.current[unreadIndex]?.scrollIntoView();
      else messagesEndRef.current[messages.length - 1]?.scrollIntoView();
    }
  }, [messages]);

  useEffect(() => {
    socketService.connect();
    socketService.on("yourSocketId", (socketId) => {
      setMySocketId(socketId);
    });

    socketService.on("newMessage", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, new: true },
      ]);
      setTypers(typers.filter((item) => item.id !== message.sender));
      if (message.sender !== userDataHelper.UserInfo.userid) {
        const token = localStorage.getItem("hospit-user");
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            userid: userDataHelper.UserInfo.userid,
            id_skupiny: props.group,
          }),
        };
        fetch("/chat/updateRead", requestOptions);
      }
    });

    socketService.on("newImage", (imageMessage) => {
      setMessages((prevMessages) => [...prevMessages, imageMessage]);
    });

    socketService.on("isTyping", (data) => {
      if (data.id !== userDataHelper.UserInfo.userid) {
        setTypers((prevTypers) => {
          const existingIndex = prevTypers.findIndex(
            (typer) => typer.id === data.id
          );

          if (existingIndex !== -1) {
            const newTypers = [...prevTypers];
            newTypers[existingIndex] = data;
            return newTypers;
          } else {
            return [...prevTypers, data];
          }
        });
      }
    });

    const container = document.getElementById("chat-messages");
    const handleScroll = () => {
      const scrolledDown =
        container.scrollTop + container.clientHeight >= container.scrollHeight;
      if (scrolledDown) {
        const token = localStorage.getItem("hospit-user");
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            userid: userDataHelper.UserInfo.userid,
            id_skupiny: props.group,
          }),
        };
        fetch("/chat/updateRead", requestOptions);
      }
    };

    if (container) container.addEventListener("scroll", handleScroll);

    return () => {
      socketService.disconnect();
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const sendMessage = () => {
    if (image) {
      socketService.emit("sendImage", image, {
        userId: userDataHelper.UserInfo.userid,
      });
      setImage(null);
    } else if (newMessage.trim() !== "") {
      socketService.emit("sendMessage", newMessage, {
        userId: userDataHelper.UserInfo.userid,
      });

      insertMessage(newMessage);
    }

    setNewMessage("");
  };

  const insertMessage = async (message) => {
    const token = localStorage.getItem("hospit-user");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userid: userDataHelper.UserInfo.userid,
        id_skupiny: props.group,
        sprava: message,
        datum: new Date().toLocaleString("en-GB").replace(",", ""),
      }),
    };
    await fetch("/chat/add", requestOptions);
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    socketService.emit("typing", {
      userId: userDataHelper.UserInfo.userid,
      isEmpty: e.target.value === "",
    });
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

  const addUser = () => {
    setShow(true);
  };

  const addChatUser = (user) => {
    const token = localStorage.getItem("hospit-user");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({ userid: user.CISLO_ZAM, id_skupiny: props.group }),
    };
    fetch("/chat/insertUser", requestOptions).then(() => setShow(false));
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {cancelButton}
      </div>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <div>
        <div className="chat-messages" id="chat-messages">
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            return (
              <div
                ref={(el) => (messagesEndRef.current[index] = el)}
                key={message.messageId}
                unredkey={message.unreadId}
                className={`message-container  ${message.sender} `}
              >
                {isCurrentUser(message.sender) ? (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      flexDirection: "column",
                      rowGap: "8px",
                    }}
                  >
                    {index === 0 ||
                    (message.new &&
                      (message.unformatedDate - prevMessage.unformatedDate) /
                        (1000 * 60) >
                        5) ||
                    (index > 0 && prevMessage.sender !== message.sender) ||
                    (index > 0 &&
                      prevMessage.sender === message.sender &&
                      (message.unformatedDate - prevMessage.unformatedDate) /
                        (1000 * 60) >
                        5) ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          fontSize: "12px",
                          marginLeft: "auto",
                          marginRight: "16px",
                        }}
                      >
                        {message.new ? "Teraz" : message.date}
                      </div>
                    ) : (
                      ""
                    )}
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
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      flexDirection: "column",
                      rowGap: "8px",
                    }}
                  >
                    {index === 0 ||
                    (index > 0 && prevMessage.sender !== message.sender) ||
                    (index > 0 &&
                      prevMessage.sender === message.sender &&
                      (message.unformatedDate - prevMessage.unformatedDate) /
                        (1000 * 60) >
                        5) ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          fontSize: "0.875rem",
                          alignItems: "center",
                        }}
                      >
                        <b>{message.fullName}</b>
                        <span style={{ fontSize: "12px" }}>{message.date}</span>
                      </div>
                    ) : (
                      ""
                    )}
                    <div style={{ display: "flex", width: "100%" }}>
                      <div
                        className={`avatar`}
                        style={{
                          backgroundColor: "#3498db",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        K
                      </div>
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
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {typers
            .filter((item) => !item.isEmpty)
            .map((item) => {
              return (
                <div key={"typing"} className={`message-container`}>
                  <div
                    className={`avatar`}
                    style={{ backgroundColor: "#3498db" }}
                  ></div>
                  <div className="typing-container">
                    <div class="typing">
                      <div class="dot"></div>
                      <div class="dot"></div>
                      <div class="dot"></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="chat-input">
          <div className="input-with-preview">
            <InputText
              style={{
                width: "100%",
                marginBottom: "10px",
                resize: "none",
              }}
              rows={5}
              onKeyDown={(e) => {
                if (e.code === "Enter") sendMessage();
              }}
              placeholder="Napíš správu..."
              value={newMessage}
              onChange={handleInputChange}
            />
          </div>
          <FileUpload
            customUpload
            accept="image/*"
            chooseLabel="Vložiť"
            cancelLabel="Zrušiť"
            headerTemplate={headerTemplate}
            maxFileSize={1000000}
            onSelect={handleImageChange}
            style={{ marginBottom: "10px" }}
            emptyTemplate={<p className="m-0">Potiahni súbory tu.</p>}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={sendMessage}
              style={{ width: "100px" }}
              label="Odoslať"
            ></Button>
            <Button
              onClick={addUser}
              style={{ width: "fit-content" }}
              label="Pridať použivateľa"
              icon="pi pi-plus"
            ></Button>
          </div>
        </div>
      </div>
      <Dialog
        visible={show}
        onHide={() => setShow(false)}
        style={{ minWidth: "50%" }}
      >
        {" "}
        <AddUserForm onClick={addChatUser} />
      </Dialog>
    </div>
  );
};

export default Messages;
