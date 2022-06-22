import React from 'react'
import { ButtonBase, useTheme } from '@mui/material'

interface Props {
  onClick?: (() => void) | null
  primary?: boolean
  children: React.ReactNode
  width?: string | number
  height?: string | number
  fontSize?: string | number
  disabled?: boolean
  color?: string
  borderRadius?: string
  className?: string
  style?: React.CSSProperties
}

export default function OutlineButton(props: Props) {
  const { onClick, disabled, style, width, className, fontSize, color, primary, height, borderRadius, children } = props
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick ?? undefined}
      disabled={disabled}
      className={className}
      sx={{
        width: width || '100%',
        border: theme =>
          `1px solid ${color ? color : primary ? theme.palette.primary.main : theme.palette.text.secondary}`,
        fontSize,
        fontWeight: primary ? '500' : '400',
        height: height || 48,
        color: primary ? theme.palette.primary.main : theme.palette.text.primary,
        borderRadius: borderRadius ?? 1,
        '&:hover': {
          color: primary ? theme.palette.primary.main : theme.palette.text.secondary,
          borderColor: primary ? theme.palette.primary.main : theme.palette.text.secondary,
          transition: 'all 0.5s',
          boxShadow: '5px 7px 13px rgb(174 174 174 / 60%), -3px -3px 8px rgb(255 255 255 / 80%)'
        },
        '&:disabled': {
          opacity: theme.palette.action.disabledOpacity
        },
        ...style
      }}
    >
      {children}
    </ButtonBase>
  )
}
