import { Input, InputProps } from '@mui/joy';

export const StyledInput = (props: InputProps) => (
  <Input
    placeholder="Type in here…"
    variant="soft"
    sx={{
      '--Input-minHeight': '64px',
      '--Input-radius': '0px',
      borderBottom: '1px solid',
      borderColor: 'neutral.outlinedBorder',
      '&:hover': {
        borderColor: 'neutral.outlinedHoverBorder',
      },
      '&::before': {
        border: '1px solid var(--Input-focusedHighlight)',
        transform: 'scaleX(0)',
        left: 0,
        right: 0,
        bottom: '-2px',
        top: 'unset',
        transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
        borderRadius: 0,
      },
      '&:focus-within::before': {
        transform: 'scaleX(1)',
      },
    }}
    {...props}
  />
);
