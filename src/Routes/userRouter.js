import express from "express";
import { GetCurrentUser, GetUserById } from "../Controllers/UserController.js";

const userRouter = express.Router();

userRouter.get('/:id',GetUserById);
userRouter.get('/', GetCurrentUser);

export default userRouter;