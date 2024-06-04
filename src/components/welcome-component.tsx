import { OpenInNew } from '@mui/icons-material';
import { Card, CardContent, Link, Typography } from '@mui/joy';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // import locale
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SPINTRIA_MASTER_ADDRESS } from '../hooks/useWithdrawJetton';
import { SpintriaLogo } from './spintria-logo';

dayjs.locale('ru');
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const WelcomeComponent = () => (
  <Card
    sx={(theme) => ({
      width: '100%',
      [theme.breakpoints.down('md')]: {
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 0,
      },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    })}
  >
    <CardContent sx={{ p: 2, alignItems: 'center', textAlign: 'center' }}>
      <SpintriaLogo sx={{ width: 64, height: 64, my: 2 }} />
      <Typography level="title-lg">Spintria (SP) Вестинг</Typography>
      <Typography level="body-sm" sx={{ maxWidth: '40ch' }}>
        Добро пожаловать в приложение для управления вестинг-контрактом{' '}
        <Link
          underline="none"
          endDecorator={<OpenInNew sx={{ fontSize: 'inherit' }} />}
          href={`https://tonviewer.com/${SPINTRIA_MASTER_ADDRESS}`}
          target="_blank"
        >
          SP жетона
        </Link>
        .<br />
        Для продолжения работы Вам необходимо подключить свой кошелек. Для этого нажмите кнопку
        Connect Wallet в правом верхнем углу. После чего выберите один из способов подключения, мы
        рекомендуем использовать Tonkeeper.
      </Typography>
    </CardContent>
  </Card>
);
