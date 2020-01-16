import {BlockchainService} from '@universal-login/contracts';
import {WalletVersion} from '@universal-login/commons';
import {utils} from 'ethers';
import {GnosisSafeService} from './GnosisSafeService';

export interface IWalletContractServiceStrategy {
  lastNonce: (walletAddress: string) => Promise<number>;
  keyExist: (walletAddress: string, key: string) => Promise<boolean>;
  requiredSignatures: (walletAddress: string) => Promise<utils.BigNumber>;
  signMessage: (privateKey: string, message: Uint8Array | string, walletAddress: string) => string;
  encodeFunction: (method: string, args?: any[], walletAddress?: string) => Promise<string> | string;
}

export class WalletContractService {
  private walletVersion?: WalletVersion;

  constructor(private blockchainService: BlockchainService, private beta2Service: IWalletContractServiceStrategy, private gnosisSafeService: GnosisSafeService) {
  }

  async getWalletService(walletAddress: string): Promise<IWalletContractServiceStrategy> {
    this.walletVersion = this.walletVersion || await this.blockchainService.fetchWalletVersion(walletAddress);
    switch (this.walletVersion) {
      case 'beta1':
      case 'beta2':
        return this.beta2Service;
      case 'beta3':
        return this.gnosisSafeService;
      default:
        throw TypeError(`Invalid walletVersion: ${this.walletVersion}`);
    }
  }

  async lastNonce(walletAddress: string) {
    const service = await this.getWalletService(walletAddress);
    return service.lastNonce(walletAddress);
  }

  async keyExist(walletAddress: string, key: string) {
    const service = await this.getWalletService(walletAddress);
    return service.keyExist(walletAddress, key);
  }

  async requiredSignatures(walletAddress: string) {
    const service = await this.getWalletService(walletAddress);
    return service.requiredSignatures(walletAddress);
  }

  async signMessage(walletAddress: string, privateKey: string, message: Uint8Array | string) {
    const service = await this.getWalletService(walletAddress);
    return service.signMessage(privateKey, message, walletAddress);
  }

  async encodeFunction(walletAddress: string, method: string, args?: any[]) {
    const service = await this.getWalletService(walletAddress);
    return service.encodeFunction(method, args, walletAddress);
  }
}