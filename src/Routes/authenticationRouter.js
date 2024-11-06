import express from "express";
import { Login, SignUp } from "../Controllers/AuthenticationController.js";

const AuthRouter = express.Router();

AuthRouter.post('/signUp',SignUp)
AuthRouter.post('/login', Login)

export default AuthRouter;