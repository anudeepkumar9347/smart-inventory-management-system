# Smart Inventory Management System

A comprehensive web-based inventory management system built with React frontend and Node.js backend, featuring MongoDB for data storage.

## Features

- **User Authentication**: Secure login with JWT tokens and role-based access (Admin, Manager, Employee)
- **Product Management**: Add, edit, delete products with categories, suppliers, and stock tracking
- **Category Management**: Organize products into categories
- **Supplier Management**: Manage supplier information
- **Order Processing**: Handle purchase and sales orders with automatic stock updates
- **Real-time Alerts**: Low stock notifications
- **Reports & Analytics**: Dashboard with charts and inventory reports
- **Responsive UI**: Modern Material-UI interface

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- Material-UI (MUI)
- React Router
- Axios for API calls
- Recharts for data visualization

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with MONGO_URI and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Database**
   - Ensure MongoDB is running locally or update MONGO_URI in .env

## Usage

1. Register an admin user via API or directly in DB
2. Login to access the dashboard
3. Add categories and suppliers
4. Manage products and track inventory
5. Process orders and view reports

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/products` - Get products
- `POST /api/products` - Add product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- Similar CRUD for categories, suppliers, orders
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/sales` - Sales report

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License