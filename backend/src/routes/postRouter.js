import { Router } from "express";
import {
  createPool,
  createProduct,
  editPoolStatus,
  getCategories,
  getPools,
  getProductByProductId,
  getProducts,
  getProductsByCategory,
  getProductsByUserId,
  joinPool,
} from "../controllers/postController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { uploadImage } from "../middleware/uploadImage.js";

export const postRouter = Router();

postRouter.patch("/editpool/:pool_id", checkAuth, editPoolStatus);
postRouter.post(
  "/product_create",
  checkAuth,
  uploadImage.single("image"),
  createProduct
);
postRouter.post("/create_pool", checkAuth, createPool);
postRouter.post("/join_pool", checkAuth, joinPool);
postRouter.get("/getpools", getPools);
postRouter.get("/getcategories", getCategories);
postRouter.get("/getproducts", getProducts);
postRouter.get("/getproducts/:category_id", getProductsByCategory);
postRouter.get("/product/:product_id", getProductByProductId);
postRouter.get("/user_products/:user_id", getProductsByUserId);
