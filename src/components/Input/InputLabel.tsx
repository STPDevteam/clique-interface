import React from 'react'
import { InputLabel as MuiInputLabel } from '@mui/material'
import { ReactComponent as InfoIcon } from '../../assets/componentsIcon/info_icon.svg'

export default function InputLabel({ children, infoIcon }: { children?: React.ReactNode; infoIcon?: boolean }) {
  return (
    <MuiInputLabel
      sx={{
        color: theme => theme.palette.text.secondary,
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          // opacity: 0.6,
          fontSize: 10,
          fontWeight: 400,
          lineHeight: '148.69%'
        }}
      >
        {children}
      </div>
      {infoIcon && (
        <InfoIcon
          style={{
            marginLeft: 4,
            cursor: 'pointer'
          }}
        />
      )}
    </MuiInputLabel>
  )
}
