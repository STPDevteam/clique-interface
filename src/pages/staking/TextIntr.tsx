import { Box, Grid, styled, Typography } from '@mui/material'
import StaData from 'assets/svg/sta_data.svg'
import StaEarn from 'assets/svg/sta_earn.svg'
import StaLimit from 'assets/svg/sta_limit.svg'

const Text = styled(Typography)({
  color: '#808191',
  fontSize: '14px'
})

export default function TextIntr() {
  const list = [
    { name: 'Easy to earn', img: StaEarn, desc: 'Stake erc20 STPT to participate in the lockdrop.' },
    {
      name: 'Data transparency',
      img: StaData,
      desc: 'Airdrop based on the staking length and amount and traceable on blockchain.'
    },
    {
      name: 'No time limit',
      img: StaLimit,
      desc: 'Claim airdrop token anytime you want.'
    }
  ]
  return (
    <Box sx={{ padding: '0 30px' }}>
      <Grid container spacing={20}>
        {list.map(item => (
          <Grid item md={4} xs={12} key={item.name}>
            <Box
              sx={{
                background: '#FFFFFF',
                boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '20px',
                minHeight: 223,
                padding: '30px 26px 0 27px',
                display: 'grid',
                justifyItems: 'center'
              }}
            >
              <img src={item.img} alt="" />
              <Typography variant="h5" textAlign={'center'} fontSize={14} fontWeight={500}>
                {item.name}
              </Typography>
              <Text textAlign={'center'}>{item.desc}</Text>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
