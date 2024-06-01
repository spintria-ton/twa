import { CssBaseline, CssVarsProvider } from '@mui/joy';
import '@twa-dev/sdk';
import { VestingWithdraw } from './components/vesting-withdraw';

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange defaultMode="system" modeStorageKey={'twa-mode'}>
      <CssBaseline />
      <VestingWithdraw />
    </CssVarsProvider>
  );
}

export default App;
