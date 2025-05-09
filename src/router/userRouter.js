import express from "express";
import userController from "../controller/userController.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.getUser);
userRouter.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  userController.verifyAndRefreshToken
);

export default userRouter;
