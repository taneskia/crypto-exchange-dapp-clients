import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Contract } from 'web3-eth-contract';
import { firstValueFrom, Subject } from 'rxjs';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class CryptoExchangeService {

  currentAccountObservable = new Subject<string>;
  cryptoExchangeContract!: Contract;

  private currentAccount!: string;
  
  constructor(private web3service: Web3Service) {
    this.web3service.accountObservable.subscribe(account => {
      this.currentAccount = account;
    });
    this.currentAccountObservable = this.web3service.accountObservable;
  }
  
  public async sendEther(address: string, etherAmount: number): Promise<boolean> {

    if (!this.cryptoExchangeContract) {
      this.cryptoExchangeContract = await this.web3service.getContract();
    }

    if (!this.currentAccount) {
      this.currentAccount = await firstValueFrom(this.web3service.accountObservable);
    }

    console.log(`current account ${this.currentAccount}`);

    const weiAmount: string = this.web3service.etherToWei(etherAmount);

    this.cryptoExchangeContract.methods
      .sendEther(address)
      .send({ from: this.currentAccount, value: weiAmount });

    return true; // TODO: update the contract to return true or false and propagate value from this function
  }

}
