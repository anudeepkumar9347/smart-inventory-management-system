const { sequelize } = require('./models/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
const Order = require('./models/Order');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Tables recreated');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.bulkCreate([
      { name: 'Admin User', email: 'admin@inventory.com', password: hashedPassword, role: 'admin' },
      { name: 'John Manager', email: 'john@inventory.com', password: hashedPassword, role: 'manager' },
      { name: 'Sarah Employee', email: 'sarah@inventory.com', password: hashedPassword, role: 'employee' },
      { name: 'Mike Employee', email: 'mike@inventory.com', password: hashedPassword, role: 'employee' }
    ]);
    console.log('✓ Users created');

    // Create Categories
    const categories = await Category.bulkCreate([
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', description: 'Apparel and fashion items' },
      { name: 'Food & Beverages', description: 'Consumable food items and drinks' },
      { name: 'Office Supplies', description: 'Stationery and office equipment' },
      { name: 'Home & Garden', description: 'Home decor and gardening supplies' },
      { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
      { name: 'Health & Beauty', description: 'Healthcare and beauty products' },
      { name: 'Toys & Games', description: 'Children toys and board games' }
    ]);
    console.log('✓ Categories created');

    // Create Suppliers
    const suppliers = await Supplier.bulkCreate([
      { name: 'TechWorld Distributors', contact: 'James Wilson', email: 'james@techworld.com', phone: '+1-555-0101', address: '123 Tech Park, Silicon Valley, CA 94025' },
      { name: 'Fashion Hub Ltd', contact: 'Emily Chen', email: 'emily@fashionhub.com', phone: '+1-555-0102', address: '456 Fashion Ave, New York, NY 10001' },
      { name: 'Fresh Foods Co', contact: 'Robert Brown', email: 'robert@freshfoods.com', phone: '+1-555-0103', address: '789 Farm Road, Austin, TX 78701' },
      { name: 'Office Essentials Inc', contact: 'Lisa Martinez', email: 'lisa@officeessentials.com', phone: '+1-555-0104', address: '321 Business Blvd, Chicago, IL 60601' },
      { name: 'Global Imports LLC', contact: 'David Kim', email: 'david@globalimports.com', phone: '+1-555-0105', address: '654 Harbor Drive, Los Angeles, CA 90001' },
      { name: 'SportZone Wholesale', contact: 'Amanda Thompson', email: 'amanda@sportzone.com', phone: '+1-555-0106', address: '987 Athletic Way, Denver, CO 80201' }
    ]);
    console.log('✓ Suppliers created');

    // Create Products
    const products = await Product.bulkCreate([
      // Electronics (categoryId: 1, supplierId: 1)
      { name: 'Wireless Bluetooth Headphones', description: 'Premium noise-canceling headphones with 30hr battery', categoryId: 1, supplierId: 1, sku: 'ELEC-001', barcode: '1234567890001', quantity: 150, minStock: 20, maxStock: 300, price: 89.99, cost: 45.00, location: 'Aisle A-1' },
      { name: 'USB-C Charging Cable', description: 'Fast charging cable, 6ft length', categoryId: 1, supplierId: 1, sku: 'ELEC-002', barcode: '1234567890002', quantity: 500, minStock: 100, maxStock: 1000, price: 12.99, cost: 3.50, location: 'Aisle A-2' },
      { name: 'Portable Power Bank 20000mAh', description: 'High capacity portable charger', categoryId: 1, supplierId: 1, sku: 'ELEC-003', barcode: '1234567890003', quantity: 75, minStock: 15, maxStock: 200, price: 49.99, cost: 22.00, location: 'Aisle A-1' },
      { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with USB receiver', categoryId: 1, supplierId: 1, sku: 'ELEC-004', barcode: '1234567890004', quantity: 200, minStock: 30, maxStock: 400, price: 24.99, cost: 10.00, location: 'Aisle A-3' },
      { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard', categoryId: 1, supplierId: 1, sku: 'ELEC-005', barcode: '1234567890005', quantity: 8, minStock: 10, maxStock: 100, price: 79.99, cost: 35.00, location: 'Aisle A-3' },
      { name: 'Webcam HD 1080p', description: 'Full HD webcam with built-in microphone', categoryId: 1, supplierId: 1, sku: 'ELEC-006', barcode: '1234567890006', quantity: 45, minStock: 10, maxStock: 150, price: 59.99, cost: 28.00, location: 'Aisle A-4' },

      // Clothing (categoryId: 2, supplierId: 2)
      { name: 'Cotton T-Shirt (Black)', description: '100% cotton, comfortable fit', categoryId: 2, supplierId: 2, sku: 'CLTH-001', barcode: '1234567890007', quantity: 300, minStock: 50, maxStock: 600, price: 19.99, cost: 6.00, location: 'Aisle B-1' },
      { name: 'Denim Jeans (Blue)', description: 'Classic fit denim jeans', categoryId: 2, supplierId: 2, sku: 'CLTH-002', barcode: '1234567890008', quantity: 180, minStock: 30, maxStock: 400, price: 49.99, cost: 18.00, location: 'Aisle B-2' },
      { name: 'Hoodie (Grey)', description: 'Warm fleece hoodie with front pocket', categoryId: 2, supplierId: 2, sku: 'CLTH-003', barcode: '1234567890009', quantity: 5, minStock: 20, maxStock: 200, price: 39.99, cost: 15.00, location: 'Aisle B-1' },
      { name: 'Sports Shorts', description: 'Breathable athletic shorts', categoryId: 2, supplierId: 2, sku: 'CLTH-004', barcode: '1234567890010', quantity: 250, minStock: 40, maxStock: 500, price: 24.99, cost: 8.00, location: 'Aisle B-3' },

      // Food & Beverages (categoryId: 3, supplierId: 3)
      { name: 'Organic Green Tea (50 bags)', description: 'Premium organic green tea', categoryId: 3, supplierId: 3, sku: 'FOOD-001', barcode: '1234567890011', quantity: 120, minStock: 25, maxStock: 300, price: 14.99, cost: 5.50, location: 'Aisle C-1', expiryDate: '2027-06-15' },
      { name: 'Protein Bars (12 pack)', description: 'High protein snack bars', categoryId: 3, supplierId: 3, sku: 'FOOD-002', barcode: '1234567890012', quantity: 80, minStock: 20, maxStock: 200, price: 29.99, cost: 12.00, location: 'Aisle C-2', expiryDate: '2026-12-01' },
      { name: 'Coffee Beans (1kg)', description: 'Premium Arabica coffee beans', categoryId: 3, supplierId: 3, sku: 'FOOD-003', barcode: '1234567890013', quantity: 60, minStock: 15, maxStock: 150, price: 24.99, cost: 10.00, location: 'Aisle C-1', expiryDate: '2027-03-20' },
      { name: 'Honey (500g)', description: 'Pure natural honey', categoryId: 3, supplierId: 3, sku: 'FOOD-004', barcode: '1234567890014', quantity: 3, minStock: 10, maxStock: 100, price: 12.99, cost: 5.00, location: 'Aisle C-3', expiryDate: '2028-01-15' },

      // Office Supplies (categoryId: 4, supplierId: 4)
      { name: 'A4 Copy Paper (500 sheets)', description: 'White multipurpose paper', categoryId: 4, supplierId: 4, sku: 'OFFC-001', barcode: '1234567890015', quantity: 400, minStock: 100, maxStock: 800, price: 8.99, cost: 3.50, location: 'Aisle D-1' },
      { name: 'Ballpoint Pens (10 pack)', description: 'Blue ink ballpoint pens', categoryId: 4, supplierId: 4, sku: 'OFFC-002', barcode: '1234567890016', quantity: 350, minStock: 50, maxStock: 600, price: 5.99, cost: 1.50, location: 'Aisle D-2' },
      { name: 'Sticky Notes (5 pack)', description: 'Assorted color sticky notes', categoryId: 4, supplierId: 4, sku: 'OFFC-003', barcode: '1234567890017', quantity: 200, minStock: 40, maxStock: 400, price: 7.99, cost: 2.50, location: 'Aisle D-2' },
      { name: 'Desk Organizer', description: 'Multi-compartment desk organizer', categoryId: 4, supplierId: 4, sku: 'OFFC-004', barcode: '1234567890018', quantity: 7, minStock: 15, maxStock: 100, price: 19.99, cost: 8.00, location: 'Aisle D-3' },

      // Home & Garden (categoryId: 5, supplierId: 5)
      { name: 'LED Desk Lamp', description: 'Adjustable brightness desk lamp', categoryId: 5, supplierId: 5, sku: 'HOME-001', barcode: '1234567890019', quantity: 90, minStock: 20, maxStock: 200, price: 34.99, cost: 14.00, location: 'Aisle E-1' },
      { name: 'Indoor Plant Pot Set', description: 'Set of 3 ceramic plant pots', categoryId: 5, supplierId: 5, sku: 'HOME-002', barcode: '1234567890020', quantity: 55, minStock: 10, maxStock: 120, price: 29.99, cost: 11.00, location: 'Aisle E-2' },
      { name: 'Scented Candles (3 pack)', description: 'Lavender scented candles', categoryId: 5, supplierId: 5, sku: 'HOME-003', barcode: '1234567890021', quantity: 140, minStock: 30, maxStock: 300, price: 18.99, cost: 6.00, location: 'Aisle E-3' },

      // Sports & Outdoors (categoryId: 6, supplierId: 6)
      { name: 'Yoga Mat', description: 'Non-slip exercise yoga mat', categoryId: 6, supplierId: 6, sku: 'SPRT-001', barcode: '1234567890022', quantity: 85, minStock: 15, maxStock: 200, price: 29.99, cost: 12.00, location: 'Aisle F-1' },
      { name: 'Resistance Bands Set', description: '5 resistance levels band set', categoryId: 6, supplierId: 6, sku: 'SPRT-002', barcode: '1234567890023', quantity: 120, minStock: 25, maxStock: 250, price: 19.99, cost: 7.00, location: 'Aisle F-2' },
      { name: 'Water Bottle (1L)', description: 'Stainless steel insulated bottle', categoryId: 6, supplierId: 6, sku: 'SPRT-003', barcode: '1234567890024', quantity: 4, minStock: 20, maxStock: 200, price: 24.99, cost: 9.00, location: 'Aisle F-1' },
      { name: 'Jump Rope', description: 'Adjustable speed jump rope', categoryId: 6, supplierId: 6, sku: 'SPRT-004', barcode: '1234567890025', quantity: 95, minStock: 20, maxStock: 180, price: 12.99, cost: 4.00, location: 'Aisle F-3' },

      // Health & Beauty (categoryId: 7, supplierId: 5)
      { name: 'Hand Sanitizer (500ml)', description: 'Antibacterial hand sanitizer', categoryId: 7, supplierId: 5, sku: 'HLTH-001', barcode: '1234567890026', quantity: 280, minStock: 50, maxStock: 500, price: 9.99, cost: 3.00, location: 'Aisle G-1' },
      { name: 'Vitamin C Supplements (60 tablets)', description: 'Daily vitamin C tablets', categoryId: 7, supplierId: 5, sku: 'HLTH-002', barcode: '1234567890027', quantity: 150, minStock: 30, maxStock: 300, price: 14.99, cost: 5.50, location: 'Aisle G-2', expiryDate: '2027-09-30' },
      { name: 'First Aid Kit', description: 'Complete home first aid kit', categoryId: 7, supplierId: 5, sku: 'HLTH-003', barcode: '1234567890028', quantity: 40, minStock: 10, maxStock: 100, price: 34.99, cost: 15.00, location: 'Aisle G-3' },

      // Toys & Games (categoryId: 8, supplierId: 5)
      { name: 'Building Blocks Set', description: '500 piece building blocks', categoryId: 8, supplierId: 5, sku: 'TOYS-001', barcode: '1234567890029', quantity: 65, minStock: 15, maxStock: 150, price: 39.99, cost: 16.00, location: 'Aisle H-1' },
      { name: 'Board Game - Strategy', description: 'Family strategy board game', categoryId: 8, supplierId: 5, sku: 'TOYS-002', barcode: '1234567890030', quantity: 9, minStock: 10, maxStock: 80, price: 29.99, cost: 12.00, location: 'Aisle H-2' }
    ]);
    console.log('✓ Products created');

    // Create Orders (mix of purchase and sale orders with different statuses)
    const orders = await Order.bulkCreate([
      // Purchase Orders
      {
        type: 'purchase',
        products: JSON.stringify([
          { productId: 1, name: 'Wireless Bluetooth Headphones', quantity: 50, price: 45.00 },
          { productId: 2, name: 'USB-C Charging Cable', quantity: 200, price: 3.50 }
        ]),
        total: 2950.00,
        supplierId: 1,
        status: 'completed',
        createdById: 1,
        createdAt: new Date('2026-02-01')
      },
      {
        type: 'purchase',
        products: JSON.stringify([
          { productId: 7, name: 'Cotton T-Shirt (Black)', quantity: 100, price: 6.00 },
          { productId: 8, name: 'Denim Jeans (Blue)', quantity: 50, price: 18.00 }
        ]),
        total: 1500.00,
        supplierId: 2,
        status: 'completed',
        createdById: 2,
        createdAt: new Date('2026-02-05')
      },
      {
        type: 'purchase',
        products: JSON.stringify([
          { productId: 15, name: 'A4 Copy Paper (500 sheets)', quantity: 100, price: 3.50 },
          { productId: 16, name: 'Ballpoint Pens (10 pack)', quantity: 150, price: 1.50 }
        ]),
        total: 575.00,
        supplierId: 4,
        status: 'pending',
        createdById: 2,
        createdAt: new Date('2026-02-20')
      },

      // Sale Orders
      {
        type: 'sale',
        products: JSON.stringify([
          { productId: 1, name: 'Wireless Bluetooth Headphones', quantity: 5, price: 89.99 },
          { productId: 4, name: 'Wireless Mouse', quantity: 3, price: 24.99 }
        ]),
        total: 524.92,
        customer: 'ABC Corporation',
        status: 'completed',
        createdById: 3,
        createdAt: new Date('2026-02-10')
      },
      {
        type: 'sale',
        products: JSON.stringify([
          { productId: 7, name: 'Cotton T-Shirt (Black)', quantity: 20, price: 19.99 },
          { productId: 10, name: 'Sports Shorts', quantity: 15, price: 24.99 }
        ]),
        total: 774.65,
        customer: 'Sports Direct Store',
        status: 'completed',
        createdById: 3,
        createdAt: new Date('2026-02-12')
      },
      {
        type: 'sale',
        products: JSON.stringify([
          { productId: 19, name: 'LED Desk Lamp', quantity: 10, price: 34.99 },
          { productId: 21, name: 'Scented Candles (3 pack)', quantity: 25, price: 18.99 }
        ]),
        total: 822.65,
        customer: 'Home Decor Plus',
        status: 'completed',
        createdById: 4,
        createdAt: new Date('2026-02-15')
      },
      {
        type: 'sale',
        products: JSON.stringify([
          { productId: 22, name: 'Yoga Mat', quantity: 8, price: 29.99 },
          { productId: 23, name: 'Resistance Bands Set', quantity: 12, price: 19.99 }
        ]),
        total: 479.80,
        customer: 'FitLife Gym',
        status: 'pending',
        createdById: 3,
        createdAt: new Date('2026-02-18')
      },
      {
        type: 'sale',
        products: JSON.stringify([
          { productId: 11, name: 'Organic Green Tea (50 bags)', quantity: 30, price: 14.99 },
          { productId: 13, name: 'Coffee Beans (1kg)', quantity: 20, price: 24.99 }
        ]),
        total: 949.50,
        customer: 'Café Delight',
        status: 'pending',
        createdById: 4,
        createdAt: new Date('2026-02-21')
      },
      {
        type: 'sale',
        products: JSON.stringify([
          { productId: 29, name: 'Building Blocks Set', quantity: 15, price: 39.99 },
          { productId: 30, name: 'Board Game - Strategy', quantity: 10, price: 29.99 }
        ]),
        total: 899.75,
        customer: 'ToyWorld Retail',
        status: 'cancelled',
        createdById: 3,
        createdAt: new Date('2026-02-08')
      },
      {
        type: 'purchase',
        products: JSON.stringify([
          { productId: 5, name: 'Mechanical Keyboard', quantity: 30, price: 35.00 },
          { productId: 6, name: 'Webcam HD 1080p', quantity: 25, price: 28.00 }
        ]),
        total: 1750.00,
        supplierId: 1,
        status: 'pending',
        createdById: 1,
        createdAt: new Date('2026-02-22')
      }
    ]);
    console.log('✓ Orders created');

    console.log('\n========================================');
    console.log('🎉 Database seeded successfully!');
    console.log('========================================');
    console.log('\nSample Login Credentials:');
    console.log('----------------------------------------');
    console.log('Admin:    admin@inventory.com / password123');
    console.log('Manager:  john@inventory.com / password123');
    console.log('Employee: sarah@inventory.com / password123');
    console.log('----------------------------------------');
    console.log('\nData Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Suppliers: ${suppliers.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Orders: ${orders.length}`);
    console.log('----------------------------------------');
    console.log('\nNote: Some products have LOW STOCK for demo:');
    console.log('- Mechanical Keyboard (8 units, min: 10)');
    console.log('- Hoodie Grey (5 units, min: 20)');
    console.log('- Honey (3 units, min: 10)');
    console.log('- Desk Organizer (7 units, min: 15)');
    console.log('- Water Bottle (4 units, min: 20)');
    console.log('- Board Game (9 units, min: 10)');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
