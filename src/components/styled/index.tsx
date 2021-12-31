import styled from '@emotion/styled'

export const StyledExtraBg = styled('div')(
  ({ width, height, svgSize }: { width?: number; height?: number; svgSize?: number }) => ({
    background: '#FFFFFF',
    borderRadius: '24.5px',
    boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8)',
    width: width || 40,
    height: height || 40,
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      boxShadow: '5px 7px 13px rgba(174, 174, 174, 0.6), -3px -3px 8px rgba(255, 255, 255, 0.8)'
    },
    '& svg': {
      width: svgSize || '100%',
      height: svgSize || '100%'
    }
  })
)
