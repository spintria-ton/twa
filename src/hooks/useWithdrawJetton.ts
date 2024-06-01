import { useQuery } from '@tanstack/react-query';
import { Address, OpenedContract, beginCell, fromNano, toNano } from '@ton/core';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import Jetton from '../contracts/Jetton';
import { LinearVesting, Opcodes } from '../contracts/LinearVesting';
import { getJettonMetadata } from '../metadata';
import { withdrawVestingAddressState } from '../state';
import { getAddress, waitForSeqno } from '../utils';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

export const SPINTRIA_MASTER_ADDRESS = 'EQACLXDwit01stiqK9FvYiJo15luVzfD5zU8uwDSq6JXxbP8';
const TOKEN_MASTER_ADDRESS = SPINTRIA_MASTER_ADDRESS;

export function useWithdrawJetton() {
  const { client } = useTonClient();
  const { sender, wallet } = useTonConnect();
  const [withdrawVestingAddress, setWithdrawVestingAddress] = useRecoilState(
    withdrawVestingAddressState,
  );
  const [sending, setSending] = useState(false);

  const jettonMasterContract = useAsyncInitialize(async () => {
    if (!client || !wallet) return;
    const jettonAdress = getAddress(TOKEN_MASTER_ADDRESS);
    if (!jettonAdress) return;
    const contract = new Jetton(jettonAdress);
    return client.open(contract) as OpenedContract<Jetton>;
  }, [client, wallet]);

  const queryJettonMetaData = useQuery({
    queryKey: ['jetton-master-data', jettonMasterContract],
    // refetchInterval: 5 * 1000,
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

  const linearVestingContract = useAsyncInitialize(async () => {
    if (!client || !withdrawVestingAddress) return;
    const wa = getAddress(withdrawVestingAddress);
    if (!wa) return;
    const contract = new LinearVesting(wa);
    return client.open(contract) as OpenedContract<LinearVesting>;
  }, [client, withdrawVestingAddress]);

  const queryVesting = useQuery({
    queryKey: ['linear-vesting', linearVestingContract],
    // refetchInterval: 10 * 1000,
    queryFn: async () => {
      if (!linearVestingContract) return null;
      return await linearVestingContract.getVestingData();
    },
  });

  return {
    queryVesting,
    linearVestingAddress: linearVestingContract?.address.toString(),
    withdrawVestingAddress,
    setWithdrawVestingAddress,
    queryJettonMetaData,
    sending,
    withdrawJettons: async () => {
      if (!client || !wallet || !linearVestingContract) {
        return;
      }

      setSending(true);
      const waiter = await waitForSeqno(client, Address.parse(wallet));

      await sender?.send({
        to: linearVestingContract.address,
        value: toNano('0.1'),
        body: beginCell().storeUint(Opcodes.withdraw, 32).storeUint(0, 64).endCell(),
      });

      try {
        await waiter();
      } catch (error) {}

      // await delay(20 * 1000);
      // window.location.reload();

      setSending(false);
    },
  };
}
