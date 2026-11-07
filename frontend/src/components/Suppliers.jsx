import { useEffect, useState } from 'react'
import { Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, IconButton } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import axios from 'axios'
import { useToast } from './ToastProvider'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', contact: '', email: '' })
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get('/api/suppliers', { headers })
      setSuppliers(res.data)
      setError('')
    } catch (err) {
      console.error('Failed to fetch suppliers:', err)
      setError('Failed to load suppliers')
    }
  }

  const handleSubmit = async () => {
    if (!form.name) {
      setError('Name is required')
      addToast('Name is required', 'error')
      return
    }
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      if (editingId) {
        await axios.put(`/api/suppliers/${editingId}`, form, { headers })
        addToast('Supplier updated successfully!', 'success')
      } else {
        await axios.post('/api/suppliers', form, { headers })
        addToast('Supplier added successfully!', 'success')
      }
      setOpen(false)
      setEditingId(null)
      setForm({ name: '', contact: '', email: '' })
      setError('')
      fetchSuppliers()
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to save supplier'
      setError(message)
      addToast(message, 'error')
    }
  }

  const handleEdit = (supplier) => {
    setForm({ name: supplier.name, contact: supplier.contact, email: supplier.email })
    setEditingId(supplier.id)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      await axios.delete(`/api/suppliers/${id}`, { headers })
      setError('')
      addToast('Supplier deleted successfully!', 'success')
      fetchSuppliers()
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete supplier'
      setError(message)
      addToast(message, 'error')
    }
  }

  const handleOpenDialog = () => {
    setEditingId(null)
    setForm({ name: '', contact: '', email: '' })
    setError('')
    setOpen(true)
  }

  return (
    <div>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" onClick={handleOpenDialog}>Add Supplier</Button>
      <List>
        {suppliers.map((sup) => (
          <ListItem key={sup.id} secondaryAction={<>
            <IconButton edge="end" onClick={() => handleEdit(sup)}><Edit /></IconButton>
            <IconButton edge="end" onClick={() => handleDelete(sup.id)}><Delete /></IconButton>
          </>}>
            <ListItemText primary={sup.name} secondary={`${sup.contact} - ${sup.email}`} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingId ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Contact" fullWidth margin="dense" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <TextField label="Email" fullWidth margin="dense" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}