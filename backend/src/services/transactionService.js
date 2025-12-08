import { pool } from "../utils/db.js";

export async function fetchTransactions() {
  const result = await pool.query(`SELECT * FROM transactions LIMIT 100`);
  return result.rows;
}
