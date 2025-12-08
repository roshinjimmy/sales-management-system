const { pool } = require("../utils/db");

exports.getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const region = req.query.region?.split(",");
    const gender = req.query.gender?.split(",");
    const category = req.query.category?.split(",");
    const payment = req.query.payment?.split(",");
    const tags = req.query.tags?.split(",");
    const ageRange = req.query.ageRange;
    const dateRange = req.query.date;
    const search = req.query.search;

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (region?.length) {
      conditions.push(`customer_region = ANY($${paramIndex})`);
      params.push(region);
      paramIndex++;
    }

    if (gender?.length) {
      conditions.push(`gender = ANY($${paramIndex})`);
      params.push(gender);
      paramIndex++;
    }

    if (category?.length) {
      conditions.push(`product_category = ANY($${paramIndex})`);
      params.push(category);
      paramIndex++;
    }

    if (payment?.length) {
      conditions.push(`payment_method = ANY($${paramIndex})`);
      params.push(payment);
      paramIndex++;
    }

    if (tags?.length) {
      conditions.push(`tags ILIKE $${paramIndex}`);
      params.push(`%${tags.join(",")}%`);
      paramIndex++;
    }

    if (ageRange) {
      const [minAge, maxAge] = ageRange.split("-").map(Number);
      conditions.push(`age BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
      params.push(minAge, maxAge);
      paramIndex += 2;
    }

    if (dateRange === "Last 7 Days") {
      conditions.push(`date >= NOW() - INTERVAL '7 days'`);
    }

    if (dateRange === "Last 30 Days") {
      conditions.push(`date >= NOW() - INTERVAL '30 days'`);
    }

    if (dateRange === "This Year") {
      conditions.push(`EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM NOW())`);
    }

    if (search?.trim()) {
      conditions.push(`
        (
          transaction_id ILIKE $${paramIndex} OR
          customer_name ILIKE $${paramIndex} OR
          phone_number ILIKE $${paramIndex} OR
          product_name ILIKE $${paramIndex} OR
          product_category ILIKE $${paramIndex} OR
          tags ILIKE $${paramIndex} OR
          employee_name ILIKE $${paramIndex}
        )
      `);

      params.push(`%${search}%`);
      paramIndex++;
    }

    let sortBy = req.query.sortBy || "id";
    let sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

    const sortableColumns = {
      customer_name: "LOWER(customer_name)",
      date: "date",
      quantity: "quantity::int",
      total_amount: "total_amount::numeric",
      transaction_id: "transaction_id::bigint",
      id: "id",
    };

    const sortColumn = sortableColumns[sortBy] || "id";

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const limitParam = paramIndex++;
    const offsetParam = paramIndex++;

    const dataQuery = `
      SELECT *
      FROM transactions
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;

    params.push(limit, offset);

    const result = await pool.query(dataQuery, params);

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

    const countParams = params.slice(0, params.length - 2);

    const countQuery = `SELECT COUNT(*) FROM transactions ${whereClause}`;
    const totalRows = (await pool.query(countQuery, countParams)).rows[0].count;

    res.json({
      data: mapped,
      totalPages: Math.ceil(totalRows / limit),
    });
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
