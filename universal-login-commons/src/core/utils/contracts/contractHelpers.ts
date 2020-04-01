import {utils, providers} from 'ethers';
import {ContractJSON} from '../../models/ContractJSON';
import {ensure} from '../errors/ensure';

export const getDeployedBytecode = (contract: ContractJSON) => contract.evm.deployedBytecode.object;

export const getContractHash = (contract: ContractJSON) => utils.keccak256(`0x${getDeployedBytecode(contract)}`);

export const isContract = async (provider: providers.Provider, contractAddress: string) => {
  const bytecode = await provider.getCode(contractAddress);
  ensure(bytecode.length > 0, Error, 'Empty bytecode');
  return bytecode !== '0x';
};

export default getContractHash;
