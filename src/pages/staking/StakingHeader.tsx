import { Box, styled, Typography } from '@mui/material'
// import { Select } from 'antd'
import { ReactComponent as StakingSVG } from 'assets/svg/staking_cover.svg'
import OutlineButton from 'components/Button/OutlineButton'
// import IconDownArrow from 'components/ModalSTP/assets/icon-down-arrow.svg'

// const { Option } = Select

const StyledHeader = styled(Box)({
  width: '100%',
  minHeight: 193,
  boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
  padding: '23px 43px'
})

export default function index() {
  return (
    <StyledHeader>
      <Box display={'flex'} justifyContent="center">
        <Box display={'flex'} justifyContent="center" gap={'52px'}>
          <StakingSVG />
          <Box padding={'24px 0 16px'}>
            <Typography variant="h5" fontWeight={600} mb="10px">
              STPT Staking
            </Typography>
            <Typography variant="body2" mb="10px">
              Stake STPT(ERC20) to earn more tokens.
            </Typography>
            <OutlineButton
              onClick={() => {
                window.open(
                  'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xde7d85157d9714eadf595045cc12ca4a5f3e2adb&chain=mainnet'
                )
              }}
              width={220}
            >
              Buy STPT
            </OutlineButton>
            {/* <Box className="input-assets-selector" width={220}>
              <Select value={'Buy STPT'} suffixIcon={<img src={IconDownArrow} />} onChange={() => {}}>
                <Option value={''} style={{ color: '#798488' }}>
                  Buy STPT
                </Option>
                {[].map(item => (
                  <Option value={item} key={item}>
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      gap={5}
                      sx={{
                        '& img, & svg': {
                          width: 20,
                          height: 20
                        }
                      }}
                    >
                      STPT
                    </Box>
                  </Option>
                ))}
              </Select>
            </Box> */}
          </Box>
        </Box>
      </Box>
    </StyledHeader>
  )
}
