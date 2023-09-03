import io from "socket.io-client";

const socket = io(); // Replace with your server URL

const socketService = {
  connect: () => {
    socket.connect();
  },
  disconnect: () => {
    socket.disconnect();
  },
  on: (event, callback) => {
    socket.on(event, callback);
  },
  emit: (event, data, groupName) => {
    socket.emit(event, data, groupName);
  },
};

export default socketService;
