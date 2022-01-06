import { Box } from '@mui/material'
import { Input } from 'antd'
import { ReactComponent as DeleteIcon } from 'assets/svg/delete_icon.svg'

export default function InputOptions({
  value,
  onChange,
  remove
}: {
  value: string
  onChange?: (e: string) => void
  remove?: () => void
}) {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        '&>input': {
          width: '100%',
          background: '#FAFAFA',
          boxShadow: 'inset 2px 2px 5px rgb(105 141 173 / 40%)',
          borderRadius: '8px',
          height: 48,
          fontWeight: 500,
          paddingRight: 50
        }
      }}
    >
      {remove && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            cursor: 'pointer',
            zIndex: 1
          }}
          onClick={remove}
        >
          <DeleteIcon width={54} height={54} />
        </Box>
      )}
      <Input value={value} placeholder="input" onChange={e => onChange && onChange(e.target.value)} />
    </Box>
  )
}
