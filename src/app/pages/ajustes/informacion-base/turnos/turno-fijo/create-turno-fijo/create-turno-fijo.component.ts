import { Component, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../../services/reactive-validation/validators.service';
import { SwalService } from '../../../services/swal.service';
import { FixedTurnService } from '../turno-fijo.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-create-turno-fijo',
  templateUrl: './create-turno-fijo.component.html',
  styleUrls: ['./create-turno-fijo.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    NgClass,
  ],
})
export class CreateTurnoFijoComponent implements OnInit {
  forma: UntypedFormGroup;
  miniForm: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private _valReactive: ValidatorsService,
    private _fixedTurn: FixedTurnService,
    private _swal: SwalService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) {}
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }
  private getDismissReason(reason: any) {}

  week = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  id = '';
  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    if (this.id) {
      this.getTurn();
    }
    this.createForma();
    this.createFormaForAll();
  }

  getTurn() {
    this._fixedTurn.getFixedTurn(this.id).subscribe((r: any) => {
      this.forma.patchValue({
        name: r.data.name,
        entry_tolerance: r.data.entry_tolerance,
        leave_tolerance: r.data.leave_tolerance,
        extra_hours: r.data.extra_hours,
      });

      let days = this.reduceDays(r.data.horarios_turno_fijo);
      this.dayList.controls.forEach((element) => {
        let day = element.get('day').value;
        if (days[day]?.entry_time_one && days[day]?.entry_time_two) {
          element.patchValue({
            entry_time_one: days[day]['entry_time_one'],
            entry_time_two: days[day]['entry_time_two'],
            leave_time_one: days[day]['leave_time_one'],
            leave_time_two: days[day]['leave_time_two'],
          });
        }
      });
    });
  }
  reduceDays(days: Array<any>) {
    return days.reduce((acc, el) => ({ ...acc, [el.day]: el }), {});
  }
  save() {
    this.forma.markAllAsTouched();
    if (this.forma.invalid) return false;
    this._swal
      .show({
        title: this.id == undefined ? '¿Desea guardar?' : '¿Desea actulizar?',
        text:
          this.id == undefined ? 'Vamos a guardar el nuevo turno' : 'Vamos a actualizar el turno',
        icon: 'question',
        showCancel: true,
      })
      .then((r) => {
        if (r.isConfirmed) {
          if (this.id) {
            this.toEdit();
          } else {
            this.toSave();
          }
        }
      });
  }
  toSave() {
    this._fixedTurn.saveTurnFixed(this.getFormValue()).subscribe((r: any) => {
      this.successfull(r.code);
    });
  }
  toEdit() {
    this._fixedTurn.updateTurnFixed(this.getFormValue(), this.id).subscribe((r: any) => {
      this.successfull(r.code);
    });
  }

  getFormValue() {
    let formValue = this.forma.value;
    formValue.days = formValue.days.reduce((acc, el) => {
      if (el.entry_time_one && el.entry_time_two) {
        return [...acc, el];
      } else {
        return acc;
      }
    }, []);
    return formValue;
  }
  successfull(code) {
    if (code == 200) {
      this._swal.show({
        title: 'Operación exitosa',
        text: 'Guardado correctamente',
        icon: 'success',
        timer: 1000,
        showCancel: false,
      });
      this.router.navigateByUrl('/ajustes/informacion-base/turnos');
    }
  }

  createForma() {
    this.forma = this.fb.group({
      name: ['', [this._valReactive.minLength(5), this._valReactive.required]],
      entry_tolerance: ['', [this._valReactive.required]],
      leave_tolerance: ['', this._valReactive.required],
      extra_hours: ['0', this._valReactive.required],
      days: this.fb.array([]),
    });
    let day = this.dayList;
    this.week.forEach((d) => {
      day.push(this.createItem(d));
    });
  }

  createItem(d): UntypedFormGroup {
    const required = d == 'Sabado' || d == 'Domingo' ? false : true;
    let controls: any = this.getBasicControl(required);
    controls.day = [d];
    return this.fb.group(controls);
  }

  getBasicControl(required = true) {
    return {
      entry_time_one: ['', required ? this._valReactive.required : ''],
      leave_time_one: ['', required ? this._valReactive.required : ''],
      entry_time_two: ['', required ? this._valReactive.required : ''],
      leave_time_two: ['', required ? this._valReactive.required : ''],
    };
  }

  asignarMasivamente() {
    this.miniForm.markAllAsTouched();
    if (this.miniForm.invalid) {
      return false;
    }

    this.dayList.controls.forEach((element) => {
      const day = element.get('day').value;
      if (day != 'Sabado' && day != 'Domingo') {
        element.patchValue({
          entry_time_one: this.miniForm.get('entry_time_one').value,
          leave_time_one: this.miniForm.get('leave_time_one').value,
          entry_time_two: this.miniForm.get('entry_time_two').value,
          leave_time_two: this.miniForm.get('leave_time_two').value,
        });
      }
    });

    this.modalService.dismissAll();

    /*  this.dayList. */
  }

  createFormaForAll() {
    this.miniForm = this.fb.group(this.getBasicControl());
  }

  get dayList() {
    return this.forma.get('days') as UntypedFormArray;
  }

  get invalid_name() {
    return this.forma.get('name').invalid && this.forma.get('name').touched;
  }
  get invalid_entry_tolerance() {
    return this.forma.get('entry_tolerance').invalid && this.forma.get('entry_tolerance').touched;
  }
  get invalid_leave_tolerance() {
    return this.forma.get('leave_tolerance').invalid && this.forma.get('leave_tolerance').touched;
  }
}
