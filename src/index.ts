import express from "express";
import router from "./routes.js";
import { config } from "./config.js";

const app = express();
app.use(express.json());
app.use(router);

app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port} [${config.nodeEnv}]`);
});