import { NgModule } from '@angular/core';
import { ActionButtonComponent } from './action-button/action-button.component';
import { CardComponent } from './card/card.component';
import { TableComponent } from './table/table.component';
import { FilterButtonComponent } from './filter-button/filter-button.component';
import { DropdownActionsComponent } from './dropdown-actions/dropdown-actions.component';

@NgModule({
  imports: [
    CardComponent,
    TableComponent,
    FilterButtonComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
  ],
  exports: [
    CardComponent,
    TableComponent,
    FilterButtonComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
  ],
})
export class StandardModule {}
