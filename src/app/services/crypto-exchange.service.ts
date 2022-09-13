import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Contract } from 'web3-eth-contract';
import { firstValueFrom, Subject } from 'rxjs';
import Web3 from 'web3';
import { Address } from '../models/Address';

const pastEventsOptions = {
  filter: {
    value: []
  },
  fromBlock: 0,
  toBlock: 'latest'
};

const liveEventOptions = {
  filter: {
      value: [],
  },
  fromBlock: 0
};

@Injectable({
  providedIn: 'root'
})
export class CryptoExchangeService {


  currentAccountObservable = new Subject<string>;
  cryptoExchangeContract!: Contract;

  private currentAccount!: string;
  private eventsObservable = new Subject<any>;

  constructor(private web3service: Web3Service) {
    this.web3service.accountObservable.subscribe(account => {
      this.currentAccount = account;
    });
    this.currentAccountObservable = this.web3service.accountObservable;
  }

  public async sendEther(address: string, etherAmount: number) {
    await this.waitForContractConnection();

    const weiAmount: string = this.web3service.etherToWei(etherAmount);

    await this.cryptoExchangeContract.methods
      .sendEther(address)
      .send({ from: this.currentAccount, value: weiAmount });
  }

  public async addAddress(name: string, address: string) {
    await this.waitForContractConnection();

    await this.cryptoExchangeContract.methods
    .saveAddress(name, address)
    .send({ from: this.currentAccount }); 
  }

  public async getAddressList(): Promise<Array<Address>> {
    await this.waitForContractConnection();

    return await this.cryptoExchangeContract.methods
      .getAddressList()
      .call({ from: this.currentAccount });
  }

  public async initializeEventListening(): Promise<Subject<any>> {
    await this.waitForContractConnection();

    this.cryptoExchangeContract.events.EtherSent(liveEventOptions)
      .on('data', (event: any) =>
        this.eventsObservable.next({ from: event.returnValues[0], to: event.returnValues[1] })
      )
      
    return this.eventsObservable;
  }

  private async waitForContractConnection() {
    if (!this.cryptoExchangeContract) {
      this.cryptoExchangeContract = await this.web3service.getContract();
    }

    if (!this.currentAccount) {
      this.currentAccount = await firstValueFrom(this.web3service.accountObservable);
    }
  }
}
