import React, { useState, useMemo } from 'react'
import { Dialog, TextField, List, ListItem, ListItemText, Box, Typography, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

const commands = [
  { name: 'Dashboard', description: 'Go to Dashboard', path: '/', category: 'Navigation' },
  { name: 'Products', description: 'Manage Products', path: '/products', category: 'Navigation' },
  { name: 'Categories', description: 'Manage Categories', path: '/categories', category: 'Navigation' },
  { name: 'Suppliers', description: 'Manage Suppliers', path: '/suppliers', category: 'Navigation' },
  { name: 'Orders', description: 'View Orders', path: '/orders', category: 'Navigation' },
  { name: 'New Order', description: 'Create a New Order', path: '/orders/new', category: 'Navigation' },
  { name: 'Reports', description: 'View Reports & Analytics', path: '/reports', category: 'Navigation' },
  { name: 'Settings', description: 'App Settings', path: '/settings', category: 'Navigation' },
]

export default function CommandPalette({ open, onClose }) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    if (!search) return commands
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const handleSelect = (path) => {
    navigate(path)
    setSearch('')
    onClose()
  }

  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = []
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filtered])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search commands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          InputProps={{ startAdornment: <Search size={20} style={{ marginRight: '10px' }} /> }}
          variant="outlined"
          size="small"
        />
      </Box>

      <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {Object.entries(grouped).length === 0 ? (
          <Typography sx={{ p: 2, textAlign: 'center', color: 'gray' }}>
            No commands found
          </Typography>
        ) : (
          Object.entries(grouped).map(([category, cmds]) => (
            <Box key={category}>
              <Typography variant="caption" sx={{ px: 2, pt: 1.5, display: 'block', fontWeight: 600, color: 'text.secondary' }}>
                {category}
              </Typography>
              <List disablePadding>
                {cmds.map((cmd) => (
                  <ListItem
                    key={cmd.path}
                    button
                    onClick={() => handleSelect(cmd.path)}
                    sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' } }}
                  >
                    <ListItemText
                      primary={cmd.name}
                      secondary={cmd.description}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))
        )}
      </Box>

      <Box sx={{ p: 1.5, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
        <Chip label="↑↓" size="small" />
        <Chip label="Enter" size="small" />
        <Chip label="Esc" size="small" />
        <Typography variant="caption" sx={{ ml: 'auto', alignSelf: 'center', color: 'text.secondary' }}>
          to navigate
        </Typography>
      </Box>
    </Dialog>
  )
}
