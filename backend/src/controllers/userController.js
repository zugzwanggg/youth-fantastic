import { db } from "../database/db.js";

export const getUserData = async (req, res) => {
  try {
    const { uuid } = req.params;

    const checkUser = await db.query("SELECT * FROM users WHERE uuid=$1", [
      uuid,
    ]);

    if (checkUser.rows.length <= 0) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    return res.status(200).send(checkUser.rows[0]);
  } catch (error) {
    console.log(`Error occured at getUserData(): ${error}`);
    return res.status(500).send(error);
  }
};
