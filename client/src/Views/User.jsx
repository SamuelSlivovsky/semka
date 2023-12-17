import React from "react";

import Chat from "../Chat/Chat.jsx";

function User() {
  return (
    <div>
      <Chat></Chat>
      {/* <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button> */}
    </div>
  );
}

export default User;
