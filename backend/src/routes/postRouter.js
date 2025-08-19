import { Router } from "express";
import { createPool, createProduct } from "../controllers/postController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { uploadImage } from "../middleware/uploadImage.js";

export const postRouter = Router();

postRouter.post("/product/create", checkAuth, createProduct);
postRouter.post("/create", checkAuth, uploadImage.single("image"), createPool);
