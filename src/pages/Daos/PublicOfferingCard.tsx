import { Avatar, Box, styled, Typography } from '@mui/material'
import { Progress } from 'antd'
import {
  DaoOpenStatus,
  DaoTypeStatus,
  useDaoInfoByAddress,
  useDaoStatus,
  useExternalDaoInfoByAddress
} from 'hooks/useDAOInfo'
import { useHistory } from 'react-router-dom'
import { timeStampToFormat } from 'utils/dao'
import { ReactComponent as IconDao } from 'assets/svg/icon-dao.svg'

const StyledText = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  height: 52,
  lineHeight: '16px',
  wordBreak: 'break-word'
})

function ShowStatus({ status }: { status: DaoOpenStatus }) {
  const color =
    status === DaoOpenStatus.COMING_SOON ? '#798488' : status === DaoOpenStatus.ACTIVE ? '#30D62C' : '#FF5F5B'
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        top: 5
      }}
    >
      <Box
        sx={{
          display: 'inlink-block',
          width: 5,
          height: 5,
          backgroundColor: color,
          borderRadius: '50%',
          marginRight: 5
        }}
      ></Box>
      <Typography variant="body2" color={color}>
        {status}
      </Typography>
    </Box>
  )
}

export default function PublicOfferingCard({ daoAddress }: { daoAddress: string | undefined }) {
  const daoInfo = useDaoInfoByAddress(daoAddress)
  const daoStatus = useDaoStatus(daoInfo)
  const history = useHistory()

  return (
    <Box
      padding={'35px 17px 28px'}
      height={186}
      sx={{
        background: '#FFFFFF',
        border: '0.5px solid #D8D8D8',
        boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.6)',
        borderRadius: '8px',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          boxShadow: '5px 7px 13px hsla(0, 0%, 68.23529411764706%, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)'
        }
      }}
      onClick={() => history.push('/offering/' + daoInfo?.daoAddress)}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '80px',
          height: '28px',
          left: 0,
          top: 0,
          background: '#FFFFFF',
          boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.5)',
          borderRadius: '8px 0px 0px 0px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {daoStatus?.typeStatus === DaoTypeStatus.PUBLIC ? (
          <Typography variant="body2" color={'#3898FC'}>
            {daoStatus?.typeStatus}
          </Typography>
        ) : (
          <Typography variant="body2" color={'#798488'}>
            {daoStatus?.typeStatus}
          </Typography>
        )}
      </Box>
      {daoStatus && <ShowStatus status={daoStatus.openStatus} />}
      <Box display={'grid'} gap={14} gridTemplateColumns={'58px 80px 1fr'} mb={22}>
        <Avatar sx={{ width: 58, height: 58 }} src={daoInfo?.token?.logo}>
          <IconDao />
        </Avatar>
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
            ? toFormatGroup(daoInfo?.pubSale?.amount.toSignificant()) +
              ' ' +
              (daoInfo.receiveToken?.name || '') +
              ' pledged'
            : ''}
        </Typography>
        <Typography variant="body2" color={'#798488'}>
          {daoStatus?.typeStatus === DaoTypeStatus.PUBLIC ? daoStatus.pubSoldPer + '% funded' : ''}
        </Typography>
        <Typography variant="body2" color={'#798488'}>
          {daoStatus?.openStatus === DaoOpenStatus.COMING_SOON ? (
            <>Start at {daoInfo?.pubSale?.startTime ? timeStampToFormat(daoInfo.pubSale.startTime, 'Y-MM-DD') : '-'}</>
          ) : (
            <>Ended at {daoInfo?.pubSale?.endTime ? timeStampToFormat(daoInfo.pubSale.endTime, 'Y-MM-DD') : '-'}</>
          )}
        </Typography>
      </Box>
    </Box>
  )
}

export function NonePublicOfferingCard({ daoAddress }: { daoAddress: string | undefined }) {
  const daoInfo = useExternalDaoInfoByAddress(daoAddress)

  return (
    <Box
      padding={'35px 17px 28px'}
      height={186}
      sx={{
        background: '#FFFFFF',
        border: '0.5px solid #D8D8D8',
        boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.6)',
        borderRadius: '8px',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          boxShadow: '5px 7px 13px hsla(0, 0%, 68.23529411764706%, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '80px',
          height: '28px',
          left: 0,
          top: 0,
          background: '#FFFFFF',
          boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.5)',
          borderRadius: '8px 0px 0px 0px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant="body2" color={'#798488'}>
          External
        </Typography>
      </Box>
      <Box display={'grid'} gap={14} gridTemplateColumns={'58px 80px 1fr'} mb={22}>
        <Avatar sx={{ width: 58, height: 58 }} src={daoInfo?.token?.logo}>
          <IconDao />
        </Avatar>
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
      <div />
    </Box>
  )
}
