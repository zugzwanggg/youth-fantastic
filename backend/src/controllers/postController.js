import { db } from "../database/db.js";

import cloudinary from "../utils/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const { id } = req.user;

    console.log(req);

    const {
      category_id,
      product_title,
      product_description,
      product_price,
      unit,
      moq,
    } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No image provided",
      });
    }

    await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "post_image",
      },
      async (err, res) => {
        if (err)
          return res?.status(500).json({ error: "Cloudinary upload failed" });
        await db.query(
          `INSERT INTO products (supplier_id, category_id, name, description, image, price, unit, moq) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            id,
            category_id,
            product_title,
            product_description,
            res?.secure_url,
            product_price,
            unit,
            moq,
          ]
        );
      }
    );

    res.status(200).send({
      message: "Product created succesfully",
    });
  } catch (error) {
    console.log(`Error occured at createProduct(): ${error}`);
    res.status(500).send(error);
  }
};

export const createPool = async (req, res) => {
  try {
    const { id } = req.user;
  } catch (error) {
    console.log(`Error occured at createPost(): ${error}`);
    res.status(500).send(error);
  }
};
