import { useEffect, useState } from 'react'
import { Typography, Box, Card, CardContent, Alert } from '@mui/material'
import axios from 'axios'

export default function Reports() {
  const [report, setReport] = useState({ total: 0, lowStock: [], outOfStock: [] })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get('/api/reports/inventory', { headers })
      setReport(res.data)
      setError('')
    } catch (err) {
      console.error('Failed to fetch report:', err)
      setError('Failed to load report')
    }
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Typography variant="h4" gutterBottom>Reports</Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Inventory Summary</Typography>
          <Typography>Total Products: {report.total}</Typography>
          <Typography>Low Stock: {report.lowStock?.length || 0}</Typography>
          <Typography>Out of Stock: {report.outOfStock?.length || 0}</Typography>
        </CardContent>
      </Card>
    </Box>
  )
}