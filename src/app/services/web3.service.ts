import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { GlobalConstants } from '../common/global-constants';

const contract = require("@truffle/contract");

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  private web3!: Web3;
  private web3Observable = new Subject<Web3>;
  public contract!: Contract;
  public accountObservable = new Subject<string>;

  constructor() {
    window.addEventListener('load', (event: any) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {    
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.enable().then(() => {
        this.web3 = new Web3(window.ethereum);
        this.web3Observable.next(this.web3);
        this.web3.eth.getAccounts((error, accounts) => this.accountObservable.next(accounts[0]));
        window.ethereum.on('accountsChanged', (accounts: Array<string>) => this.accountObservable.next(accounts[0]));
      });
    } else {
      console.log('You should consider trying MetaMask!');
      // TODO: handle no provider case
    }
  }

  public async getContract() {
    if(!this.web3){
      this.web3 = await firstValueFrom(this.web3Observable);
    }

    this.contract = new this.web3.eth.Contract(
      GlobalConstants.contractArtifact.abi,
      GlobalConstants.contractAddress
    );

    return this.contract;
  }

  public etherToWei(etherAmount: number): string {
    return Web3.utils.toWei(String(etherAmount), 'ether');
  }

}
