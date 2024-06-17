import { DatePipe, NgIf, NgClass, NgStyle, NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TexteditorService } from '../../ajustes/informacion-base/services/texteditor.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { TaskService } from 'src/app/core/services/task.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  standalone: true,
  imports: [
    CKEditorModule,
    NgIf,
    NgClass,
    NgStyle,
    RouterLink,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    NotDataComponent,
    UpperCasePipe,
    DatePipe,
  ],
})
export class TaskViewComponent implements OnInit, OnDestroy {
  person_id: any;
  estado: any;
  id_task: any;
  task_data: any;
  date: any;
  fechaActual: any;
  horaActual: any;
  form_comment!: FormGroup;
  datePipe = new DatePipe('es-CO');
  loading!: boolean;
  tasks: any[] = [];
  timeInterval!: Subscription;

  constructor(
    private _task: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private _user: UserService,
    private sanitizer: DomSanitizer,
    private _texteditor: TexteditorService,
    private _swal: SwalService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.person_id = this._user.user.person.id;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id_task = params.get('id');
      this.taskView();
      this.getTask();
    });
    this.createForm();
    this.date = Date();
    this.fechaActual = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.horaActual = this.datePipe.transform(this.date, 'hh:mm a');
  }

  ngOnDestroy(): void {
    this.timeInterval.unsubscribe();
  }

  getTask() {
    let params = {
      person_id: this.person_id,
      except: this.id_task,
      max: 5,
    };
    this._task.personTasks(params).subscribe((res: any) => {
      this.tasks = res.data;
    });
  }

  taskView() {
    this.loading = true;
    this._task.taskView(this.id_task).subscribe((d: any) => {
      if (d.data.id_realizador == this.person_id || d.data.id_asignador == this.person_id) {
        this.task_data = d.data;
        this.loading = false;
        this.task_data.descripcion = this.sanitizer.bypassSecurityTrustHtml(
          atob(this.task_data.descripcion),
        );
        var r = this.datePipe.transform(
          this.task_data.fecha + ' ' + this.task_data.hora,
          'hh:mm a',
        );
        if (this.fechaActual + ' ' + this.horaActual < this.task_data.fecha + ' ' + r) {
          this.estado = 'Activa';
        } else {
          this.estado = 'Vencida';
        }
        this.sanitize(this.task_data.comment);
      }
      this.updateComments();
    });
  }

  updateComments() {
    let params = {
      id: this.id_task,
    };
    this.timeInterval = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this._task.updateComments(params)),
      )
      .subscribe((res: any) => {
        this.task_data.comment = res.data;
        this.sanitize(this.task_data.comment);
      });
  }

  createForm() {
    this.form_comment = this.fb.group({
      person_id: [''],
      comment_temp: ['', Validators.required],
      comment: ['', Validators.required],
      fecha: [''],
      task_id: [''],
    });
  }

  saveComment() {
    var fecha = Date();
    fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd HH:mm:ss') ?? '';
    this.form_comment.patchValue({
      person_id: this.person_id,
      date: fecha,
      comment: btoa(this.form_comment.value.comment_temp),
      task_id: this.id_task,
    });
    this._task.newComment(this.form_comment.value).subscribe((res: any) => {
      this.form_comment.reset();
      this.task_data.comment = res.data;
      this.sanitize(this.task_data.comment);
    });
  }

  deleteComment(commentId: any) {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: 'No podrás recuperar este comentario si lo eliminas',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._task.deleteComment(commentId).subscribe((d: any) => {
            this.task_data.comment = d.data;
            this.sanitize(this.task_data.comment);
          });
        }
      });
  }

  sanitize(data: any) {
    for (let i in data) {
      data[i].comment = this.sanitizer.bypassSecurityTrustHtml(atob(data[i].comment));
      if (data[i].person_id == this.person_id) {
        data[i].deleted = true;
      } else {
        data[i].deleted = false;
      }
    }
  }

  archivar() {
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text: 'Vamos a archivar esta tarea',
      })
      .then((result) => {
        if (result.isConfirmed) {
          let params = {
            id: this.id_task,
            status: 'Archivada',
          };
          this._task.statusUpdate(params).subscribe((res: any) => {
            this._swal.show({
              icon: 'success',
              title: 'Operación exitosa',
              showCancel: false,
              text: 'Tarea archivada',
              timer: 1000,
            });
            this.taskView();
          });
        }
      });
  }
}
