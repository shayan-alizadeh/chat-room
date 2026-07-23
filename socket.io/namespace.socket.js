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
    io.of(namespace.href).on("connection", async (socket) => {
      let mainNamespace = await NamespaceModel.findOne({ _id: namespace._id });

      await getMessage(io, socket);

      socket.emit("namespaceRooms", mainNamespace.rooms);
      // single room
      socket.on("joining", async (newRoom) => {
        const lastRoom = Array.from(socket.rooms)[1];

        mainNamespace = await NamespaceModel.findOne({ _id: namespace._id });

        if (lastRoom) {
          socket.leave(lastRoom);
          await getRoomOnlineUsers(io, namespace.href, lastRoom);
        }
        socket.join(newRoom);
        await getRoomOnlineUsers(io, namespace.href, newRoom);

        const roomInfo = namespace.rooms.find((room) => {
          return room.title === newRoom;
        });
        socket.emit("roomInfo", roomInfo);

        

        socket.on("disconnect", async () => {
          await getRoomOnlineUsers(io, namespace.href, newRoom);
        });
      });

      //multi room
      // const mainNamespace = await NamespaceModel.findOne({_id : namespace._id})
      // socket.emit("namespaceRoom", mainNamespace.rooms);
      // socket.on("joining", async (newRoom) => {
      //   socket.join(newRoom);
      //   await getRoomOnlineUsers(io,mainNamespace.href,newRoom)
      //
      //   const roomInfo = mainNamespace.rooms.find((room) => {
      //     room.title === newRoom;
      //   });
      //   socket.emit("roomInfo", roomInfo);
      //   socket.on("disconnect", async ()=>{
      //     await getRoomOnlineUsers(io,mainNamespace.href,newRoom)
      //   })
      // });
    });
  });
}

export async function getMessage(io, socket) {
  socket.on("newMsg", async (data) => {
    const { message, roomName } = data;
    const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });

    await NamespaceModel.updateOne(
      { _id: namespace._id, "rooms.title": roomName },
      {
        $push: {
          "rooms.$.messages": {
            sender: "57d7a121fa937f710a7d486f",
            message,
          },
        },
      },
    );
    io.of(namespace.href).in(roomName).emit("confirmMsg", data);
  });
}

export async function getRoomOnlineUsers(io, href, roomName) {
  const onlineUsers = await io.of(href).in(roomName).allSockets();
  io.of(href).in(roomName).emit("onlineUsersCount", Array.from(onlineUsers).length);
}
