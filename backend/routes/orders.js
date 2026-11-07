const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all orders
router.get('/', optionalAuth, async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add order
router.post('/', optionalAuth, async (req, res) => {
  const { type, products, supplier, customer } = req.body;
  
  // Validation
  if (!type || !products || products.length === 0) {
    return res.status(400).json({ error: 'Type and products array are required' });
  }
  if (!customer && !supplier) {
    return res.status(400).json({ error: 'Customer or Supplier is required' });
  }
  
  let total = 0;
  try {
    // Validate and process each product
    const processedProducts = [];
    for (let item of products) {
      if (!item.product || !item.quantity || item.price === undefined) {
        return res.status(400).json({ error: 'Each product must have product ID, quantity, and price' });
      }
      
      const prod = await Product.findByPk(item.product);
      if (!prod) {
        return res.status(404).json({ error: `Product with ID ${item.product} not found` });
      }
      
      if (type === 'sale') {
        if (prod.quantity < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for ${prod.name}. Available: ${prod.quantity}` });
        }
        prod.quantity = prod.quantity - item.quantity;
        total += item.price * item.quantity;
      } else if (type === 'purchase') {
        prod.quantity = prod.quantity + item.quantity;
        total += item.price * item.quantity;
      }
      
      await prod.save();
      processedProducts.push(item);
    }

    const order = await Order.create({
      type,
      products: processedProducts,
      total,
      supplierId: supplier || null,
      customer: customer || null,
      createdById: req.user?.id || null
    });
    
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (!req.body.status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    await Order.update({ status: req.body.status }, { where: { id: req.params.id } });
    const updated = await Order.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete order
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await Order.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;