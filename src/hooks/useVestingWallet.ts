import { useQuery } from '@tanstack/react-query';
import { Address, OpenedContract, beginCell, fromNano, toNano } from '@ton/core';
import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { NOW } from '../constants';
import Jetton from '../contracts/Jetton';
import { LinearVesting, Opcodes } from '../contracts/LinearVesting';
import { getJettonMetadata } from '../metadata';
import { vestingAddressState } from '../state';
import { delay, getAddress, humanizeJettons, waitForSeqno } from '../utils';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

const TOKEN_MASTER_ADDRESS = 'EQACLXDwit01stiqK9FvYiJo15luVzfD5zU8uwDSq6JXxbP8';
// const fakeVestingData = {
//   data: {
//     startTime: 1700595200,
//     totalDuration: 60480000,
//     unlockPeriod: 604800,
//     cliffDuration: 0,
//     totalDeposited: 23928571430000n,
//     ownerAddress: 'ownerAddress',
//     totalWithdrawals: 239285714300n,
//   },
//   fromNow: 1717510771,
//   locked: 23689285715700n,
// };

export function useVestingWallet() {
  const { client } = useTonClient();
  const { sender, wallet } = useTonConnect();
  const walletAddress = wallet ? Address.parse(wallet).toString() : undefined;
  const vestingAddress = useRecoilValue(vestingAddressState);
  const [sending, setSending] = useState(false);

  const jettonMasterContract = useAsyncInitialize(async () => {
    if (!client || !wallet) return;
    const jettonAdress = getAddress(TOKEN_MASTER_ADDRESS);
    if (!jettonAdress) return;
    const contract = new Jetton(jettonAdress);
    return client.open(contract) as OpenedContract<Jetton>;
  }, [client, wallet]);

  const jettonMetaData = useQuery({
    queryKey: ['jetton-master-data', jettonMasterContract],
    queryFn: async () => {
      if (!jettonMasterContract) return;
      const data = await jettonMasterContract.getJettonData();

      return {
        adminAddress: data.adminAddress.toString(),
        content: await getJettonMetadata(data.content),
        mintable: data.mintable,
        totalSupply: fromNano(data.totalSupply),
      };
    },
  });

  const vestingContract = useAsyncInitialize(async () => {
    if (!client || !vestingAddress) return;
    const wa = getAddress(vestingAddress);
    if (!wa) return;
    const contract = new LinearVesting(wa);
    return client.open(contract) as OpenedContract<LinearVesting>;
  }, [client, vestingAddress]);

  const vestingData = useQuery({
    queryKey: ['linear-vesting', vestingContract],
    queryFn: async () => {
      if (!vestingContract) return;
      const fromNow = NOW();
      const data = await vestingContract.getVestingData();
      const locked = await vestingContract.getLockedAmount(fromNow);
      return { data, locked, fromNow };
      // return fakeVestingData;
    },
  });

  const friendlyVesting = useMemo(() => {
    console.log(vestingData?.data, jettonMetaData?.data);
    if (!vestingData || !vestingData.data || !vestingData.data.data || !vestingData.data.locked)
      return;
    if (!jettonMetaData || !jettonMetaData.data || !jettonMetaData.data.content) return;
    const {
      data: { startTime, totalDuration, unlockPeriod, totalDeposited, totalWithdrawals },
      locked,
      fromNow,
    } = vestingData.data;
    const diff = fromNow - startTime;
    const periods = totalDuration / unlockPeriod;
    const currentPeriod = Math.floor(diff / unlockPeriod);
    const nextPeriod = startTime + (currentPeriod + 1) * unlockPeriod;
    const currentPercent = Math.round((periods / 100) * currentPeriod);
    const toWithdraw = totalDeposited - totalWithdrawals - locked;
    const toWithdrawAmount = humanizeJettons(toWithdraw, jettonMetaData.data.content);
    const totalLocked = totalDeposited - totalWithdrawals;
    const totalLockedAmount = humanizeJettons(totalLocked, jettonMetaData.data.content);
    const jettonSymbol = jettonMetaData.data.content.symbol;
    return {
      periods,
      diff,
      currentPeriod,
      currentPercent: currentPercent < 100 ? currentPercent : 100,
      nextPeriod,
      toWithdraw,
      toWithdrawAmount,
      totalLocked,
      totalLockedAmount,
      jettonSymbol,
      isFinished: startTime + totalDuration < nextPeriod,
    };
  }, [vestingData, jettonMetaData]);

  return {
    // vesting: fakeVesting,
    vesting: vestingData?.data,
    friendlyVesting,
    jetton: jettonMetaData?.data,
    isVestingOwner:
      vestingData && walletAddress === vestingData.data?.data?.ownerAddress.toString(),
    sending,
    withdrawJettons: async () => {
      if (!client || !wallet || !vestingContract) {
        return;
      }

      setSending(true);
      const waiter = await waitForSeqno(client, Address.parse(wallet));

      await sender?.send({
        to: vestingContract.address,
        value: toNano('0.1'),
        body: beginCell().storeUint(Opcodes.withdraw, 32).storeUint(0, 64).endCell(),
      });

      try {
        await waiter();
      } catch (error) {}

      await delay(15 * 1000);

      setSending(false);
    },
  };
}
