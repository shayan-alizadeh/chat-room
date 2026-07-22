import namespaceRoutes from "./routes/namespaceRoute.js";
import userRoutes from "./routes/userRoute.js";

import express from "express";

import path from "path";
import cors from "cors";

const app = express();

//* Body Parser
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

//* Cors Policy
app.use(cors());
//* Template Engine

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

//*Routes
app.use("/api/v1/namespace", namespaceRoutes);
app.use("/api/v1/auth", userRoutes);

export default app;
