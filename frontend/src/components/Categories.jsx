import { useEffect, useState } from 'react'
import { Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, IconButton } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import axios from 'axios'
import { useToast } from './ToastProvider'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get('/api/categories', { headers })
      setCategories(res.data)
      setError('')
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      setError('Failed to load categories')
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
        await axios.put(`/api/categories/${editingId}`, form, { headers })
        addToast('Category updated successfully!', 'success')
      } else {
        await axios.post('/api/categories', form, { headers })
        addToast('Category added successfully!', 'success')
      }
      setOpen(false)
      setEditingId(null)
      setForm({ name: '', description: '' })
      setError('')
      fetchCategories()
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to save category'
      setError(message)
      addToast(message, 'error')
    }
  }

  const handleEdit = (category) => {
    setForm({ name: category.name, description: category.description })
    setEditingId(category.id)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      await axios.delete(`/api/categories/${id}`, { headers })
      setError('')
      addToast('Category deleted successfully!', 'success')
      fetchCategories()
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete category'
      setError(message)
      addToast(message, 'error')
    }
  }

  const handleOpenDialog = () => {
    setEditingId(null)
    setForm({ name: '', description: '' })
    setError('')
    setOpen(true)
  }

  return (
    <div>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" onClick={handleOpenDialog}>Add Category</Button>
      <List>
        {categories.map((cat) => (
          <ListItem key={cat.id} secondaryAction={<>
            <IconButton edge="end" onClick={() => handleEdit(cat)}><Edit /></IconButton>
            <IconButton edge="end" onClick={() => handleDelete(cat.id)}><Delete /></IconButton>
          </>}>
            <ListItemText primary={cat.name} secondary={cat.description} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Description" fullWidth margin="dense" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}