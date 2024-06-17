import { Component } from '@angular/core';

import { ReturnMadeComponent } from './components/return-made/return-made.component';
import { PendingReturnComponent } from './components/pending-return/pending-return.component';

@Component({
  selector: 'app-return-purchases',
  standalone: true,
  imports: [ReturnMadeComponent, PendingReturnComponent],
  templateUrl: './return-purchases.component.html',
  styleUrl: './return-purchases.component.scss',
})
export class ReturnPurchasesComponent {}
