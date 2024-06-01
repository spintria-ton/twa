import { TonConnectButton } from '@tonconnect/ui-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // import locale
import { WithdrawJettons } from './withdraw-jettons';

dayjs.locale('ru');

export const LinearVesting = () => (
  <>
    <TonConnectButton />
    <WithdrawJettons />
  </>
);
