import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { TipificationService } from '../../../../core/services/tipification.service';
import { Subscription } from 'rxjs';
import { QueryPatient } from '../../query-patient.service';
import Swal from 'sweetalert2';
import { AnotherFormalityService } from '../../antother-formality.service';

@Component({
  selector: 'app-otro-concepto',
  templateUrl: './otro-concepto.component.html',
  styleUrls: ['./otro-concepto.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class OtroConceptoComponent implements OnInit {
  $tramiteData: Subscription;
  tramiteData: any = {};
  tramiteSelected: any;
  $tramiteSelected: Subscription;
  call: any;
  $patient: Subscription;

  constructor(
    private _tipification: TipificationService,
    private _queryPatient: QueryPatient,
    private _another: AnotherFormalityService,
  ) {}
  ngOnInit(): void {
    this.$tramiteData = this._queryPatient.tipificationData.subscribe((r) => {
      this.tramiteData = r;
    });
    this.$tramiteSelected = this._queryPatient.tramiteSelected.subscribe((r) => {
      this.tramiteSelected = r;
    });
    this.$patient = this._queryPatient.patient.subscribe((r) => (this.call = r.llamada));
  }

  OnDestroy() {
    this.$tramiteData.unsubscribe();
    this.$tramiteSelected.unsubscribe();
    this.$patient.unsubscribe();
  }
  save(form: NgForm) {
    try {
      this._queryPatient.validateTipification({
        component: this.tramiteSelected,
        data: this.tramiteData,
      });
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success mx-2',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: '¿está seguro?',
          text: 'Se dispone a Guardar el trámite',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, ¡cancelar !',
          cancelButtonText: 'No, ¡dejeme comprobar!',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this._another.save(form.value).subscribe(
              (r) => {
                Swal.fire('Operación con éxito', 'Se ha guardado exitosamente', 'success').then(
                  (r) => {
                    this.clean();
                  },
                );
              },
              (error) => {
                Swal.fire('Error ', 'Ha ocurrido un error', 'error');
              },
            );
          }
        });
    } catch (error) {
      Swal.fire('Faltan datos del proceso ', error, 'error');
    }
  }

  clean() {
    this._queryPatient.existPatient.next('');
    this._queryPatient.resetModels();
  }
}
