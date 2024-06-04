import { Button, ButtonGroup, CardActions, CardOverflow } from '@mui/joy';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // import locale
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('ru');
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const WithdrawActionComponent = () => {
  return (
    <CardOverflow sx={{ bgcolor: 'background.level1' }}>
      <CardActions buttonFlex="1">
        <ButtonGroup variant="solid" sx={{ bgcolor: 'background.surface' }}>
          <Button
            color="primary"
            type="submit"
            // loading={sending}
            size="lg"
            // disabled={
            //   queryVesting.isFetching ||
            //   !queryVesting.data ||
            //   walletAddress !== queryVesting.data.ownerAddress.toString() ||
            //   !connected ||
            //   !vestingAddress ||
            //   !linearVestingAddress ||
            //   sending
            // }
            // onClick={withdrawJettons}
          >
            Вывод жетонов на кошелек
          </Button>
        </ButtonGroup>
      </CardActions>
    </CardOverflow>
  );
};
