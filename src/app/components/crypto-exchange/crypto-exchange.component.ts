import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CryptoExchangeService } from 'src/app/services/crypto-exchange.service';

@Component({
  selector: 'app-crypto-exchange',
  templateUrl: './crypto-exchange.component.html',
  styleUrls: ['./crypto-exchange.component.scss']
})
export class CryptoExchangeComponent {

  currentAccount: string = "";

  addressFormControl = new FormControl('', [Validators.required, Validators.pattern('0x[a-fA-F0-9]{40}')]);
  etherFormControl = new FormControl('', [Validators.required, Validators.min(0)]);

  constructor(private cryptoExchangeService: CryptoExchangeService,
              private changeDetectorRef: ChangeDetectorRef) {

    this.cryptoExchangeService.currentAccountObservable.subscribe(account => {
      this.currentAccount = account;
      this.changeDetectorRef.detectChanges();
    });
  }
  
  sendEther(): void {
    if(this.addressFormControl.value != null && this.etherFormControl.value != null)
    this.cryptoExchangeService.sendEther(this.addressFormControl.value, Number.parseInt(this.etherFormControl.value));
  }

}
