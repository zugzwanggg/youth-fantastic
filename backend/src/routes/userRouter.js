import { Router } from "express";
import { getUserData } from "../controllers/userController.js";

export const userRouter = Router();

userRouter.get("/getdata/:uuid", getUserData);
