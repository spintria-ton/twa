import { Check } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/joy';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // import locale
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';
import { START_TIME_FORMAT } from '../constants';
import { useVestingWallet } from '../hooks/useVestingWallet';

dayjs.locale('ru');
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const VestingWalletComponent = () => {
  const { isVestingOwner, vesting, friendlyVesting, withdrawJettons } = useVestingWallet();

  const amountsComponent = useMemo(
    () => (
      <Stack width="100%" direction="column">
        <Typography sx={{ mt: 1 }} level="body-sm">
          Заблокировано
        </Typography>
        <Typography level="h3">
          {friendlyVesting?.totalLockedAmount}{' '}
          <Typography fontSize="sm" textColor="text.tertiary">
            {friendlyVesting?.jettonSymbol}
          </Typography>
        </Typography>
        <Typography sx={{ mt: 1 }} level="body-sm">
          Разблокировано
        </Typography>
        <Typography level="h3">
          {friendlyVesting?.toWithdrawAmount}{' '}
          <Typography fontSize="sm" textColor="text.tertiary">
            {friendlyVesting?.jettonSymbol}
          </Typography>
        </Typography>
      </Stack>
    ),
    [friendlyVesting],
  );

  return (
    <Card
      variant="soft"
      color="primary"
      invertedColors
      sx={{
        width: '100%',
        borderRadius: 0,
        border: 'none',
      }}
    >
      <CardContent orientation="horizontal">
        <Stack direction="column" alignItems="center" justifyContent="start" spacing={2}>
          <CircularProgress size="lg" determinate value={friendlyVesting?.currentPercent || 0}>
            {friendlyVesting ? (
              friendlyVesting.currentPercent < 100 ? (
                <Typography>{friendlyVesting.currentPercent}%</Typography>
              ) : (
                <Check />
              )
            ) : (
              <Skeleton animation="wave" sx={{ opacity: 0.2 }} variant="circular">
                100
              </Skeleton>
            )}
          </CircularProgress>
          {friendlyVesting && !friendlyVesting.isFinished
            ? `${friendlyVesting.currentPeriod} / ${friendlyVesting.periods}`
            : ''}
        </Stack>
        <CardContent>
          <Typography level="body-md">Начало вестинг периода</Typography>
          <Typography level="h2">
            {vesting ? (
              dayjs(vesting.data.startTime * 1000).format(START_TIME_FORMAT)
            ) : (
              <Skeleton animation="wave" sx={{ opacity: 0.2 }} variant="rectangular">
                {START_TIME_FORMAT}
              </Skeleton>
            )}
          </Typography>
          {/*  */}
          <Typography level="body-xs" sx={{ mt: 1 }}>
            Продолжительность
          </Typography>
          <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
            {vesting ? (
              dayjs.duration(vesting.data.totalDuration, 'second').humanize()
            ) : (
              <Skeleton animation="wave" sx={{ opacity: 0.2 }} variant="rectangular">
                {START_TIME_FORMAT}
              </Skeleton>
            )}
          </Typography>
          {/*  */}
          <Typography level="body-xs" sx={{ mt: 1 }}>
            Период блокировки
          </Typography>
          <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
            {vesting ? (
              dayjs.duration(vesting.data.unlockPeriod, 'second').humanize()
            ) : (
              <Skeleton animation="wave" sx={{ opacity: 0.2 }} variant="rectangular">
                {START_TIME_FORMAT}
              </Skeleton>
            )}
          </Typography>
          {/*  */}
          <Typography level="body-xs" sx={{ mt: 1 }}>
            Холодный период (клифф)
          </Typography>
          <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
            {vesting ? (
              vesting.data.cliffDuration > 0 ? (
                dayjs.duration(vesting.data.cliffDuration, 'second').humanize()
              ) : (
                'отключен'
              )
            ) : (
              <Skeleton animation="wave" sx={{ opacity: 0.2 }} variant="rectangular">
                {START_TIME_FORMAT}
              </Skeleton>
            )}
          </Typography>
          {/*  */}
          <Typography level="body-xs" sx={{ mt: 1 }}>
            Следующий период
          </Typography>
          <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
            {vesting && friendlyVesting ? (
              friendlyVesting.isFinished ? (
                'контракт завершен'
              ) : (
                dayjs(friendlyVesting.nextPeriod * 1000).format(START_TIME_FORMAT)
              )
            ) : (
              <Skeleton animation="wave" sx={{ opacity: 0.2 }} variant="rectangular">
                {START_TIME_FORMAT}
              </Skeleton>
            )}
          </Typography>
          {amountsComponent}
        </CardContent>
      </CardContent>
      <Divider />
      <CardActions>
        <FormControl sx={{ width: '100%' }}>
          <FormHelperText
            sx={{
              p: 0,
              color: (t) =>
                isVestingOwner ? t.vars.palette.neutral : t.vars.palette.danger.plainColor,
            }}
          >
            {vesting
              ? isVestingOwner
                ? null
                : `Вы не можете вывести жетоны на свой кошелек, так как не являетесь владельцем
                вестинг-контракта`
              : null}
          </FormHelperText>
          <Button
            disabled={
              !isVestingOwner ||
              !vesting ||
              !friendlyVesting ||
              friendlyVesting.isFinished ||
              friendlyVesting?.toWithdraw === 0n ||
              friendlyVesting?.totalLocked === 0n
            }
            variant="solid"
            size="lg"
            sx={{ borderRadius: 6 }}
            onClick={withdrawJettons}
          >
            Вывод на кошелек
          </Button>
        </FormControl>
      </CardActions>
    </Card>
  );
};
