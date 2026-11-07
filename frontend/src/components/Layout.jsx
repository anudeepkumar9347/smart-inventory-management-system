import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemText, Box, IconButton, Collapse } from '@mui/material'
import { Menu, X, LayoutDashboard, ShoppingCart, Tag, Building2, FileText, Settings, Power, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import BreadcrumbsNav from './BreadcrumbsNav'
import CommandPalette from './CommandPalette'

const drawerWidth = 260

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Products', path: '/products', icon: ShoppingCart },
    { label: 'Categories', path: '/categories', icon: Tag },
    { label: 'Suppliers', path: '/suppliers', icon: Building2 },
    { label: 'Orders', path: '/orders', icon: FileText, submenu: [
      { label: 'View Orders', path: '/orders' },
      { label: 'New Order', path: '/orders/new' }
    ]},
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleMenuClick = (item) => {
    if (item.submenu) {
      setExpandedMenu(expandedMenu === item.path ? null : item.path)
    } else {
      navigate(item.path)
      setMobileOpen(false)
    }
  }

  const menuContent = (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          const isExpanded = expandedMenu === item.path

          return (
            <div key={item.path}>
              <ListItem
                button
                onClick={() => handleMenuClick(item)}
                sx={{
                  backgroundColor: isActive ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                  borderLeft: isActive ? '4px solid #1976d2' : '4px solid transparent',
                  pl: isActive ? 1.5 : 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.05)'
                  }
                }}
              >
                <Icon size={20} style={{ marginRight: '12px' }} />
                <ListItemText primary={item.label} />
                {item.submenu && (
                  <Box sx={{ ml: 1 }}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </Box>
                )}
              </ListItem>
              {item.submenu && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((subitem) => (
                      <ListItem
                        key={subitem.path}
                        button
                        component={Link}
                        to={subitem.path}
                        sx={{ pl: 5, backgroundColor: location.pathname === subitem.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent' }}
                      >
                        <ListItemText primary={subitem.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            {mobileOpen ? <X /> : <Menu />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            📦 Inventory Pro
          </Typography>
          <Button color="inherit" onClick={() => setCommandPaletteOpen(true)} sx={{ mr: 2, textTransform: 'none' }}>
            Cmd+K Search
          </Button>
          <Button color="inherit" onClick={handleLogout} startIcon={<Power size={18} />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        <Toolbar />
        {menuContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #e0e0e0',
            background: '#fafafa'
          }
        }}
      >
        <Toolbar />
        {menuContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <BreadcrumbsNav />
        <Outlet />
      </Box>

      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </Box>
  )
}