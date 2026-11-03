import { NamespaceModel } from "../models/chatModel.js";
import { UserModel } from "../models/userModel.js";
import path from "path";
import fs from "fs";

export function initConnection(io) {
  io.on("connection", async (socket) => {
    socket.broadcast.emit("newMember", "New member joined to room .");

    const namespaces = await NamespaceModel.find({}).sort({ _id: -1 });
    socket.emit("namespaces.", namespaces);
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
  detectIsTyping(io, socket);
}

export async function detectIsTyping(io, socket) {
  socket.io("isTyping", async (data) => {
    const { userID, roomName, isTyping } = data;
    const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });
    const user = await UserModel.findOne({ _id: userID });

    io.of(namespace.href).in(roomName).emit("isTyping", { isTyping, username: user.username });

    if (!isTyping) {
      await getRoomOnlineUsers(io, namespace.href, roomName);
    }
  });
}

export async function getRoomOnlineUsers(io, href, roomName) {
  const onlineUsers = await io.of(href).in(roomName).allSockets();
  io.of(href).in(roomName).emit("onlineUsersCount", Array.from(onlineUsers).length);
}

export async function getLocation(io, socket) {
  socket.on("newLocation", async (data) => {
    const { roomName, sender, location } = data;
  });

  const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });

  await NamespaceModel.updateOne(
    { _id: namespace._id, "rooms.title": roomName },
    {
      $push: {
        "rooms.$.location": {
          sender,
          x: location.x,
          y: location.y,
        },
      },
    },
  );

  io.of(namespace.href).in(roomName).emit("confirmLocation", data);
}

export async function getMedia(io, socket) {
  socket.on("newMedia", async (data) => {
    const { filename, file, sender, roomName } = data;

    const ext = path.extname(filename);
    const mediaPath = `uploads/${String(Date.now() + ext)}`;

    fs.writeFile(`public/${mediaPath}`, file, async (err) => {
      if (!err) {
        await NamespaceModel.updateOne(
          { _id: namespace._id, "rooms.title": roomName },
          {
            $push: {
              "rooms.$.media": {
                sender,
                path: mediaPath,
              },
            },
          },
        );

        io.of(namespace.href).in(roomName).emit("confirmMedia", data);
      }
    });

    const namespace = await NamespaceModel.findOne({ "rooms.title": roomName });
  });
}

export async function sendPV(io) {
  io.of("/pv").on("connection", (socket) => {
    socket.on("joining", (data) => {
      const { sender, receiver } = data;
      const prevChat = Array.from(socket.rooms);

      socket.leave(prevChat[1]);
      socket.leave(prevChat[2]);

      socket.join(`${sender}-${receiver}`);
      socket.join(`${receiver}-${sender}`);
    });
  });
}
