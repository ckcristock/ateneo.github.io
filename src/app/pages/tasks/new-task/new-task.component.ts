import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserService } from 'src/app/core/services/user.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { TaskService } from '../../../core/services/task.service';
import Swal from 'sweetalert2';
import { Texteditor2Service } from '../../ajustes/informacion-base/services/texteditor2.service';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
  standalone: true,
  imports: [
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
  ],
})
export class NewTaskComponent implements OnInit {
  @ViewChild('newtask') newtask;
  @Input() open: Observable<any> = new Observable();
  @Input() category: any;
  @Input() business_id: any = '';
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  private _suscription: any;
  fileString: any = '';
  type: any = '';
  types: any[] = [];
  form: FormGroup;
  people: any[] = [];
  company_id: number;
  constructor(
    private _modal: ModalService,
    public _task: TaskService,
    private fb: FormBuilder,
    private _texteditor: Texteditor2Service,
    private _user: UserService,
    private _swal: SwalService,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  openInit() {
    this.company_id = this._user.user.person.company_worked.id;
    this.getPeople();
    this.getTypes();
    this.createForm();
    this._modal.open(this.newtask, 'xl');
  }

  getPeople() {
    this._task.personCompany(this.company_id).subscribe((res: any) => {
      this.people = res.data;
    });
  }

  getTypes() {
    this._task.getTypes().subscribe((res: any) => {
      this.types = res.data;
    });
  }

  createForm() {
    this.form = this.fb.group({
      id_realizador: [null, Validators.required],
      type_id: ['', Validators.required],
      titulo: ['', Validators.required],
      descripcion: [''],
      descripcion_aux: ['', Validators.required],
      fecha: ['', Validators.required],
      link: [''],
      id_asignador: this._user.user.person.id,
      hora: ['', Validators.required],
      business_id: [this.business_id],
      category: [this.category],
      files: this.fb.array([]),
    });
  }

  get files() {
    return this.form.get('files') as FormArray;
  }

  deleteFiles(i) {
    this.files.removeAt(i);
  }

  onFileChanged(event) {
    const files = Array.from(event.target.files);
    console.log(files);
    if (files.length > 0) {
      files.forEach((file: any, index) => {
        const types = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
        if (!types.includes(file.type)) {
          this._swal.show({
            icon: 'error',
            title: 'Error de archivo',
            showCancel: false,
            text: 'El tipo de archivo no es válido',
          });
          return null;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          this.fileString = (<FileReader>event.target).result;
          const type = { ext: this.fileString };
          this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
        };
        functionsUtils.fileToBase64(file).subscribe((base64) => {
          this.files.push(
            this.fb.group({
              id: index,
              name: file.name,
              type: this.type,
              base64: base64,
            }),
          );
        });
      });
    }
  }
  disabledButton: boolean = false;
  save() {
    if (this.form.valid) {
      this._swal
        .show({
          icon: 'question',
          title: '¿Estás seguro(a)?',
          text: 'Vamos a agregar una nueva tarea.',
        })
        .then((r) => {
          if (r.isConfirmed) {
            this.disabledButton = true;
            this.form.patchValue({
              descripcion: btoa(this.form.value.descripcion_aux),
              id_asignador: this._user.user.person.id,
              link: this.form.value.link ? this.router.url : '',
            });
            this._task.save(this.form.value).subscribe(
              (res: any) => {
                if (res.status) {
                  this._modal.close();
                  this.form.reset();
                  this.createForm();
                  this.refresh.emit();
                  Swal.fire({
                    title: res.data,
                    text: '¿Deseas ir a la tarea?',
                    showDenyButton: true,
                    icon: 'success',
                    confirmButtonText: 'Sí',
                    confirmButtonColor: '#A3BD30',
                    denyButtonText: `No`,
                    denyButtonColor: '#d33',
                    reverseButtons: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.router.navigate(['/task', res.code]);
                    }
                  });
                }
              },
              (error) => {
                this._swal.hardError();
                this.disabledButton = false;
              },
            );
          }
        });
    } else {
      this._swal.incompleteError();
    }
  }
}
