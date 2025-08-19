import { db } from "../database/db.js";

import cloudinary from "../utils/cloudinary.js";

export const getCategories = async (req, res) => {
  try {
    const dbQuery = await db.query("SELECT * FROM categories");

    return res.status(200).send(dbQuery.rows);
  } catch (error) {
    console.log(`Error occured at getCategories(): ${error}`);
    return res.status(500).send(error);
  }
};

export const getProducts = async (req, res) => {
  try {
    const dbQuery = await db.query("SELECT * FROM products");

    return res.status(200).send(dbQuery.rows);
  } catch (error) {
    console.log(`Error occured at getProducts(): ${error}`);
    return res.status(500).send(error);
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;

    const dbQuery = await db.query(
      "SELECT * FROM products WHERE category_id=$1",
      [category_id]
    );

    return res.status(200).send(dbQuery.rows);
  } catch (error) {
    console.log(`Error occured at getProducts(): ${error}`);
    return res.status(500).send(error);
  }
};

export const getProductByProductId = async (req, res) => {
  try {
    const { product_id } = req.params;

    const dbQuery = await db.query("SELECT * FROM products WHERE id=$1", [
      product_id,
    ]);

    return res.status(200).send(dbQuery.rows[0]);
  } catch (error) {
    console.log(`Error occured at getProductByProductId(): ${error}`);
    return res.status(500).send(error);
  }
};

export const getProductsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    const dbQuery = await db.query(
      "SELECT * FROM products WHERE supplier_id=$1",
      [user_id]
    );

    return res.status(200).send(dbQuery.rows);
  } catch (error) {
    console.log(`Error occured at getProductByProductId(): ${error}`);
    return res.status(500).send(error);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { id } = req.user;

    console.log(req.body);

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

    return res.status(200).send({
      message: "Product created succesfully",
    });
  } catch (error) {
    console.log(`Error occured at createProduct(): ${error}`);
    return res.status(500).send(error);
  }
};

export const createPool = async (req, res) => {
  try {
    const { expires_at, target_qty, product_id } = req.body;

    if (!expires_at || !target_qty || !product_id) {
      return res.status(400).send({
        message: "Fields cannot be empty!",
      });
    }

    const dbQuery = await db.query(
      `INSERT INTO group_buy_pools (product_id, target_qty, expires_at) VALUES ($1, $2, $3)`,
      [product_id, target_qty, expires_at]
    );

    return res.status(201).send({
      message: "Pool created successfully",
    });
  } catch (error) {
    console.log(`Error occured at createPost(): ${error}`);
    return res.status(500).send(error);
  }
};

export const getPools = async (req, res) => {
  try {
    const dbQuery = await db.query("SELECT * FROM group_buy_pools");

    return res.status(200).send(dbQuery.rows);
  } catch (error) {
    console.log(`Error occured at getPools(): ${error}`);
    return res.status(500).send(error);
  }
};

export const editPoolStatus = async (req, res) => {
  try {
    const { pool_id } = req.params;
    const { pool_status } = req.body;

    if (!pool_status) {
      return res.status(400).send({
        message: "Fields cannot be empty!",
      });
    }

    const dbQuery = await db.query(
      "UPDATE group_buy_pools SET status=$1 WHERE id=$2",
      [pool_status, pool_id]
    );

    return res.status(200).send({
      message: "Successfully changed pool status",
    });
  } catch (error) {
    console.log(`Error occured at editPoolStatus(): ${error}`);
    res.status(500).send(error);
  }
};

export const joinPool = async (req, res) => {
  try {
    const { id } = req.user;
    const { pool_id, supplier_id } = req.body;

    if (!pool_id) {
      return res.status(400).send({
        message: "Fields cannot be empty",
      });
    }

    const dbQuery = await db.query(
      `INSERT INTO group_buy_commitments (pool_id, business_id, supplier_id) 
        VALUES ($1, $2, $3)`,
      [pool_id, id, supplier_id]
    );

    return res.status(200).send({
      message: "Successfully joined the pool",
    });
  } catch (error) {
    console.log(`Error occured at joinPool(): ${error}`);
    return res.status(500).send(error);
  }
};

export const createOrder = async (req, res) => {
  try {
    const { commitment_id, product_owner_id, product_id } = req.body;

    if (!commitment_id || !product_owner_id || !product_id) {
      return res.status(400).send({
        message: "Fields cannot be empty",
      });
    }

    const dbQuery = await db.query(
      `INSERT INTO orders (commitment_id, product_owner_id, product_id)
        VALUES ($1, $2, $3)`,
      [commitment_id, product_owner_id, product_id]
    );

    return res.status(200).send({
      message: "Successfully placed an order",
    });
  } catch (error) {
    console.log(`Error occured at createOrder(): ${error}`);
    return res.status(200).send(error);
  }
};
