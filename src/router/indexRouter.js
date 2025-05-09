import express from "express";
import articleRouter from "../modules/article.module.js";
import userRouter from "./userRouter.js";

const router = express.Router();

router.use("", userRouter);
router.use("/article", articleRouter);

export default router;
