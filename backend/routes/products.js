const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const { optionalAuth } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = express.Router();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all products
router.get('/', optionalAuth, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product
router.post('/', optionalAuth, async (req, res) => {
  try {
    // Validation
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ error: 'Name and Price are required' });
    }
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await Product.update(req.body, { where: { id: req.params.id } });
    const updatedProduct = await Product.findByPk(req.params.id);
    
    // Check for low stock
    if (updatedProduct && updatedProduct.quantity <= updatedProduct.minStock) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'admin@example.com',
        subject: 'Low Stock Alert',
        text: `Product ${updatedProduct.name} is low on stock. Current quantity: ${updatedProduct.quantity}`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
      });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;