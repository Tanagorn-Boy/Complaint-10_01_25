// fetch chat room by user_master_id and user_other_id

import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { userMasterId, userOtherId } = req.query;

      const sqlQuery = `
        SELECT *
        FROM chats 
        WHERE 
        (user_master = $1 AND user_other = $2) 
        OR 
        (user_master = $2 AND user_other = $1)
        `;

      const results = await connectionPool.query(sqlQuery, [
        userMasterId,
        userOtherId,
      ]);

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
