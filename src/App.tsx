import { Box, CssBaseline, CssVarsProvider } from '@mui/joy';
import '@twa-dev/sdk';
import { Header } from './components/header-component';
import { WithdrawWrapperComponent } from './components/withdraw-wrapper-component';

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange defaultMode="system" modeStorageKey={'twa-mode'}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Box
          component="main"
          sx={{
            pt: { xs: 'calc(var(--Header-height))', md: 3 },
            pb: { xs: 0, md: 2 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
            overflow: 'auto',
          }}
        >
          <Header />
          <WithdrawWrapperComponent />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

export default App;
