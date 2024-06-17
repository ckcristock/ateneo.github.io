import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../../services/reactive-validation/validators.service';
import { SwalService } from '../../../services/swal.service';
import { RotatingTurnService } from '../rotating-turn.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-create-turno-rotativo',
  templateUrl: './create-turno-rotativo.component.html',
  styleUrls: ['./create-turno-rotativo.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
  ],
})
export class CreateTurnoRotativoComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @Input('openModal') openModal: EventEmitter<any>;
  @Output('saved') saved = new EventEmitter<any>();

  turns: any[];
  forma: UntypedFormGroup;
  show = false;

  constructor(
    private fb: UntypedFormBuilder,
    private _valReactive: ValidatorsService,
    private _rotatingT: RotatingTurnService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getAll();
    this.createForm();

    this.colorHex();
    this.openModal.subscribe((id) => {
      this.createForm();
      this.crearListeners();
      if (id) {
        this.getTur(id);
      }
      this.show = true;
      //this.modal.show();
      this.openConfirm(this.modal);
    });
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true })
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
  getAll() {
    this._rotatingT.getAllCreate().subscribe((r: any) => {
      this.turns = r.data;
      this.turns.unshift({ text: 'Descanso', value: 0 });
    });
  }
  getTur(id) {
    this._rotatingT.getTurn(id).subscribe((r: any) => {
      let turn = r.data;
      this.forma.patchValue({
        name: turn.name,
        entry_tolerance: turn.entry_tolerance,
        leave_tolerance: turn.leave_tolerance,
        extra_hours: turn.extra_hours,
        entry_time: turn.entry_time,
        leave_time: turn.leave_time,
        launch: turn.launch,
        launch_time: turn.launch_time,
        launch_time_two: turn.launch_time_two,
        breack: turn.breack,
        breack_time: turn.breack_time,
        breack_time_two: turn.breack_time_two,
        saturday_id: turn.saturday_id,
        sunday_id: turn.sunday_id,
        id: turn.id,
      });
    });
  }
  createForm() {
    this.forma = this.fb.group({
      name: ['', [this._valReactive.required, this._valReactive.minLength(5)]],
      entry_tolerance: [0, this._valReactive.required],
      leave_tolerance: [0, this._valReactive.required],
      extra_hours: [0],
      entry_time: ['', this._valReactive.required],
      leave_time: ['', this._valReactive.required],
      launch: [0],
      launch_time: [0, this._valReactive.required],
      launch_time_two: [0, this._valReactive.required],
      breack: [0],
      color: [this.colorHex()],
      breack_time: ['', this._valReactive.required],
      breack_time_two: ['', this._valReactive.required],
      saturday_id: [0],
      sunday_id: [0],
      id: [0],
    });
    this.forma.get('launch_time').disable();
    this.forma.get('launch_time_two').disable();
    this.forma.get('breack_time').disable();
    this.forma.get('breack_time_two').disable();
  }
  crearListeners() {
    this.forma.get('launch').valueChanges.subscribe((valor) => {
      if (!valor) {
        this.forma.get('launch_time').disable();
        this.forma.get('launch_time_two').disable();
      } else {
        this.forma.get('launch_time').enable();
        this.forma.get('launch_time_two').enable();
      }
    });

    this.forma.get('breack').valueChanges.subscribe((valor) => {
      let control = this.forma.get('breack_time');
      !valor ? control.disable() : control.enable();
      if (!valor) {
        this.forma.get('breack_time').disable();
        this.forma.get('breack_time_two').disable();
      } else {
        this.forma.get('breack_time').enable();
        this.forma.get('breack_time_two').enable();
      }
    });
  }

  generateLetters() {
    let letters = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let number = (Math.random() * 15).toFixed(0);
    return letters[number];
  }

  colorHex() {
    let color = '';
    for (let i = 0; i < 6; i++) {
      color = color + this.generateLetters();
    }
    return '#' + color;
  }

  save() {
    this.forma.markAllAsTouched();
    if (this.forma.invalid) {
      return false;
    }
    this._swal
      .show({
        title: '¿Está seguro?',
        text: 'Se va a crear/actualizar el turno rotativo',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          let id = this.forma.get('id').value;
          if (id) {
            this._rotatingT.update(id, this.forma.value).subscribe((r: any) => {
              this.response(r);
            });
          } else {
            this._rotatingT.save(this.forma.value).subscribe((r: any) => {
              this.response(r);
            });
          }
        }
      });
  }

  response(r: any) {
    if (r.code == 200) {
      this._swal.show({
        title: 'Operación exitosa',
        text: 'Se ha guardado correctamente el turno',
        icon: 'success',
        showCancel: false,
        timer: 1000,
      });
      this.modalService.dismissAll();
      this.saved.emit();
    } else {
      this._swal.show({
        title: 'Ha ocurrido un error',
        text: 'Comuníquese con el departamento de sistema',
        icon: 'error',
        showCancel: false,
      });
    }
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
  get invalid_extra_hours() {
    return this.forma.get('extra_hours').invalid && this.forma.get('extra_hours').touched;
  }
  get invalid_entry_time() {
    return this.forma.get('entry_time').invalid && this.forma.get('entry_time').touched;
  }
  get invalid_leave_time() {
    return this.forma.get('leave_time').invalid && this.forma.get('leave_time').touched;
  }
}
