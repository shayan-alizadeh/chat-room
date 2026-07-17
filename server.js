import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import "dotenv/config";
import initConnection from "./socket.io/namespace.socket.js";
import socketHandler from "./socket.io/index.js";

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connection : ${mongoose.connection.host}`);
  } catch (err) {
    console.log(`Error Connection to MongoDB : ${err}`);
    process.exit(1);
  }
}

async function startServer() {
  const port = process.env.PORT;
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "*" } });
  socketHandler(io);
  server.listen(port, () => {
    console.log(`Server Running on port : ${port}`);
  });
}

async function run() {
  await connectToDB();
  startServer();
}

run();
