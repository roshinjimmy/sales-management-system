const { pool } = require("../utils/db");

exports.getTransactions = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions LIMIT 100");
    res.json(result.rows);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTransactionStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        SUM(quantity) AS total_units,
        SUM(total_amount) AS total_amount,
        SUM(final_amount) AS total_final
      FROM transactions
    `);

    res.json(stats.rows[0]);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
