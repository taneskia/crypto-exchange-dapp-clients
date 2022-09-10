import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CryptoExchangeService } from 'src/app/services/crypto-exchange.service';

@Component({
  selector: 'app-crypto-exchange',
  templateUrl: './crypto-exchange.component.html',
  styleUrls: ['./crypto-exchange.component.scss']
})
export class CryptoExchangeComponent implements OnInit {

  currentAccount: string = '';
  addressList: Array<string> = new Array<string>();
  selectedAddress: string = '';

  addressFormControl = new FormControl('', [Validators.required, Validators.pattern('0x[a-fA-F0-9]{40}')]);
  etherFormControl = new FormControl('', [Validators.required, Validators.min(0)]);

  addAddressFormControl = new FormControl('', [Validators.required, Validators.pattern('0x[a-fA-F0-9]{40}')]);


  constructor(private cryptoExchangeService: CryptoExchangeService,
              private changeDetectorRef: ChangeDetectorRef) {

    this.cryptoExchangeService.currentAccountObservable.subscribe(account => {
      this.currentAccount = account;
      this.changeDetectorRef.detectChanges();
    });
  }

  async ngOnInit() {
    await this.loadAddressList();
  }
  
  sendEther(): void {
    if(this.addressFormControl.value != null && this.etherFormControl.value != null)
    this.cryptoExchangeService.sendEther(this.addressFormControl.value, Number.parseInt(this.etherFormControl.value));
  }

  // TODO: implement method
  addAddress(): void {
    if (this.addAddressFormControl.value != null) {
      this.addressList.push(this.addAddressFormControl.value);
      this.addAddressFormControl.setValue('');
    }
  }

  // TODO: implement method
  async loadAddressList() {
    this.addressList.push('');
    this.addressList.push('0x40304c9e1d12Ebf0A28B125Cf841502d915f51Ab');
    this.addressList.push('0x94b2e29AA0ed357221BE37A55Cd2c9dE07cB8bd6');
    this.addressList.push('0x74b4B453aFb5634A41e2C98969B884CF05952657');
  }

  onSelectedAddressChanged() {
    this.addressFormControl.setValue(this.selectedAddress);
  }

}
