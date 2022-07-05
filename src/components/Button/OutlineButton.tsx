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
  fontWeight?: string
  style?: React.CSSProperties
}

export default function OutlineButton(props: Props) {
  const {
    onClick,
    disabled,
    style,
    width,
    fontWeight,
    className,
    fontSize,
    color,
    primary,
    height,
    borderRadius,
    children
  } = props
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick ?? undefined}
      disabled={disabled}
      className={className}
      sx={{
        width: width || '100%',
        border: theme =>
          `2px solid ${color ? color : primary ? theme.palette.primary.main : theme.palette.text.primary}`,
        fontSize: fontSize || 16,
        fontWeight: fontWeight || '500',
        height: height || 50,
        color: primary ? theme.palette.primary.main : theme.palette.text.primary,
        borderRadius: borderRadius ?? '16px',
        '&:hover': {
          color: primary ? theme.palette.primary.main : theme.palette.text.secondary,
          borderColor: primary ? theme.palette.primary.main : theme.palette.text.secondary,
          transition: 'all 0.5s'
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
