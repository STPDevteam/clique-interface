import { Box, Typography } from '@mui/material'

export default function Error({ children }: { children: string | JSX.Element }) {
  return (
    <Box
      sx={{
        background: 'rgba(255, 193, 193, 0.5)',
        borderRadius: '8px',
        padding: 12
      }}
    >
      <Typography color={'#FF5F5B'} textAlign={'center'}>
        {children}
      </Typography>
    </Box>
  )
}
