import { useEffect, useState } from 'react'
import { Grid, Card, CardContent, Typography, Box, Alert, CircularProgress } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { ShoppingCart, Package, AlertCircle, TrendingUp } from 'lucide-react'
import axios from 'axios'
import { useToast } from './ToastProvider'

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card sx={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`, borderLeft: `4px solid ${color}` }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
        <Icon size={40} color={color} opacity={0.7} />
      </Box>
    </CardContent>
  </Card>
)

export default function DashboardEnhanced() {
  const [data, setData] = useState({ totalProducts: 0, lowStock: [], totalSales: 0, orders: [] })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const [productsRes, salesRes, ordersRes] = await Promise.all([
          axios.get('/api/reports/inventory', { headers }),
          axios.get('/api/reports/sales', { headers }),
          axios.get('/api/orders', { headers })
        ])
        setData({
          totalProducts: productsRes.data.total,
          lowStock: productsRes.data.lowStock || [],
          totalSales: salesRes.data.totalSales || 0,
          orders: ordersRes.data || []
        })
        setError('')
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data')
        addToast('Failed to load dashboard', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [addToast])

  if (loading) {
    return <CircularProgress />
  }

  const stockStatus = [
    { name: 'In Stock', value: Math.max(0, data.totalProducts - data.lowStock.length), fill: '#10b981' },
    { name: 'Low Stock', value: data.lowStock.length, fill: '#f59e0b' }
  ]

  const topProducts = data.lowStock.slice(0, 5).map((p) => ({
    name: p.name || 'Unknown',
    quantity: p.quantity || 0
  }))

  const ordersByType = [
    { name: 'Sales', value: data.orders.filter((o) => o.type === 'sale').length, fill: '#667eea' },
    { name: 'Purchases', value: data.orders.filter((o) => o.type === 'purchase').length, fill: '#764ba2' }
  ]

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography color="textSecondary" sx={{ fontSize: '0.875rem' }}>
          Welcome back! Here's your inventory overview.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={Package} label="Total Products" value={data.totalProducts} color="#667eea" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={AlertCircle} label="Low Stock" value={data.lowStock.length} color="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={TrendingUp} label="Total Sales" value={`$${data.totalSales.toLocaleString()}`} color="#10b981" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={ShoppingCart} label="Total Orders" value={data.orders.length} color="#764ba2" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Inventory Status
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stockStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Orders by Type
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={ordersByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ordersByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Low Stock Products
              </Typography>
              {topProducts.length === 0 ? (
                <Typography color="textSecondary">All products are well stocked!</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
