import namespaceRoutes from "./routes/namespaceRoute.js";

import express from "express";

import path from "path";

const app = express();

//* Body Parser
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

//* Cors Policy

//* Template Engine

//* Static Folder
app.use(express.static(path.join(__dirname,"public")));

//*Routes
app.use("/api/v1/namespace", namespaceRoutes);

export default app;
