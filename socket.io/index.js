import { getNamespaceRoom, initConnection } from "./namespace.socket";

function socketHandler(io) {
  initConnection(io);
  getNamespaceRoom(io);
}

export default socketHandler;