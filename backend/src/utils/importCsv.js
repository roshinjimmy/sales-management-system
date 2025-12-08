const fs = require("fs");
const csv = require("csv-parser");
const { pool } = require("./db");

async function importCsv() {
  let count = 0;

  console.log("CSV import started...");

  const stream = fs.createReadStream("data/sales.csv").pipe(csv());

  for await (const row of stream) {
    try {
      await pool.query(
        `INSERT INTO transactions (
    transaction_id, date, customer_id, customer_name, phone_number, gender,
    age, customer_region, customer_type, product_id, product_name, brand,
    product_category, tags, quantity, price_per_unit, discount_percentage,
    total_amount, final_amount, payment_method, order_status, delivery_type,
    store_id, store_location, salesperson_id, employee_name
  ) VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, 
    $16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26
  )`,
        [
          row["Transaction ID"],
          row["Date"],
          row["Customer ID"],
          row["Customer Name"],
          row["Phone Number"],
          row["Gender"],
          row["Age"] ? Number(row["Age"]) : null,
          row["Customer Region"],
          row["Customer Type"],
          row["Product ID"],
          row["Product Name"],
          row["Brand"],
          row["Product Category"],
          row["Tags"],
          Number(row["Quantity"]),
          Number(row["Price per Unit"]),
          Number(row["Discount Percentage"]) || 0,
          Number(row["Total Amount"]),
          Number(row["Final Amount"]),
          row["Payment Method"],
          row["Order Status"],
          row["Delivery Type"],
          row["Store ID"],
          row["Store Location"],
          row["Salesperson ID"],
          row["Employee Name"],
        ]
      );

      count++;
      if (count % 1000 === 0) console.log(`Inserted ${count} rows...`);
    } catch (err) {
      console.error("Insert error:", err.message);
    }
  }

  console.log(`Import completed. Total rows: ${count}`);
  process.exit();
}

importCsv();
