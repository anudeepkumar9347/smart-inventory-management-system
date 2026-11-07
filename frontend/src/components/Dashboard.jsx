import { useEffect, useState } from 'react'
import { Grid, Card, CardContent, Typography, Box, Alert } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import axios from 'axios'

export default function Dashboard() {
  const [data, setData] = useState({ totalProducts: 0, lowStock: [], totalSales: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const [productsRes, salesRes] = await Promise.all([
          axios.get('/api/reports/inventory', { headers }),
          axios.get('/api/reports/sales', { headers })
        ])
        setData({
          totalProducts: productsRes.data.total,
          lowStock: productsRes.data.lowStock,
          totalSales: salesRes.data.totalSales
        })
        setError('')
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data')
      }
    }
    fetchData()
  }, [])

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Products</Typography>
              <Typography variant="h5">{data.totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Low Stock Items</Typography>
              <Typography variant="h5">{data.lowStock?.length || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Sales</Typography>
              <Typography variant="h5">${data.totalSales?.toFixed(2) || '0.00'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Low Stock Products</Typography>
              {data.lowStock && data.lowStock.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.lowStock}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography>No low stock items</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}