import { Avatar, Box, Grid, styled, Typography } from '@mui/material'
import { ExternalLink } from 'theme/components'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { ReactComponent as OpenLink } from 'assets/svg/open-link.svg'
import OutlineButton from 'components/Button/OutlineButton'
import { Progress } from 'antd'

const StyledHeader = styled(Box)({
  width: '100%',
  minHeight: 138,
  boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
  padding: '23px 43px'
})
const StyledContent = styled(Box)({
  maxWidth: '1320px',
  padding: '20px 76px 100px'
})
const StyledCard = styled(Box)({
  boxShadow: 'inset 2px 2px 5px rgba(105, 141, 173, 0.5)',
  borderRadius: '8px',
  padding: '23px 37px'
})
const StyledBetween = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between'
})

export default function Offering() {
  return (
    <div>
      <StyledHeader>
        <Typography variant="h5" mb={14}>
          jkljlfjfsd
        </Typography>
        <Box display={'flex'} gap="15px" alignItems={'center'}>
          <Typography fontSize={16}>14 Holders</Typography>
          <ExternalLink href="http://www.stpt.com">http://www.stpt.com</ExternalLink>
          <ExternalLink href="http://www.stpt.com" sx={{ display: 'flex', alignItems: 'center' }}>
            <Twitter />
          </ExternalLink>
          <ExternalLink href="http://www.stpt.com" sx={{ display: 'flex', alignItems: 'center' }}>
            <Discord />
          </ExternalLink>
        </Box>
        <Typography fontSize={16} mt={8}>
          Describe the organization in one paragraph, Describe the organization in one paragraph, Describe the
          organization in one paragraph,{' '}
        </Typography>
      </StyledHeader>
      <StyledContent>
        <Box mb={32}>
          <OutlineButton width="120px" height={48}>
            Back
          </OutlineButton>
        </Box>
        <Grid container spacing={32} fontSize={16}>
          <Grid item lg={8} md={12}>
            <StyledBetween alignItems={'center'}>
              <Box display={'flex'} gap={15}>
                <Avatar sx={{ width: 58, height: 58 }}></Avatar>
                <Box padding={'4px 0'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
                  <Typography variant="h6">DAO Test</Typography>
                  <Typography variant="inherit" color={'#767676'}>
                    DTC
                  </Typography>
                </Box>
              </Box>
              <ExternalLink
                href=""
                sx={{
                  display: 'flex'
                }}
              >
                View info <OpenLink />
              </ExternalLink>
            </StyledBetween>
            <Box display={'grid'} gap={10} mt={32}>
              <StyledBetween>
                <Typography variant="inherit" color={'#767676'}>
                  Address:
                </Typography>
                <Typography variant="h6">0xd97dA63d086d222EDE0aa8ee8432031465EEF</Typography>
              </StyledBetween>
              <StyledBetween>
                <Typography variant="inherit" color={'#767676'}>
                  Total supply:
                </Typography>
                <Typography variant="h6">100,000,000</Typography>
              </StyledBetween>
              <Progress percent={50} />
              <Typography variant="h6">400,000 / 5,000,000</Typography>
              <StyledBetween mt={10}>
                <Box>
                  <Typography variant="inherit" color={'#767676'}>
                    Holders
                  </Typography>
                  <Typography variant="h6">30</Typography>
                </Box>
                <Box textAlign={'right'}>
                  <Typography variant="inherit" color={'#767676'}>
                    Closed at
                  </Typography>
                  <Typography variant="h6">2021-12-16 15:52:59</Typography>
                </Box>
              </StyledBetween>
            </Box>
          </Grid>
          <Grid item lg={4} md={12}>
            <Box display={'grid'} gap={24}>
              <StyledCard display={'grid'} gap={5}>
                <Typography variant="h6" mb={10}>
                  Public sale
                </Typography>
                <StyledBetween>
                  <Typography variant="body1" color={'#767676'}>
                    Funding target
                  </Typography>
                  <Typography variant="h6">5,000,000 DCC</Typography>
                </StyledBetween>
                <StyledBetween>
                  <Typography variant="body1" color={'#767676'}>
                    Rate
                  </Typography>
                  <Typography variant="h6">1 DCC = 1 STPT</Typography>
                </StyledBetween>
                <StyledBetween>
                  <Typography variant="body1" color={'#767676'}>
                    Pledged
                  </Typography>
                  <Typography variant="h6">20,000 DCC</Typography>
                </StyledBetween>
              </StyledCard>
              <StyledCard></StyledCard>
            </Box>
          </Grid>
        </Grid>
      </StyledContent>
    </div>
  )
}
