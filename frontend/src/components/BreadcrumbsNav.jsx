import React from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Breadcrumbs, Link, Typography } from '@mui/material'

function labelFromSegment(seg) {
  if (!seg) return 'Home'
  return seg.charAt(0).toUpperCase() + seg.slice(1)
}

export default function BreadcrumbsNav() {
  const location = useLocation()
  const parts = location.pathname.split('/').filter(Boolean)

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link component={RouterLink} to="/">
        Home
      </Link>
      {parts.map((part, idx) => {
        const to = '/' + parts.slice(0, idx + 1).join('/')
        const isLast = idx === parts.length - 1
        return isLast ? (
          <Typography key={to} color="text.primary">
            {labelFromSegment(part)}
          </Typography>
        ) : (
          <Link key={to} component={RouterLink} to={to}>
            {labelFromSegment(part)}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}
