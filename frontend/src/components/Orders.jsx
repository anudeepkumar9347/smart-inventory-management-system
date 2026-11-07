import { useEffect, useState } from 'react'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Dialog, DialogTitle, DialogContent, TextField, DialogActions, MenuItem, Box, Table as MTable, TableHead as MTableHead, TableBody as MTableBody, TableRow as MTableRow, TableCell as MTableCell, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import axios from 'axios'
import { useToast } from './ToastProvider'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [form, setForm] = useState({ type: 'sale', items: [], customer: '', supplier: '' })
  const [currentItem, setCurrentItem] = useState({ productId: '', quantity: 0, price: 0 })
  const { addToast } = useToast()

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get('/api/products', { headers })
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get('/api/orders', { headers })
      setOrders(res.data)
      setError('')
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setError('Failed to load orders')
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!form.customer && !form.supplier) {
      setError('Customer or Supplier name is required')
      addToast('Customer or Supplier name is required', 'error')
      return
    }
    if (form.items.length === 0) {
      setError('At least one product item is required')
      addToast('At least one product item is required', 'error')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      const orderData = {
        type: form.type,
        products: form.items,
        customer: form.customer || null,
        supplier: form.supplier || null
      }
      
      await axios.post('/api/orders', orderData, { headers })
      setOpen(false)
      setForm({ type: 'sale', items: [], customer: '', supplier: '' })
      setCurrentItem({ productId: '', quantity: 0, price: 0 })
      setError('')
      addToast('Order created successfully!', 'success')
      fetchOrders()
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to create order'
      setError(message)
      addToast(message, 'error')
    }
  }

  const handleAddItem = () => {
    if (!currentItem.productId || currentItem.quantity <= 0 || currentItem.price < 0) {
      addToast('Please select a product, enter quantity, and price', 'error')
      return
    }
    
    const product = products.find(p => p.id === parseInt(currentItem.productId))
    if (!product) {
      addToast('Product not found', 'error')
      return
    }
    
    if (form.type === 'sale' && product.quantity < currentItem.quantity) {
      addToast(`Insufficient stock. Available: ${product.quantity}`, 'error')
      return
    }
    
    const newItem = {
      product: parseInt(currentItem.productId),
      productName: product.name,
      quantity: parseInt(currentItem.quantity),
      price: parseFloat(currentItem.price)
    }
    
    setForm({
      ...form,
      items: [...form.items, newItem]
    })
    setCurrentItem({ productId: '', quantity: 0, price: 0 })
    addToast('Product added to order', 'success')
  }

  const handleRemoveItem = (index) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index)
    })
  }

  const calculateTotal = () => {
    return form.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const handleOpenDialog = () => {
    setOpen(true)
    setForm({ type: 'sale', items: [], customer: '', supplier: '' })
    setCurrentItem({ productId: '', quantity: 0, price: 0 })
    setError('')
  }

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        await axios.delete(`/api/orders/${id}`, { headers })
        addToast('Order deleted successfully!', 'success')
        fetchOrders()
      } catch (err) {
        const message = err.response?.data?.error || 'Failed to delete order'
        addToast(message, 'error')
      }
    }
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      addToast('Please select a status', 'error')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      await axios.put(`/api/orders/${selectedOrderId}`, { status: newStatus }, { headers })
      setStatusDialogOpen(false)
      setSelectedOrderId(null)
      setNewStatus('')
      addToast('Order status updated successfully!', 'success')
      fetchOrders()
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update order status'
      addToast(message, 'error')
    }
  }

  return (
    <div>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" onClick={handleOpenDialog}>Add Order</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Customer/Supplier</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell sx={{ textTransform: 'capitalize' }}>{order.type}</TableCell>
                <TableCell>{order.customer || order.supplierId || 'N/A'}</TableCell>
                <TableCell>${order.total?.toFixed(2)}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>
                  <Button 
                    size="small" 
                    onClick={() => {
                      setSelectedOrderId(order.id)
                      setNewStatus(order.status)
                      setStatusDialogOpen(true)
                    }}
                    variant={order.status === 'completed' ? 'contained' : order.status === 'cancelled' ? 'outlined' : 'text'}
                  >
                    {order.status}
                  </Button>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteOrder(order.id)} 
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Order</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box sx={{ mb: 3 }}>
            <TextField 
              select 
              label="Order Type" 
              fullWidth 
              margin="dense" 
              value={form.type} 
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <MenuItem value="sale">Sale</MenuItem>
              <MenuItem value="purchase">Purchase</MenuItem>
            </TextField>
            
            {form.type === 'sale' ? (
              <TextField label="Customer Name" fullWidth margin="dense" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
            ) : (
              <TextField label="Supplier Name" fullWidth margin="dense" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
            )}
          </Box>

          <Box sx={{ mb: 3, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
            <h4>Add Products to Order</h4>
            <TextField 
              select 
              label="Product" 
              fullWidth 
              margin="dense" 
              value={currentItem.productId} 
              onChange={(e) => {
                const prod = products.find(p => p.id === parseInt(e.target.value))
                setCurrentItem({ 
                  ...currentItem, 
                  productId: e.target.value,
                  price: prod?.price || 0
                })
              }}
            >
              <MenuItem value="">Select a product</MenuItem>
              {products.map(prod => (
                <MenuItem key={prod.id} value={prod.id}>
                  {prod.name} (Stock: {prod.quantity}, Price: ${prod.price})
                </MenuItem>
              ))}
            </TextField>
            
            <TextField 
              label="Quantity" 
              type="number" 
              fullWidth 
              margin="dense" 
              value={currentItem.quantity} 
              onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
            />
            
            <TextField 
              label="Unit Price" 
              type="number" 
              fullWidth 
              margin="dense" 
              value={currentItem.price} 
              onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
              disabled
            />
            
            <Button onClick={handleAddItem} variant="contained" fullWidth sx={{ mt: 2 }}>
              Add Product
            </Button>
          </Box>

          {form.items.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <h4>Order Items</h4>
              <TableContainer>
                <MTable size="small">
                  <MTableHead>
                    <MTableRow>
                      <MTableCell>Product</MTableCell>
                      <MTableCell align="right">Quantity</MTableCell>
                      <MTableCell align="right">Price</MTableCell>
                      <MTableCell align="right">Total</MTableCell>
                      <MTableCell align="center">Action</MTableCell>
                    </MTableRow>
                  </MTableHead>
                  <MTableBody>
                    {form.items.map((item, idx) => (
                      <MTableRow key={idx}>
                        <MTableCell>{item.productName}</MTableCell>
                        <MTableCell align="right">{item.quantity}</MTableCell>
                        <MTableCell align="right">${item.price}</MTableCell>
                        <MTableCell align="right">${(item.quantity * item.price).toFixed(2)}</MTableCell>
                        <MTableCell align="center">
                          <IconButton size="small" onClick={() => handleRemoveItem(idx)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </MTableCell>
                      </MTableRow>
                    ))}
                    <MTableRow>
                      <MTableCell colSpan={3} align="right"><strong>Order Total:</strong></MTableCell>
                      <MTableCell align="right"><strong>${calculateTotal().toFixed(2)}</strong></MTableCell>
                      <MTableCell />
                    </MTableRow>
                  </MTableBody>
                </MTable>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={form.items.length === 0}>Create Order</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <TextField 
            select 
            label="Status" 
            fullWidth 
            margin="normal" 
            value={newStatus} 
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}