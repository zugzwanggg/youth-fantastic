import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRouter } from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { postRouter } from "./routes/postRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [`${process.env.FRONTEND_BASE_URL}`],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

const PORT = process.env.BACKEND_PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server successfully running at port ${PORT}`);
});
