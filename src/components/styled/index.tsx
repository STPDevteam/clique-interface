import styled from '@emotion/styled'

export const StyledExtraBg = styled('div')(
  ({ width, height, svgSize }: { width?: number; height?: number; svgSize?: number }) => ({
    borderRadius: '50%',
    width: width || 40,
    height: height || 40,
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      opacity: 0.8
    },
    '& svg': {
      width: svgSize || '100%',
      height: svgSize || '100%'
    }
  })
)
