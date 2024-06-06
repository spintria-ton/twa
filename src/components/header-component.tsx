import { Badge, GlobalStyles, Sheet, Stack } from '@mui/joy';
import { CHAIN, TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import ColorSchemeToggle from './color-scheme-toggle';

export const Header = () => {
  const wallet = useTonWallet();
  const connected = !!wallet?.account.address;
  const network = wallet?.account.chain;

  return (
    <Sheet
      sx={{
        display: {
          xs: 'flex',
          // md: 'none'
        },
        px: { xs: 2, md: 6 },
        py: { xs: 2, md: 3 },
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        width: '100vw',
        height: 'var(--Header-height)',
        zIndex: 998,
        gap: 1,
        backgroundColor: 'transparent',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Header-height': '62px',
            [theme.breakpoints.up('md')]: {
              // '--Header-height': '72px',
            },
          },
        })}
      />
      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ ml: 'auto' }}
      >
        <ColorSchemeToggle />
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
          badgeContent={network ? (network === CHAIN.TESTNET ? 'TESTNET' : 0) : 0}
        >
          <TonConnectButton />
        </Badge>
      </Stack>
    </Sheet>
  );
};
