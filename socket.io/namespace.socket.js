import { NamespaceModel } from "../models/chatModel";

export function initConnection(io) {
  io.on("connection", async (socket) => {
    socket.broadcast.emit("newMember", "New member joined to room .");

    const namespaces = await NamespaceModel.find({}).sort({ _id: -1 });
    socket.emit("namespaces", namespaces);
  });
}

export async function getNamespaceRoom(io) {
  const namespaces = await NamespaceModel.find({}).lean();

  namespaces.forEach((namespace) => {
    io.of(namespace.href).on("connection", (socket) => {
      //single room - support chat
      // socket.on("joining",asyn (newRoom) => {
      //   const lastRoom = Array.from(socket.rooms)[1];
      //   if(lastRoom){
      //     socket.leave(lastRoom)
      //   }
      //   socket.join(newRoom)

      //   const roomInfo = namespace.rooms.find((room) => {
      //     room.title === newRoom;
      //   });
      //   socket.emit("roomInfo", roomInfo);
      // })

      //multi room - chat room
      const mainNamespace = await NamespaceModel.findOne({_id : namespace._id})
      socket.emit("namespaceRoom", mainNamespace.rooms);
      socket.on("joining", async (newRoom) => {
        socket.join(newRoom);

        const roomInfo = mainNamespace.rooms.find((room) => {
          room.title === newRoom;
        });
        socket.emit("roomInfo", roomInfo);
      });
    });
  });

  export async function getOnlineUsersRoom(io,href,rommName){
    const onlineUsers = await io.of(href).in(rommName).allSockets()
    io.of(href).in(rommName).emit("onlineUsersCount", Array.from(onlineUsers).length)
  }
}
