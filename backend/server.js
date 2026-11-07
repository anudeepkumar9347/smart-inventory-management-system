const express = require('express');
const { sequelize } = require('./models/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL via Sequelize
sequelize.authenticate()
  .then(() => console.log('Postgres connected'))
  .catch(err => console.log('Postgres connection error:', err));

// Sync models (creates tables if they don't exist)
sequelize.sync()
  .then(() => console.log('Sequelize models synced'))
  .catch(err => console.log('Sequelize sync error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reports', require('./routes/reports'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));