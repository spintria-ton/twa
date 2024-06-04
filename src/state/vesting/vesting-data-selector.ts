import { selector } from 'recoil';
import { VestingData } from '../../types';
import { vestingAddressState } from './vesting-address-state';

export const vestingDataSelector = selector({
  key: 'vestingDataSelector',
  get: async ({ get }) => {
    const address = get(vestingAddressState);
    if (!address) return;
    const data: VestingData = {
      startTime: 0,
      totalDuration: 0,
      unlockPeriod: 0,
      cliffDuration: 0,
      totalDeposited: 0n,
      totalWithdrawals: 0n,
      ownerAddress: '',
    };
    return data;
  },
});
