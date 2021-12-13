import { Select as MuiSelect, InputLabel as MuiInputLabel, styled, InputBase, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'

interface Props {
  children?: React.ReactNode
  onChange?: (e: any) => void
  defaultValue?: any
  value?: string | string[]
  disabled?: boolean
  selected?: React.ReactNode
  placeholder?: string
  width?: string | number
  height?: string | number
  multiple?: boolean
  primary?: boolean
  label?: string
  renderValue?: any
}

const StyledInputLabel = styled(MuiInputLabel)(({ theme }) => ({
  opacity: 0.6,
  color: theme.palette.primary.contrastText,
  marginBottom: '8px'
}))

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: '10px',
  border: '1px solid transparent',
  position: 'relative',
  padding: '10px',
  '& .MuiSelect-icon': {
    color: theme.palette.primary.contrastText,
    right: '10px'
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.main
  }
}))

export default function Select(props: Props) {
  const {
    disabled,
    onChange,
    children,
    width,
    height,
    label,
    primary,
    value,
    defaultValue,
    placeholder,
    renderValue
  } = props
  const theme = useTheme()

  return (
    <>
      {label && <StyledInputLabel>{label}</StyledInputLabel>}
      <StyledSelect
        sx={{
          backgroundColor: primary ? theme.palette.primary.main : theme.palette.grey.A400,
          width: width || '100%',
          height: height || '48px',
          '&:before': {
            content: value || defaultValue ? "''" : `"${placeholder}"`,
            position: 'absolute',
            left: 24,
            top: 10,
            zIndex: 999,
            fontSize: 16,
            fontWeight: 400
          },
          '&:hover': {
            backgroundColor: disabled ? theme.palette.grey.A400 : theme.palette.primary.main
          },
          '& .MuiSelect-icon': {
            display: disabled ? 'none' : 'block'
          }
        }}
        value={value}
        displayEmpty
        disabled={disabled}
        MenuProps={{
          sx: {
            '& .MuiPaper-root': {
              width: '100%',
              borderRadius: '10px',
              mt: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '& li': {
                fontSize: 16,
                fontWeight: 500,
                color: '#FFFFFF',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0'
              },
              '& li:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)'
              },
              '& li:last-child': {
                borderBottom: 'none'
              },
              '& .MuiMenuItem-root': {
                '&::before': {
                  content: '""',
                  width: 30,
                  height: 20,
                  display: 'flex',
                  justifyContent: 'center'
                },
                '&.Mui-selected::before': {
                  content: `url(${SelectedIcon})`,
                  width: 30,
                  height: 20,
                  display: 'flex',
                  justifyContent: 'center'
                }
              }
            }
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left'
          }
        }}
        input={<InputBase />}
        IconComponent={ExpandMoreIcon}
        onChange={onChange}
        renderValue={renderValue}
      >
        {children}
      </StyledSelect>
    </>
  )
}
