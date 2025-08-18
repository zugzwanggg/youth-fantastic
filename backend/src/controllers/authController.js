import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { db } from "../database/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "best_secret_2025";

export const register = async (req, res) => {
  try {
    const { email, username, password, repPassword } = req.body;

    if (!email || !username || !password || !repPassword) {
      return res.status(400).json({
        message: "Fields cannot be empty!",
      });
    }

    const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        message: "User with this email or username already exists.",
      });
    }

    if (password !== repPassword) {
      return res.status(400).json({
        message: "Passwords are not matching!",
      });
    }

    const genSalt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, genSalt);

    const newUser = await db.query(
      "INSERT INTO users (email, username, password, uuid) VALUES ($1, $2, $3, uuid_generate_v4()) RETURNING id, email, username, created_at",
      [email, username, hashPassword]
    );

    const payload = newUser.rows[0];
    const token = jwt.sign(payload, JWT_SECRET);

    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sevenDays,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
    });

    return res.status(201).send(
      {
        message: "User created successfully",
      },
      payload
    );
  } catch (error) {
    console.log(`Error occured at register(): ${error}`);
    return res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        messsage: "Fields cannot be empty",
      });
    }

    const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkUser.rows.length <= 0) {
      return res.status(401).json({
        message: "Incorrect username/email or password!",
      });
    }

    const checkUserPassword = await bcryptjs.compare(
      password,
      checkUser.rows[0].password
    );

    if (!checkUserPassword) {
      return res.status(401).json({
        message: "Incorrect username/email or password!",
      });
    }

    const payload = checkUser.rows[0];
    const token = jwt.sign(payload, JWT_SECRET);

    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sevenDays,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
    });

    return res.status(200).send({
      message: "Logged in successfully",
    });
  } catch (error) {
    console.log(`Error occured at login(): ${error}`);
    return res.status(500).send(error);
  }
};

export const isLogged = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({
        isLogged: false,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    return res.status(200).send({
      user: decoded,
      isLogged: true,
    });
  } catch (error) {
    console.log("Error occured at isLogged():", error);
    return res.status(500).send(error);
  }
};

export const logout = async (req, res) => {
  return res
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expiresIn: new Date(0),
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
    })
    .send({
      message: "Logged out successfully",
    });
};
