import { Routes } from '@angular/router';
import { CrearContratosComponent } from './crear-contratos/crear-contratos.component';
import { ListContractsComponent } from './list-contracts/list-contracts.component';

export const routes: Routes = [
  { path: '', component: ListContractsComponent },
  { path: 'edit-contract/:id', component: CrearContratosComponent },
  { path: 'create-contract', component: CrearContratosComponent },
];
