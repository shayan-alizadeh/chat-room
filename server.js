import { app } from "./app";
import mongoose from "mongoose";
import "dotenv/config";

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
  app.listen(port, () => {
    console.log(`Server Running on port : ${port}`);
  });
}

async function run() {
  await connectToDB();
  startServer();
}

run();
