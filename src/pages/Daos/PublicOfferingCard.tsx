import { Avatar, Box, styled, Typography } from '@mui/material'
import { Progress } from 'antd'
import { DaoTypeStatus, useDaoInfoByAddress, useDaoStatus } from 'hooks/useDAOInfo'
import { useHistory } from 'react-router-dom'
import { timeStampToFormat, toFormatMillion } from 'utils/dao'

const StyledText = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  height: 52,
  lineHeight: '16px'
})

export default function PublicOfferingCard({ daoAddress }: { daoAddress: string | undefined }) {
  const daoInfo = useDaoInfoByAddress(daoAddress)
  const daoStatus = useDaoStatus(daoInfo)
  const history = useHistory()

  return (
    <Box
      padding={'29px 17px'}
      height={186}
      sx={{
        background: '#FFFFFF',
        border: '0.5px solid #D8D8D8',
        boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.6)',
        borderRadius: '8px',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)'
        }
      }}
      onClick={() => history.push('/offering/' + daoInfo?.daoAddress)}
    >
      <Box display={'grid'} gap={14} gridTemplateColumns={'58px 80px 1fr'} mb={22}>
        <Avatar sx={{ width: 58, height: 58 }} src={daoInfo?.token?.logo}></Avatar>
        <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} pt={4} height={52}>
          <Typography
            variant="h6"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {daoInfo?.daoName || '--'}
          </Typography>
          <Typography fontWeight={500} fontSize={14} color="#798488" sx={{ whiteSpace: 'nowrap' }}>
            {daoInfo?.token?.symbol || '--'}
          </Typography>
        </Box>
        <StyledText fontSize={10} pt={5}>
          {daoInfo?.daoDesc}
        </StyledText>
      </Box>
      <Progress
        style={{ opacity: daoStatus?.typeStatus === DaoTypeStatus.PUBLIC ? 1 : 0 }}
        percent={daoStatus?.pubSoldPer || 0}
        showInfo={false}
      />
      <Box display={'flex'} justifyContent={'space-between'} mt={10}>
        <Typography variant="body2">
          {daoStatus?.typeStatus === DaoTypeStatus.PUBLIC && daoInfo?.pubSale?.amount
            ? toFormatMillion(daoInfo?.pubSale?.amount.toSignificant()) +
              ' ' +
              (daoInfo.receiveToken?.name || '') +
              ' pledged'
            : ''}
        </Typography>
        <Typography variant="body2" color={'#798488'}>
          {daoStatus?.typeStatus === DaoTypeStatus.PUBLIC ? daoStatus.pubSoldPer + '% funded' : ''}
        </Typography>
        <Typography variant="body2" color={'#798488'}>
          Start at {daoInfo?.pubSale?.startTime ? timeStampToFormat(daoInfo.pubSale.startTime, 'Y-MM-DD') : '-'}
        </Typography>
      </Box>
    </Box>
  )
}
