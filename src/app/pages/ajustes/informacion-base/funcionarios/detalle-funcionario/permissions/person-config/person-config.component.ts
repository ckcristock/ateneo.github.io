import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { BodyPersonConfig, DetalleService, PersonConfig } from '../../detalle.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-person-config',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatFormFieldModule, MatSelectModule],
  templateUrl: './person-config.component.html',
  styleUrl: './person-config.component.scss',
})
export class PersonConfigComponent {
  @Input('personId') personId!: number;

  formPerson = new FormGroup({
    folderId: new FormControl(),
    boardId: new FormControl(),
    companiesId: new FormControl(),
    pointId: new FormControl(),
  });

  personConfigData: PersonConfig = {} as PersonConfig;

  constructor(
    private readonly detalleService: DetalleService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.getPersonConfig();
  }

  getPersonConfig() {
    this.detalleService.getPersonConfig(this.personId).subscribe({
      next: (res) => {
        this.personConfigData = res.data;
        this.formPerson.patchValue(this.personConfigData);
      },
    });
  }

  putPersonConfig() {
    const request = () => {
      this.detalleService
        .putPersonConfig(this.formPerson.value as BodyPersonConfig, this.personId)
        .subscribe({
          next: () => {
            this.swalService.show({
              icon: 'success',
              title: 'Correcto',
              text: 'Tablero asignado con éxito',
              showCancel: false,
              timer: 3000,
            });
          },
        });
    };
    this.swalService.swalLoading('', request);
  }
}
