import { getNamespaceRoom, initConnection } from "./namespace.socket.js";

function socketHandler(io) {
  initConnection(io);
  getNamespaceRoom(io);
}

export default socketHandler;