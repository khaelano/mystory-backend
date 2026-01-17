import express from "express";
import router from "./routes.js";
import cors from "cors";
import { config } from "./config.js";

const app = express();

app.use(cors({
    origin: "https://mystory.khaelano.dev",
}))

app.use(express.json());
app.use(router);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
});

export default app;
