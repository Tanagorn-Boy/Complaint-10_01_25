// fetch chat room by matching_id

import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      const results = await connectionPool.query(
        "SELECT * FROM chats WHERE matching_id = $1",
        [id],
      );

      return res.status(200).json(results.rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message:
          "Server could not get chat room data because database connection",
      });
    }
  }
}
