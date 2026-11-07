import React, { useState } from 'react'
import { Box, Button, Stepper, Step, StepLabel, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const steps = ['Select Products', 'Customer Info', 'Review & Confirm']

export default function OrderWizard() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()

  const next = () => setActive((s) => Math.min(steps.length - 1, s + 1))
  const back = () => setActive((s) => Math.max(0, s - 1))

  const finish = () => {
    // placeholder: real implementation would post order to backend
    navigate('/orders')
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Order
      </Typography>
      <Stepper activeStep={active} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 200 }}>
        {active === 0 && <Typography>Select products and quantities here.</Typography>}
        {active === 1 && <Typography>Enter customer and shipping details.</Typography>}
        {active === 2 && <Typography>Review order details and confirm.</Typography>}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
        <Button disabled={active === 0} onClick={back}>
          Back
        </Button>
        {active < steps.length - 1 ? (
          <Button variant="contained" onClick={next}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={finish}>
            Finish
          </Button>
        )}
      </Box>
    </Paper>
  )
}
