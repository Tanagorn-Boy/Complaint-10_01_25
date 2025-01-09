import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/adminFirebase";
import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { masterUserId, otherUserId } = req.body;

  if (!masterUserId || !otherUserId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const chatRoomId = uuidv4();

    // SQL: Add data in matching table
    const matchingQuery = `
      INSERT INTO matching (user_master, user_other, status_match, is_match, date_match, created_date)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING matching_id, created_date;
    `;
    const matchingValue = [masterUserId, otherUserId, "Merry Match", true];

    const matchingResult = await connectionPool.query(
      matchingQuery,
      matchingValue,
    );

    // Retrieve matching_id and created_date from matching table
    const { matching_id, created_date } = matchingResult.rows[0];

    // SQL: Add data in chats table
    const chatsQuery = `
      INSERT INTO chats (matching_id, chat_room_id, user_master, user_other, created_at)
      VALUES ($1, $2, $3, $4, $5);
    `;
    const chatsValue = [
      matching_id,
      chatRoomId,
      masterUserId,
      otherUserId,
      created_date,
    ];

    await connectionPool.query(chatsQuery, chatsValue);

    // NoSQL: Create empty chat room
    const chatRoomRef = db.collection("chat_rooms").doc(chatRoomId);
    await chatRoomRef.set({
      createdAt: created_date,
      messages: [],
    });

    return res
      .status(200)
      .json({ message: "Chat room created successfully", chatRoomId });
  } catch (error) {
    console.error("Error creating match:", error);
    return res.status(500).json({ error: "Failed to create chat room" });
  }
}
