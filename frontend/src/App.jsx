import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Layout from './components/Layout'

const Dashboard = lazy(() => import('./components/DashboardEnhanced'))
const Products = lazy(() => import('./components/Products'))
const Categories = lazy(() => import('./components/Categories'))
const Suppliers = lazy(() => import('./components/Suppliers'))
const Orders = lazy(() => import('./components/Orders'))
const Reports = lazy(() => import('./components/Reports'))
const OrderWizard = lazy(() => import('./components/OrderWizard'))
const Settings = lazy(() => import('./components/Settings'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<OrderWizard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App