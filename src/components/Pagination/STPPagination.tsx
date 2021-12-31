import { Box } from '@mui/material'
import { Pagination } from 'antd'

interface PaginationProps {
  count: number
  page: number
  onChange?: (page: number) => void
}

// export const StyledChange = styled('div')(({ disabled }: { disabled?: boolean }) => ({
//   background: '#FFFFFF',
//   width: 32,
//   height: 32,
//   borderRadius: '20px',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   cursor: 'pointer',
//   border: disabled ? 'none' : '0.5px solid #D8D8D8',
//   backgroundColor: disabled ? '#E5E5E5' : '#fff',
//   boxShadow: disabled
//     ? '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)'
//     : '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)'
// }))

export default function STPPagination({ count, page, onChange }: PaginationProps) {
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap="30px" padding="0 30px">
      <Pagination simple onChange={onChange} defaultCurrent={page} total={count} />
    </Box>
  )
}
