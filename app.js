import namespaceRoutes from './routes/namespaceRoute.js'

import express from 'express'

const app = express();

app.use("/api/v1/namespace",namespaceRoutes)

export default app;
