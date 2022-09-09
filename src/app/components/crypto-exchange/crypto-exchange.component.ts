import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { CryptoExchangeService } from 'src/app/services/crypto-exchange.service';

@Component({
  selector: 'app-crypto-exchange',
  templateUrl: './crypto-exchange.component.html',
  styleUrls: ['./crypto-exchange.component.scss']
})
export class CryptoExchangeComponent implements OnInit {

  currentAccount: string = "";

  constructor(private cryptoExchangeService: CryptoExchangeService,
              private changeDetectorRef: ChangeDetectorRef) {

    this.cryptoExchangeService.currentAccountObservable.subscribe(account => {
      this.currentAccount = account;
      this.changeDetectorRef.detectChanges();
    });
  }
  
  ngOnInit(): void {
    this.cryptoExchangeService.sendEther("0xFC05D980f5E4602A1b1Ef29A45257AC15e92e1F1", 2); // TODO: update the address
  }

}
