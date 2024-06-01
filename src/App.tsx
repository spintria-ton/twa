import { Avatar, Badge, CssBaseline, CssVarsProvider, Stack, Typography } from '@mui/joy';
import { CHAIN } from '@tonconnect/protocol';
import { TonConnectButton } from '@tonconnect/ui-react';
import '@twa-dev/sdk';
import { LinearVesting } from './components/LinearVesting';
import ColorSchemeToggle from './components/color-scheme-toggle';
import { useTonConnect } from './hooks/useTonConnect';

function App() {
  const { network } = useTonConnect();

  return (
    <CssVarsProvider disableTransitionOnChange defaultMode="system" modeStorageKey={'twa-mode'}>
      <CssBaseline />
      <Stack alignItems="center" minHeight="100dvh">
        <Stack
          spacing={1}
          display="flex"
          flexDirection="column"
          maxWidth="900px"
          width="100%"
          py={2}
          px={0}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            px={1}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src="/twa/icon.jpeg" sx={{ '--Avatar-size': '3rem' }} />
              <Typography>Spintria (SP) Вестинг</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Badge
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                variant="solid"
                size="sm"
                showZero={false}
                slotProps={{
                  badge: { sx: { letterSpacing: -0.6, fontSize: 12 } },
                }}
                badgeContent={network ? (network === CHAIN.TESTNET ? 'TESTNET' : '') : 0}
              >
                <TonConnectButton />
              </Badge>
              <ColorSchemeToggle />
            </Stack>
          </Stack>
          <LinearVesting />
        </Stack>
      </Stack>
    </CssVarsProvider>
  );
}

export default App;
