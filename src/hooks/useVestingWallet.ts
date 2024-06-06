import { useQuery } from '@tanstack/react-query';
import { OpenedContract, beginCell, fromNano, toNano } from '@ton/core';
import { useIsConnectionRestored } from '@tonconnect/ui-react';
import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { NOW, SPINTRIA_MASTER_ADDRESS } from '../constants';
import Jetton from '../contracts/Jetton';
import { LinearVesting, Opcodes } from '../contracts/LinearVesting';
import { getJettonMetadata } from '../metadata';
import { vestingAddressState } from '../state';
import { getAddress, humanizeJettons, waitForTransaction } from '../utils';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

export function useVestingWallet() {
  const { client } = useTonClient();
  const { sender, wallet } = useTonConnect();
  const connectionRestored = useIsConnectionRestored();
  const walletAddress = wallet ? getAddress(wallet) : undefined;
  const vestingAddress = useRecoilValue(vestingAddressState);
  const [sendingTxs, setSendingTxs] = useState(false);

  const jettonMasterContract = useAsyncInitialize(async () => {
    if (!client || !wallet) return;
    const jettonAdress = getAddress(SPINTRIA_MASTER_ADDRESS);
    if (!jettonAdress) return;
    const contract = new Jetton(jettonAdress);
    return client.open(contract) as OpenedContract<Jetton>;
  }, [client, wallet]);

  const jettonMetaData = useQuery({
    queryKey: ['jetton-master-data', jettonMasterContract],
    queryFn: async () => {
      if (!jettonMasterContract) return null;
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
      if (!vestingContract) return null;
      const fromNow = NOW();
      const data = await vestingContract.getVestingData();
      const locked = await vestingContract.getLockedAmount(fromNow);
      return { data, locked, fromNow };
      // return fakeVestingData;
    },
  });

  const friendlyVesting = useMemo(() => {
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
    connectionRestored,
    vesting: vestingData?.data,
    friendlyVesting,
    jetton: jettonMetaData?.data,
    isVestingOwner:
      vestingData &&
      vestingData.data?.data &&
      walletAddress?.equals(vestingData.data.data.ownerAddress),
    sendingTxs,
    withdrawJettons: async () => {
      if (!client || !wallet || !vestingContract) {
        return;
      }
      setSendingTxs(true);
      try {
        const prevState = await client.getContractState(vestingContract.address);

        if (prevState.code === null) throw "Code can't be null on deployed contract";
        if (prevState.lastTransaction === null)
          throw "Last transaction can't be null on deployed contract";

        const sendTxResponse = await sender.send({
          to: vestingContract.address,
          value: toNano('0.1'),
          body: beginCell().storeUint(Opcodes.withdraw, 32).storeUint(0, 64).endCell(),
        });

        const txDone = await waitForTransaction(
          client,
          vestingContract.address,
          prevState.lastTransaction.lt,
        );
        if (txDone) {
          const currState = await client.getContractState(vestingContract.address);
          if (currState.code === null) throw "Code can't be null on deployed contract";
          if (currState.lastTransaction === null)
            throw "Last transaction can't be null on deployed contract";
        }
        // TODO check tx success/fail status
      } catch (error) {
        console.log('withdraw-error', error);
      }

      setSendingTxs(false);
    },
  };
}
