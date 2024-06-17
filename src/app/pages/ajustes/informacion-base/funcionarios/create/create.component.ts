import { Component, OnInit, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { DotacionTallasComponent } from './dotacion-tallas/dotacion-tallas.component';
import { PrestacionesSocialesComponent } from './prestaciones-sociales/prestaciones-sociales.component';
import { InformacionEmpresaComponent } from './informacion-empresa/informacion-empresa.component';
import { DatosFuncionarioComponent } from './datos-funcionario/datos-funcionario.component';
import { PersonDataService } from './personData.service';
import { PermissionsComponent } from '../detalle-funcionario/permissions/permissions.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: true,
  imports: [
    DatosFuncionarioComponent,
    InformacionEmpresaComponent,
    PrestacionesSocialesComponent,
    DotacionTallasComponent,
    PermissionsComponent,
    CardComponent,
    MatStepperModule,
  ],
})
export class CreateComponent implements OnInit {
  $person: Subscription;
  person: any = {};
  @ViewChild(MatStepper) stepper: MatStepper;

  isOfficerCompleted = false;
  isCompanyCompleted = false;
  isBenefitsCompleted = false;
  isEndowmentCompleted = false;

  constructor(private _personData: PersonDataService) {}

  ngOnInit(): void {
    this.$person = this._personData.person.subscribe((r) => {
      this.person = r;
    });
  }

  ngOnDestroy(): void {
    this.$person.unsubscribe();
  }

  nextStepper(varStepName: string) {
    this[varStepName] = true;
    setTimeout(() => {
      this.stepper.next();
    });
  }

  previousStepper() {
    this.stepper.previous();
  }
}
