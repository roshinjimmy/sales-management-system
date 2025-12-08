const { pool } = require("../utils/db");

exports.getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM transactions 
       ORDER BY id ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const mapped = result.rows.map((row) => ({
      transactionId: row.transaction_id,
      date: row.date ? row.date.toISOString().split("T")[0] : null,
      customerId: row.customer_id,
      customerName: row.customer_name,
      phone: row.phone_number,
      gender: row.gender,
      age: row.age,
      category: row.product_category,
      quantity: row.quantity,
      amount: row.total_amount,
      region: row.customer_region,
      productId: row.product_id,
      employee: row.employee_name,
    }));

    const totalRes = await pool.query("SELECT COUNT(*) FROM transactions");
    const totalRows = parseInt(totalRes.rows[0].count);
    const totalPages = Math.ceil(totalRows / limit);

    res.json({ data: mapped, totalPages });
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
