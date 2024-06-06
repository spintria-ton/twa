import { CircularProgress as JoyCircularProgress, circularProgressClasses, styled } from '@mui/joy';

export const StyledCircularProgress = styled(JoyCircularProgress)({
  [`& .${circularProgressClasses.progress}`]: {
    animationDuration: '2.5s',
  },
});
