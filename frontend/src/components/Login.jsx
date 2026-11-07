import { useState } from 'react'
import { TextField, Button, Container, Typography, Box, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Link } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [openRegister, setOpenRegister] = useState(false)
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!form.email || !form.password) {
      setError('Email and password are required')
      return
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    
    try {
      const res = await axios.post('/api/auth/login', form)
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials')
    }
  }

  const handleRegisterOpen = () => {
    setOpenRegister(true)
    setRegisterError('')
    setRegisterSuccess('')
  }

  const handleRegisterClose = () => {
    setOpenRegister(false)
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' })
    setRegisterError('')
    setRegisterSuccess('')
  }

  const handleRegisterSubmit = async () => {
    // Validation
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setRegisterError('All fields are required')
      return
    }
    if (!registerForm.email.includes('@')) {
      setRegisterError('Please enter a valid email')
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match')
      return
    }
    if (registerForm.password.length < 6) {
      setRegisterError('Password must be at least 6 characters')
      return
    }
    try {
      await axios.post('/api/auth/register', {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password
      })
      setRegisterSuccess('Registration successful! You can now log in.')
      setTimeout(() => {
        handleRegisterClose()
      }, 2000)
    } catch (err) {
      setRegisterError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link 
                component="button" 
                variant="body2" 
                onClick={(e) => {
                  e.preventDefault()
                  handleRegisterOpen()
                }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Dialog open={openRegister} onClose={handleRegisterClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Account</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {registerError && <Alert severity="error" sx={{ mb: 2 }}>{registerError}</Alert>}
          {registerSuccess && <Alert severity="success" sx={{ mb: 2 }}>{registerSuccess}</Alert>}
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={registerForm.name}
            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            margin="normal"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            value={registerForm.confirmPassword}
            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegisterClose}>Cancel</Button>
          <Button onClick={handleRegisterSubmit} variant="contained">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}