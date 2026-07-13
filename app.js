import namespaceRoutes from "./routes/namespaceRoute.js";

import express from "express";

const app = express();

//* Body Parser
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

//* Cors Policy

//* Template Engine

app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("TYPE:", req.headers["content-type"]);
  console.log("BODY:", req.body);
  next();
});

//*Routes
app.use("/api/v1/namespace", namespaceRoutes);

export default app;
