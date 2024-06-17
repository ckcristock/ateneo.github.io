import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { AutocompleteMdlComponent } from 'src/app/components/autocomplete-mdl/autocomplete-mdl.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    ViewMoreComponent,
    AutomaticSearchComponent,
    AutocompleteMdlComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    ViewMoreComponent,
    AutomaticSearchComponent,
    AutocompleteMdlComponent,
  ],
})
export class ProcessModule {}
