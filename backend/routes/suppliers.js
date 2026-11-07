const express = require('express');
const Supplier = require('../models/Supplier');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all suppliers
router.get('/', optionalAuth, async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add supplier
router.post('/', optionalAuth, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update supplier
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    await Supplier.update(req.body, { where: { id: req.params.id } });
    const updated = await Supplier.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete supplier
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    await Supplier.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;