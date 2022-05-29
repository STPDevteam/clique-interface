import React, { useEffect } from 'react'
import { Box } from '@mui/material'
// import { ReactComponent as CopyIcon } from 'assets/componentsIcon/copy_icon.svg'
import { ReactComponent as IconCopy } from 'assets/images/icon-copy.svg'
// import CheckIcon from '@mui/icons-material/Check'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { StyledExtraBg } from 'components/styled'
import { notification } from 'antd'

interface Props {
  toCopy: string
  children?: React.ReactNode
  size?: number
  svgSize?: number
}

export default function Copy(props: Props) {
  const [isCopied, setCopied] = useCopyClipboard()
  const { toCopy, children, size, svgSize } = props

  useEffect(() => {
    isCopied &&
      notification.success({
        message: 'Copied successfully',
        top: 80
      })
  }, [isCopied])

  return (
    <Box
      sx={{
        display: 'flex',
        cursor: 'pointer'
      }}
      onClick={() => setCopied(toCopy)}
    >
      <StyledExtraBg width={size || 30} height={size || 30} svgSize={svgSize}>
        <IconCopy />
      </StyledExtraBg>
      {children}
    </Box>
  )
}
