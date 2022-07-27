import { Box, styled, Typography, useTheme } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import { useCumulativeStaked } from 'hooks/useStakeVerified'

const StyledHeader = styled(Box)({
  width: '100%',
  minHeight: 187,
  boxShadow: 'rgb(174 174 174 / 20%) 0px 0px 5px',
  padding: '32px 48px',
  borderRadius: '24px'
})

export default function VerifyHeader() {
  const cumulativeStaked = useCumulativeStaked()
  const theme = useTheme()
  return (
    <StyledHeader>
      <Box display={'flex'} justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Staking to Verify
          </Typography>
          <Typography variant="body2" mb="24px">
            Validation for DAO by staking STPT (ERC20)
          </Typography>
          <OutlineButton
            onClick={() => {
              window.open(
                'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xde7d85157d9714eadf595045cc12ca4a5f3e2adb&chain=mainnet'
              )
            }}
            width={163}
            height={40}
          >
            Buy STPT
          </OutlineButton>
        </Box>
        <Box>
          <Typography fontWeight={600} color={theme.palette.text.secondary}>
            Cumulative staked
          </Typography>
          <Typography mt={15} variant="h5" fontWeight={600}>
            {cumulativeStaked?.toSignificant(6, { groupSeparator: ',' })} {cumulativeStaked?.token.symbol || '--'}
          </Typography>
        </Box>
      </Box>
    </StyledHeader>
  )
}
