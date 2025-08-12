// feedbackModel.js

// Import the database pool connection
const pool = require("../database"); // Adjust this path if your pool is located elsewhere

async function insertFeedback(name, email, message) {
  try {
    const sql = `INSERT INTO feedback (name, email, message) VALUES ($1, $2, $3)`;
    await pool.query(sql, [name, email, message]);
    return { success: true };
  } catch (error) {
    console.error("DB Error:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { insertFeedback };
