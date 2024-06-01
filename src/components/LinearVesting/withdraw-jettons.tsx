import { Alert, Box, Button, FormControl, FormLabel, Input, List, ListItem } from '@mui/joy';
import { Address, fromNano } from '@ton/core';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // import locale
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTonConnect } from '../../hooks/useTonConnect';
import { useWithdrawJetton } from '../../hooks/useWithdrawJetton';

dayjs.locale('ru');
dayjs.extend(relativeTime);
dayjs.extend(duration);

export function WithdrawJettons() {
  const { connected, wallet } = useTonConnect();
  const walletAddress = wallet ? Address.parse(wallet).toString() : undefined;
  const {
    linearVestingAddress,
    withdrawVestingAddress,
    setWithdrawVestingAddress,
    queryVesting,
    sending,
    withdrawJettons,
  } = useWithdrawJetton();
  return (
    <Box sx={{ display: 'grid', gap: 2, px: 2 }}>
      <FormControl>
        <FormLabel>Укажите адрес вашего вестинг контракта</FormLabel>
        <Input
          type="text"
          placeholder="укажите адрес вестинг контракта"
          value={withdrawVestingAddress?.toString() || ''}
          onChange={(e) => setWithdrawVestingAddress(e.target.value)}
        />
      </FormControl>
      <List marker="circle" size="sm">
        {/* <ListItem color="neutral">
          Правообладатель:{' '}
          {queryVesting.data && (
            <TonviewerLink address={queryVesting.data?.ownerAddress.toString()} />
          )}
        </ListItem> */}
        <ListItem color="neutral">
          Начало вестинга:{' '}
          {!queryVesting.data ? '' : dayjs(queryVesting.data?.startTime * 1000).fromNow()} (
          {!queryVesting.data
            ? '...'
            : dayjs(queryVesting.data?.startTime * 1000).format('DD/MM/YYYY')}
          )
        </ListItem>
        <ListItem color="neutral">
          Продолжительность:{' '}
          {!queryVesting.data
            ? '...'
            : dayjs.duration(queryVesting.data?.totalDuration * 220, 'second').humanize()}
        </ListItem>
        <ListItem color="neutral">
          Период блокировки:{' '}
          {!queryVesting.data
            ? '...'
            : dayjs.duration(queryVesting.data?.unlockPeriod, 'second').humanize()}
        </ListItem>
        {queryVesting.data && queryVesting.data.cliffDuration > 0 && (
          <ListItem color="neutral">
            Холодный период (клифф):{' '}
            {!queryVesting.data
              ? '...'
              : queryVesting.data?.cliffDuration > 0
                ? dayjs.duration(queryVesting.data?.cliffDuration, 'second').humanize()
                : 'отключен'}
          </ListItem>
        )}
        <ListItem color="neutral">
          Всего получено жетонов:{' '}
          {!queryVesting.data ? '...' : fromNano(queryVesting.data?.totalDeposited).toString()}
        </ListItem>
        <ListItem color="neutral">
          Всего выведено жетонов:{' '}
          {!queryVesting.data ? '...' : fromNano(queryVesting.data?.totalWithdrawals).toString()}
        </ListItem>
      </List>
      {!connected && <Alert color="danger">Подключите кошелек для вывода жетонов</Alert>}
      {queryVesting.data && walletAddress !== queryVesting.data.ownerAddress.toString() && (
        <Alert color="danger" sx={{ py: 1 }}>
          Вы не можете вывести жетоны на свой кошелек так как не являетесь правообладателем
        </Alert>
      )}
      <Button
        type="submit"
        loading={sending}
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
    </Box>
  );
}
