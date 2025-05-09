import express from "express";
import router from "./router/indexRouter.js";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

const PORT = 5050;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Sever started ${PORT}`);
});
