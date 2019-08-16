import React, {useState} from 'react';
import {WalletService} from '@universal-login/sdk';
import {DEFAULT_GAS_PRICE, ApplicationWallet} from '@universal-login/commons';
import {useServices} from '../../core/services/useServices';

export interface CreateRandomInstanceProps {
  ensName: string;
  applicationWallet: ApplicationWallet;
}

export const CreateRandomInstance = ({ensName, applicationWallet}: CreateRandomInstanceProps) => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const {sdk} = useServices();

  const createRandomInstance = async () => {
    const walletService = new WalletService(sdk);
    const {deploy, waitForBalance, contractAddress} = await walletService.createFutureWallet();
    setStatus(`Waiting for intial funds in ${contractAddress}`);
    await waitForBalance();
    setStatus('waiting for wallet contract to be deployed');
    await deploy(ensName, DEFAULT_GAS_PRICE.toString());
    walletService.setDeployed(ensName);
    setStatus(`Wallet contract deployed at ${contractAddress}`);
    setContractAddress(contractAddress);
    setStatus('');
    applicationWallet.name = (walletService.applicationWallet! as ApplicationWallet).name;
    applicationWallet.contractAddress = (walletService.applicationWallet! as ApplicationWallet).contractAddress;
    applicationWallet.privateKey = (walletService.applicationWallet! as ApplicationWallet).privateKey;
  };

  return (
    <div>
      <button onClick={createRandomInstance}>Create Ranodm Instance</button>
      <p>{`ENS name: ${ensName}`}</p>
      <p>{`Wallet Contract address: ${contractAddress}`}</p>
      <p>{`Status: ${status}`}</p>
    </div>
  );
};