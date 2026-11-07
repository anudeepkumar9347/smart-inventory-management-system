const express = require('express');
const Category = require('../models/Category');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', optionalAuth, async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add category
router.post('/', optionalAuth, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update category
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await Category.update(req.body, { where: { id: req.params.id } });
    const updated = await Category.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete category
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;