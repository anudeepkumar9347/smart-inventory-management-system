const { sequelize, DataTypes } = require('./db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM('purchase', 'sale'), allowNull: false },
  products: { type: DataTypes.JSONB, allowNull: false },
  total: { type: DataTypes.FLOAT, allowNull: false },
  supplierId: { type: DataTypes.INTEGER, allowNull: true },
  customer: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('pending', 'completed', 'cancelled'), defaultValue: 'pending' },
  createdById: { type: DataTypes.INTEGER },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'orders',
  timestamps: false
});

module.exports = Order;