import namespaceRoutes from "./routes/namespaceRoute.js";

import express from "express";

const app = express();

//* Body Parser
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

//* Cors Policy

//* Template Engine

//*Routes
app.use("/api/v1/namespace", namespaceRoutes);

export default app;
