const { sequelize, DataTypes } = require('./db');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
  supplierId: { type: DataTypes.INTEGER, allowNull: true },
  sku: { type: DataTypes.STRING, unique: true },
  barcode: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  minStock: { type: DataTypes.INTEGER, defaultValue: 10 },
  maxStock: { type: DataTypes.INTEGER },
  price: { type: DataTypes.FLOAT, allowNull: false },
  cost: { type: DataTypes.FLOAT },
  image: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  expiryDate: { type: DataTypes.DATE },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = Product;