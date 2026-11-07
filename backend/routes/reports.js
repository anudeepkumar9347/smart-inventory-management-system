const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get inventory report
router.get('/inventory', optionalAuth, async (req, res) => {
  try {
    const products = await Product.findAll();
    const lowStock = products.filter(p => p.quantity <= p.minStock);
    const outOfStock = products.filter(p => p.quantity === 0);
    res.json({ total: products.length, lowStock, outOfStock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get sales report
router.get('/sales', optionalAuth, async (req, res) => {
  try {
    const sales = await Order.findAll({ where: { type: 'sale' } });
    const totalSales = sales.reduce((sum, order) => sum + order.total, 0);
    res.json({ sales, totalSales });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;