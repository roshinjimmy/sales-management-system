const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getTransactionStats
} = require("../controllers/transactionController");

router.get("/", getTransactions);
router.get("/stats", getTransactionStats);

module.exports = router;
