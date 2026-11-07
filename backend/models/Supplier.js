const { sequelize, DataTypes } = require('./db');

const Supplier = sequelize.define('Supplier', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  contact: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'suppliers',
  timestamps: false
});

module.exports = Supplier;