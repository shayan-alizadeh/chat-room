import { NamespaceModel } from "../models/chatModel";

export function initConnection(io) {
  io.on("connection", async (socket) => {

    socket.broadcast.emit("newMember","New member joined to room .")

    const namespaces = await NamespaceModel.find({}).sort({ _id: -1 });
    socket.emit("namespaces", namespaces);
  });
}

export async function getNamespaceRoom(io) {
    
  const namespaces = await NamespaceModel.find({}).lean();

  namespaces.forEach((namespace) => {
    io.of(namespace.href).on("connection", (socket) => {
      socket.emit("namespaceRoom", namespace.rooms);
    });
  });
}
