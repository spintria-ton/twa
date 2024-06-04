import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';
import './index.css';
// this manifest is used temporarily for development purposes
const manifestUrl = 'https://spintria-ton.github.io/twa/tonconnect-manifest.json';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider
    manifestUrl={manifestUrl}
    language="ru"
    uiPreferences={{
      theme: THEME.DARK,
    }}
  >
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </QueryClientProvider>
  </TonConnectUIProvider>,
);
