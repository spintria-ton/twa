import { OpenInNew } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  FormLabel,
  Link,
  Typography,
} from '@mui/joy';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // import locale
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { SPINTRIA_MASTER_ADDRESS } from '../constants';
import { vestingAddressState } from '../state';
import { isValidAddress } from '../utils';
import { SpintriaLogo } from './spintria-logo';
import { StyledInput } from './styled-input';
import { VestingWalletComponent } from './vesting-wallet-component';

dayjs.locale('ru');
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const VestingWithdraw = () => {
  const [vestingAddress, setVestingAddress] = useRecoilState(vestingAddressState);
  const [address, setAddress] = useState(vestingAddress);
  const [saved, setSaved] = useState(!!vestingAddress);
  const isAddress = isValidAddress(address);

  useEffect(() => {
    if (saved && address !== vestingAddress) {
      setVestingAddress(address);
    }
  }, [saved]);

  return (
    <Card
      // variant="plain"
      sx={(theme) => ({
        width: '100%',
        [theme.breakpoints.down('md')]: {
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: 0,
        },
        display: 'flex',
        flexDirection: 'column',
        px: 0,
        py: 0,
      })}
    >
      <CardContent sx={{ p: 2, alignItems: 'center', textAlign: 'center' }}>
        <SpintriaLogo sx={{ width: 64, height: 64, my: 2 }} />
        <Typography level="title-lg">Spintria (SP) Вестинг</Typography>
        <Typography level="body-sm" sx={{ maxWidth: '40ch' }}>
          Для начала работы с кошельком контракта вам необходимо указать адрес вашего
          вестинг-контракта
        </Typography>
      </CardContent>
      <CardContent sx={{ pt: 2 }}>
        <FormControl error={!isAddress}>
          <FormLabel sx={{ px: 2 }}>Адрес вестинг-контракта</FormLabel>
          <StyledInput
            size="lg"
            type="text"
            // disabled={saved}
            placeholder="..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            slotProps={{ input: { disabled: saved } }}
            endDecorator={
              saved && (
                <Button size="sm" variant="plain" onClick={() => setSaved(false)}>
                  изменить
                </Button>
              )
            }
          />
          {isAddress ? (
            saved && (
              <FormHelperText sx={{ px: 2, color: (t) => t.vars.palette.danger.plainColor }}>
                Не переводите на этот адрес тоны или жетоны, кроме
                <Link
                  fontSize="inherit"
                  underline="none"
                  endDecorator={<OpenInNew sx={{ fontSize: 'inherit' }} />}
                  href={`https://tonviewer.com/${SPINTRIA_MASTER_ADDRESS}`}
                  target="_blank"
                >
                  SP
                </Link>
              </FormHelperText>
            )
          ) : (
            <FormHelperText sx={{ px: 2 }}>Некорректный адрес</FormHelperText>
          )}
        </FormControl>
      </CardContent>
      {!saved && (
        <CardContent sx={{ p: 2 }}>
          <Button
            disabled={!isAddress}
            variant="solid"
            color="primary"
            type="submit"
            size="lg"
            onClick={() => setSaved(!saved)}
          >
            Сохранить
          </Button>
        </CardContent>
      )}
      <VestingWalletComponent />
    </Card>
  );
};
