import React, { useState } from 'react'
import { Card, CardContent, Typography, Box, Switch, FormControlLabel, Button, Grid, Divider, Alert } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useToast } from './ToastProvider'

export default function Settings() {
  const theme = useTheme()
  const { addToast } = useToast()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    autoSave: true
  })

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] })
    addToast(`${key.replace(/([A-Z])/g, ' $1')} ${!settings[key] ? 'enabled' : 'disabled'}`, 'success')
  }

  const handleClearCache = () => {
    localStorage.removeItem('token')
    addToast('Cache cleared', 'success')
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Settings
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        Manage your app preferences and account settings.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Preferences
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={() => handleToggle('emailNotifications')}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={() => handleToggle('darkMode')}
                    />
                  }
                  label="Dark Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoSave}
                      onChange={() => handleToggle('autoSave')}
                    />
                  }
                  label="Auto Save"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Data & Storage
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Alert severity="info" sx={{ mb: 2 }}>
                Clear your local cache if you're experiencing issues or want to reset preferences.
              </Alert>
              <Button variant="outlined" color="error" onClick={handleClearCache}>
                Clear Cache
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                About
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>App Name:</strong> Inventory Pro
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Version:</strong> 2.0.0
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Last Updated:</strong> January 15, 2026
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
