import express from "express";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();
const port = 3002;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

routes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
