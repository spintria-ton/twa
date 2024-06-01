import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Typography,
} from '@mui/joy';
import { Address, fromNano } from '@ton/core';
import { CHAIN, TonConnectButton } from '@tonconnect/ui-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // import locale
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTonConnect } from '../hooks/useTonConnect';
import { useWithdrawJetton } from '../hooks/useWithdrawJetton';
import ColorSchemeToggle from './color-scheme-toggle';

dayjs.locale('ru');
dayjs.extend(relativeTime);
dayjs.extend(duration);

const humanizeJettons = (v: BigInt) => Number(fromNano(v.toString())).toLocaleString();

export const VestingWithdraw = () => {
  const { connected, wallet, network } = useTonConnect();
  const walletAddress = wallet ? Address.parse(wallet).toString() : undefined;
  const {
    linearVestingAddress,
    withdrawVestingAddress,
    setWithdrawVestingAddress,
    queryVesting,
    sending,
    withdrawJettons,
    queryJettonMetaData,
  } = useWithdrawJetton();
  console.log(queryVesting.data);

  return (
    <Card
      variant="plain"
      sx={{
        borderRadius: 0,
        // maxWidth: '100%',
        // boxShadow: 'lg',
        display: 'flex',
        // minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <CardContent>
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
      </CardContent>
      <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Avatar src="/twa/icon.jpeg" sx={{ '--Avatar-size': '4rem', my: 2 }} />
        <Typography level="title-lg">Spintria (SP) Вестинг</Typography>
        <Typography level="body-sm" sx={{ maxWidth: '40ch' }}>
          Для начала работы с кошельком контракта вам необходимо указать адрес вашего
          вестинг-контракта
        </Typography>

        <Box sx={{ display: 'grid', gap: 2, py: 2, width: '100%', textAlign: 'left' }}>
          <FormControl>
            <FormLabel>Укажите адрес вашего вестинг контракта</FormLabel>
            <Input
              size="lg"
              type="text"
              placeholder="укажите адрес вестинг контракта"
              value={withdrawVestingAddress?.toString() || ''}
              onChange={(e) => setWithdrawVestingAddress(e.target.value)}
            />
            <FormHelperText sx={{ color: (t) => t.vars.palette.danger.plainColor }}>
              Не переводите на этот адрес тоны или жетоны
            </FormHelperText>
          </FormControl>
        </Box>
      </CardContent>
      <CardContent sx={{}}>
        <Typography level="body-xs">Начало вестинга</Typography>
        <Typography
          level="title-lg"
          sx={{ fontWeight: 'xl' }}
          endDecorator={
            queryVesting.data && (
              <Chip component="span" size="sm" variant="outlined" color="neutral">
                {dayjs(queryVesting.data?.startTime * 1000).fromNow()}
              </Chip>
            )
          }
        >
          {queryVesting.data
            ? dayjs(queryVesting.data?.startTime * 1000).format('DD/MM/YYYY')
            : '...'}
        </Typography>
        {/*  */}
        <Typography level="body-xs" sx={{ mt: 1 }}>
          Продолжительность
        </Typography>
        <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
          {queryVesting.data
            ? dayjs.duration(queryVesting.data?.totalDuration, 'second').humanize()
            : '...'}
        </Typography>
        {/*  */}
        <Typography level="body-xs" sx={{ mt: 1 }}>
          Период блокировки
        </Typography>
        <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
          {queryVesting.data
            ? dayjs.duration(queryVesting.data?.unlockPeriod, 'second').humanize()
            : '...'}
        </Typography>
        {/*  */}
        <Typography level="body-xs" sx={{ mt: 1 }}>
          Холодный период (клифф)
        </Typography>
        <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
          {queryVesting.data
            ? queryVesting.data?.cliffDuration > 0
              ? dayjs.duration(queryVesting.data?.cliffDuration, 'second').humanize()
              : 'отключен'
            : '...'}
        </Typography>
        {/*  */}
        <Typography level="body-xs" sx={{ mt: 1 }}>
          Всего получено
        </Typography>
        <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
          {queryVesting.data ? humanizeJettons(queryVesting.data?.totalDeposited || 0n) : '...'}
          &nbsp;&nbsp;
          <Typography color="neutral" level="title-sm">
            {queryJettonMetaData.data && queryJettonMetaData.data.content?.symbol}
          </Typography>
        </Typography>
        {/*  */}
        <Typography level="body-xs" sx={{ mt: 1 }}>
          Всего выведено
        </Typography>
        <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
          {queryVesting.data ? humanizeJettons(queryVesting.data?.totalWithdrawals || 0n) : '...'}
          &nbsp;&nbsp;
          <Typography color="neutral" level="title-sm">
            {queryJettonMetaData.data && queryJettonMetaData.data.content?.symbol}
          </Typography>
        </Typography>
        {!connected && (
          <Alert sx={{ mt: 2 }} color="danger">
            Подключите кошелек для работы с кошельком
          </Alert>
        )}
      </CardContent>
      <CardOverflow sx={{ bgcolor: 'background.level1' }}>
        <CardActions buttonFlex="1">
          <ButtonGroup variant="solid" sx={{ bgcolor: 'background.surface' }}>
            <Button
              color="primary"
              type="submit"
              loading={sending}
              size="lg"
              disabled={
                queryVesting.isFetching ||
                !queryVesting.data ||
                walletAddress !== queryVesting.data.ownerAddress.toString() ||
                !connected ||
                !withdrawVestingAddress ||
                !linearVestingAddress ||
                sending
              }
              onClick={withdrawJettons}
            >
              Вывод жетонов на кошелек
            </Button>
          </ButtonGroup>
        </CardActions>
      </CardOverflow>
    </Card>
  );
};
