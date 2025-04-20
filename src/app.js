const express = require("express");
const router = require("./modules/index.module");
const errorHandler = require("./middlewares/errorHandler.middleware");
const cors = require("cors");

const PORT = 5050;

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Sever started ${PORT}`);
});
