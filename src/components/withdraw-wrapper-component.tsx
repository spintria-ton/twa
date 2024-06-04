import { Box } from '@mui/joy';
import { useTonWallet } from '@tonconnect/ui-react';
import { VestingWithdraw } from './vesting-withdraw';

export const WithdrawWrapperComponent = () => {
  const wallet = useTonWallet();
  const connected = !!wallet?.account.address;

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box display="flex" maxWidth="800px" mx="auto" py={{ xs: 0, md: 3 }} px={{ xs: 0, md: 6 }}>
        {/* {connected ? <VestingWithdraw /> : <WelcomeComponent />} */}
        <VestingWithdraw />
      </Box>
    </Box>
  );
};
