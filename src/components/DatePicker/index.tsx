import { Box } from '@mui/material'
import { DatePicker } from 'antd'
import moment from 'moment'
import { Moment } from 'moment'

interface Props {
  disabledPassTime?: Date | number
  valueStamp?: number
  onChange?: (n: number | undefined) => void
}

export default function Index({ disabledPassTime, onChange, valueStamp }: Props) {
  function _onChange(value: Moment | null) {
    onChange && onChange(value ? Number((value.valueOf() / 1000).toFixed()) : undefined)
  }

  function onOk(value: Moment) {
    onChange && onChange(value ? Number((value.valueOf() / 1000).toFixed()) : undefined)
  }

  return (
    <Box
      sx={{
        width: '100%',
        '&>div': {
          width: '100%',
          background: '#FAFAFA',
          boxShadow: 'inset 2px 2px 5px rgb(105 141 173 / 40%)',
          borderRadius: '8px',
          minHeight: 48,
          fontWeight: 500
        }
      }}
    >
      <DatePicker
        showTime
        disabledDate={current => {
          return disabledPassTime ? current && current < moment(disabledPassTime).subtract(0, 'days') : false
        }}
        value={valueStamp ? moment(valueStamp * 1000) : undefined}
        onChange={_onChange}
        onOk={onOk}
      />
    </Box>
  )
}
