import { useEffect, useState } from 'react'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton, InputAdornment, Alert } from '@mui/material'
import { Edit, Delete, Search } from '@mui/icons-material'
import axios from 'axios'
import { useToast } from './ToastProvider'

export default function Products() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', description: '', quantity: 0, price: 0, categoryId: '', supplierId: '' })
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())))
  }, [products, search])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get('/api/products', { headers })
      setProducts(res.data)
      setError('')
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products')
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.price) {
      setError('Name and Price are required')
      addToast('Name and Price are required', 'error')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      if (editingId) {
        // Update existing product
        await axios.put(`/api/products/${editingId}`, form, { headers })
        addToast('Product updated successfully!', 'success')
      } else {
        // Add new product
        await axios.post('/api/products', form, { headers })
        addToast('Product added successfully!', 'success')
      }
      
      setOpen(false)
      setEditingId(null)
      setForm({ name: '', description: '', quantity: 0, price: 0, categoryId: '', supplierId: '' })
      setError('')
      fetchProducts()
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to save product'
      setError(message)
      addToast(message, 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      await axios.delete(`/api/products/${id}`, { headers })
      setError('')
      addToast('Product deleted successfully!', 'success')
      fetchProducts()
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete product'
      setError(message)
      addToast(message, 'error')
    }
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      categoryId: product.categoryId || '',
      supplierId: product.supplierId || ''
    })
    setEditingId(product.id)
    setOpen(true)
  }

  const handleOpenDialog = () => {
    setEditingId(null)
    setForm({ name: '', description: '', quantity: 0, price: 0, categoryId: '', supplierId: '' })
    setError('')
    setOpen(true)
  }

  return (
    <div>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" onClick={handleOpenDialog}>Add Product</Button>
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(product)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(product.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingId ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Description" fullWidth margin="dense" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="Quantity" type="number" fullWidth margin="dense" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })} />
          <TextField label="Price" type="number" fullWidth margin="dense" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} />
          <TextField label="Category ID" type="number" fullWidth margin="dense" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} />
          <TextField label="Supplier ID" type="number" fullWidth margin="dense" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}