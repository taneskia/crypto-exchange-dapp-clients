import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Address } from 'src/app/models/Address';
import { CryptoExchangeService } from 'src/app/services/crypto-exchange.service';

@Component({
  selector: 'app-crypto-exchange',
  templateUrl: './crypto-exchange.component.html',
  styleUrls: ['./crypto-exchange.component.scss']
})
export class CryptoExchangeComponent implements OnInit {

  currentAccount: string = '';
  addressList: Array<Address> = new Array<Address>();
  selectedAddress: string = '';

  addressFormControl = new FormControl('', [Validators.required, Validators.pattern('0x[a-fA-F0-9]{40}')]);
  etherFormControl = new FormControl('', [Validators.required, Validators.min(0)]);

  nameFormControl = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]);
  addAddressFormControl = new FormControl('', [Validators.required, Validators.pattern('0x[a-fA-F0-9]{40}')]);


  constructor(private cryptoExchangeService: CryptoExchangeService,
              private changeDetectorRef: ChangeDetectorRef) {

    this.cryptoExchangeService.currentAccountObservable.subscribe(account => {
      this.currentAccount = account;
      this.handleAccountChange();
      this.changeDetectorRef.detectChanges();
    });
  }

  async ngOnInit() {
    await this.loadAddressList();
  }
  
  async sendEther() {
    if (this.addressFormControl.value != null && this.etherFormControl.value != null) {
      await this.cryptoExchangeService.sendEther(this.addressFormControl.value, Number.parseInt(this.etherFormControl.value));
      this.addressFormControl.reset();
      this.etherFormControl.reset();
    }
  }

  async addAddress() {
    const address = this.addAddressFormControl.value;
    const name = this.nameFormControl.value;
    if (address != null && name != null) {
      await this.cryptoExchangeService.addAddress(name, address);
      this.loadAddressList();
      this.addAddressFormControl.reset();
      this.nameFormControl.reset();
    }
  }

  async loadAddressList() {
    this.addressList = await this.cryptoExchangeService.getAddressList();
    console.log("loading address list")
  }

  onSelectedAddressChanged() {
    this.addressFormControl.setValue(this.selectedAddress);
  }

  private async handleAccountChange() {
    this.addressFormControl.reset();
    this.etherFormControl.reset();
    this.nameFormControl.reset();
    this.addAddressFormControl.reset();
    this.loadAddressList();
  }

}
