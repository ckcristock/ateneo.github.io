import { DatePipe, NgIf, NgClass, NgFor, NgStyle, LowerCasePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { QueryPatient } from '../../agendamiento/query-patient.service';
import { ValidatorsService } from '../../ajustes/informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { LaboratoryService } from './laboratory.service';
import { Patient } from 'src/app/core/models/patient.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionButtonComponent } from '../../../shared/components/standard-components/action-button/action-button.component';
import { ActionViewComponent } from '../../../shared/components/standard-components/action-view/action-view.component';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeaderButtonComponent } from '../../../shared/components/standard-components/header-button/header-button.component';
import { AddButtonComponent } from '../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'undefined-laboratory',
  templateUrl: './laboratory.component.html',
  styleUrls: ['./laboratory.component.css'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    HeaderButtonComponent,
    MatExpansionModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    TableComponent,
    NgIf,
    NgClass,
    DropdownActionsComponent,
    ActionViewComponent,
    ActionButtonComponent,
    ActionDeactivateComponent,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    NgStyle,
    TextFieldModule,
    NotDataComponent,
    LowerCasePipe,
    DatePipe,
  ],
})
export class LaboratoryComponent implements OnInit {
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
  matPanel = false;
  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });
  openClose() {
    if (this.matPanel == false) {
      this.firstAccordion.openAll();
      this.matPanel = true;
    } else {
      this.firstAccordion.closeAll();
      this.matPanel = false;
    }
  }
  matPanel2 = false;
  openClose2() {
    if (this.matPanel2 == false) {
      this.secondAccordion.openAll();
      this.matPanel2 = true;
    } else {
      this.secondAccordion.closeAll();
      this.matPanel2 = false;
    }
  }
  @ViewChild('fileInput') fileInput: ElementRef;
  datePipe = new DatePipe('es-CO');
  today = new Date().toTimeString().slice(0, 5);
  date: any;
  formTomarExamen: UntypedFormGroup;
  formAsignarTubos: UntypedFormGroup;
  formAnular: UntypedFormGroup;
  formCargar: UntypedFormGroup;
  formSearch: UntypedFormGroup;
  laboratorios: any[] = [];
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  filtros: any = {
    fecha: '',
    paciente: '',
    eps: '',
    ciudad: '',
    estado: '',
  };
  loading: boolean;
  loadingTubes: boolean;

  fileString: any = '';
  type: any = '';
  file: any = '';
  closeResult = '';
  motivos: any[] = [];
  tubes: any[] = [];
  ips: any;
  public existPtientForShow: boolean = false;
  public patient;
  public getDate;

  constructor(
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private _laboratory: LaboratoryService,
    private _swal: SwalService,
    private _validatorsService: ValidatorsService,
    private _queryPatient: QueryPatient,
    private _router: Router,
    private _user: UserService,
  ) {
    this.ips = this._user.user.person.company_worked.id;
    this.filtros.company_id = this.ips;
    this.filtros.person_id = this._user.user.person.id;
  }
  ngOnInit() {
    this.getMotivos();
    this.getRange();
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.selectedDate(r.start, r.end);
      }
    });
  }

  getRange() {
    let savedRangeStr = new Date();
    this.date = { begin: Date, end: Date };
    this.date.begin = savedRangeStr;
    this.date.end = savedRangeStr;
    this.filtros.fecha =
      this.datePipe.transform(this.date.begin, 'yyyy-MM-dd') +
      'a' +
      this.datePipe.transform(this.date.end, 'yyyy-MM-dd');
    this.getLaboratories();
  }

  selectedDate(start, end) {
    this.filtros.fecha =
      this.datePipe.transform(start, 'yyyy-MM-dd') +
      'a' +
      this.datePipe.transform(end, 'yyyy-MM-dd');
    this.getLaboratories();
  }
  /* validarHora(e) {
    let h1 = e.target.value.split(':');
    let h2: any = this.today.split(':');
    let date = new Date(0, 0, 0, h1[0], h1[1], 0);
    let date2 = new Date(0, 0, 0, h2[0], h2[1], 0);
    if (
      date.getTime() > date2.getTime() ||
      date.getTime() - date2.getTime() < -3600000
    ) {
      this._swal.show({
        icon: 'error',
        title: 'Error en la hora',
        showCancel: false,
        text: 'Puedes seleccionar máximo una hora antes y no puedes elegir una hora futura',
      });
      this.today = new Date().toTimeString().slice(0, 5);
      this.formTomarExamen.controls['hour'].setValue(this.today);
    }
  } */
  createFormTomarExamen(id) {
    /* this.today = new Date().toTimeString().slice(0, 5); */
    this.formTomarExamen = this.fb.group({
      id: [id],
      hours: [],
    });
  }
  createFormAsignarTubos(id) {
    this.formAsignarTubos = this.fb.group({
      id: [id],
      tube: [],
    });
  }

  changeAnountTubes(id, event) {
    let num = this.tubesArray.find((x) => x.color_id == id);
    let index = this.tubesArray.indexOf(num);
    this.tubesArray[index].amount = event.target.value;
  }

  tubesArray: any[] = [];

  getTubeId(id) {
    this.loadingTubes = true;
    this._laboratory.getTubeId(id).subscribe((res: any) => {
      this.tubes = Object.values(res.data);
      this.loadingTubes = false;
      for (let i in this.tubes) {
        this.tubesArray.push({
          id_laboratory: id,
          color_id: this.tubes[i].id,
          amount: 1,
        });
      }
      console.log(this.tubesArray);
    });
  }

  newCall(form) {
    //console.log(form)
    let id: number = form.form.value.Identificacion_Paciente;
    this._router.navigate(['gestion-riesgo/laboratorio/nuevo-laboratorio']);
    this._laboratory.newCall(form).subscribe((req: any) => {
      if (req.code == 200) {
        let data = req.data;
        //console.log(data.paciente)

        if (req.data.isNew) {
          data = this.newPatient(data, req);
        }
        this.patient = data;
        this._queryPatient.patient.next(data);
        this.existPtientForShow = true;
        clearInterval(this.getDate);
      }
    });
  }

  newPatient(data, req) {
    data.paciente = new Patient();
    data.paciente.identifier = req.data.llamada.Identificacion_Paciente;

    data.paciente.isNew = true;
    return data;
  }

  getMotivos() {
    this._laboratory.getMotivos().subscribe((res: any) => {
      this.motivos = res.data;
    });
  }

  createFormAnular(id) {
    this.formAnular = this.fb.group({
      id: [id],
      motivo_id: ['', this._validatorsService.required],
      observations: ['', this._validatorsService.required],
      status: [],
    });
  }

  tomar() {
    //this.formTomarExamen.get('status').setValue('Tomado');
    this._laboratory.asignarHoras(this.hours).subscribe((res: any) => {
      this.modalService.dismissAll();
      this.getLaboratories();
      this._swal.show({
        icon: 'success',
        title: 'Tomado con éxito',
        showCancel: false,
        text: '',
      });
    });
  }

  allTubes: any[] = [];
  loadingTubesHour: boolean;
  hours: any[] = [];
  getAllTubes(id) {
    this.loadingTubesHour = true;
    this._laboratory.getAllTubes(id).subscribe((res: any) => {
      this.allTubes = res.data;
      for (let i in this.allTubes) {
        if (this.allTubes[i].hour) {
          this.hours.push({
            id_lab: id,
            id: this.allTubes[i].id,
            hour: this.allTubes[i].hour.slice(0, 5),
          });
        } else {
          this.hours.push({
            id_lab: id,
            id: this.allTubes[i].id,
            hour: this.allTubes[i].hour,
          });
        }
      }
      console.log(this.hours);
      this.loadingTubesHour = false;
    });
  }

  asignarTubosLab() {
    this.formAsignarTubos.patchValue({ tube: this.tubesArray });
    this._laboratory.asignarTubos(this.formAsignarTubos.value).subscribe((res: any) => {
      this.modalService.dismissAll();
      this.tubesArray = [];
      this.getLaboratories();
      this._swal.show({
        icon: 'success',
        title: 'Tubos asignados con éxito',
        showCancel: false,
        text: '',
      });
    });
  }

  onFileChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['application/pdf'];
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido',
        });
        this.formCargar.reset();
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          this.fileString = (<FileReader>event.target).result;
          const type = { ext: this.fileString };
          this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
        };
        functionsUtils.fileToBase64(file).subscribe((base64) => {
          this.file = base64;
        });
      }
    }
  }
  donwloading: boolean;
  getReport() {
    this.donwloading = true;
    this._laboratory.getReport(this.filtros).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/excel' });
      let link = document.createElement('a');
      const filename = 'reporte-dia';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();
    }),
      (error) => {
        console.log('Error downloading the file');
        this.loading = false;
      },
      () => {
        console.info('File downloaded successfully');
        this.loading = false;
      };
  }

  cambiarEstado() {
    let date = new Date().toISOString();
    this.formAnular.get('status').setValue('Anulado');
    this._laboratory.tomarOAnular(this.formAnular.value).subscribe((res: any) => {
      this.modalService.dismissAll();
      this.getLaboratories();
      this._swal.show({
        icon: 'success',
        title: 'Anulado con éxito',
        showCancel: false,
        text: '',
      });
    });
  }

  fileForDownload: any;
  downloadFiles() {
    this._laboratory.downloadFiles(this.idCup).subscribe((res: any) => {
      this.fileForDownload = Object.values(res.data);
    });

    /* .subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: "application/pdf" });
      let link = document.createElement("a");
      const filename = 'files-laboratory-ver';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.loading = false
    }),
    error => { console.log('Error downloading the file'); this.loading = false },
    () => { console.info('File downloaded successfully'); this.loading = false }; */
  }

  cupsId: any[] = [];
  loadingCforL: boolean = false;
  idCup: any;
  getCupsId(id) {
    this.idCup = id;
    this.loadingCforL = true;
    this._laboratory.getCupsId(id).subscribe((res: any) => {
      this.cupsId = res.data;
      this.loadingCforL = false;
      this.downloadFiles();
    });
  }

  createFormCargar() {
    this.formCargar = this.fb.group({
      ids: ['', this._validatorsService.required],
      file: [''],
      status: ['Subido'],
      fileupload: ['', this._validatorsService.required],
    });
  }

  public openConfirm(confirm, size) {
    this.modalService
      .open(confirm, {
        ariaLabelledBy: 'modal-basic-title',
        size: size,
        scrollable: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }
  private getDismissReason(reason: any) {
    if (this.formTomarExamen) {
      this.formTomarExamen.reset();
    }
    if (this.formAnular) {
      this.formAnular.reset();
    }
    if (this.formCargar) {
      this.formCargar.reset();
      this.file = '';
    }
    this.cupsId = [];
    this.hours = [];
  }

  mail: any = 'a@a.com';
  enviarCorreo(mail) {
    this.mail = mail;
  }

  getLaboratories() {
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this.loading = true;
    this._laboratory.getLaboratories(params).subscribe((res: any) => {
      this.laboratorios = res.data.data;
      this.laboratorios.map((laboratory: any[]) => {
        laboratory['files'] = 'Completo';
        laboratory['cup'].map((cup: any) => {
          if (cup['state'] == 'Pendiente') {
            laboratory['files'] = 'Incompleto';
          }
        });
        //console.log(laboratory);
      });

      this.loading = false;
      this.pagination.length = res.data.total;
    });
  }

  cargarDocumento() {
    let file = this.fileString;
    let type = this.type;
    this.formCargar.patchValue({
      file,
      type,
    });
    this.formCargar.get('ids') as UntypedFormArray;
    this._laboratory.cargarDocumento(this.formCargar.value).subscribe((res: any) => {
      this.modalService.dismissAll();
      this.getLaboratories();
      this._swal.show({
        icon: 'success',
        title: 'Documento agregado con éxito',
        showCancel: false,
        text: '',
        timer: 1000,
      });
    });
  }

  download(id) {
    this._laboratory.download(id).subscribe((res: any) => {
      var fili = res.data + res.code;
      let pdfWindow = window.open('');
      pdfWindow.document.write(
        "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
          encodeURI(res.code) +
          "'></iframe>",
      );
    });
  }

  deleteDocument(id) {
    this._laboratory.deleteDocument(id).subscribe((res: any) => {
      this.getCupsId(this.idCup);
      this.getLaboratories();
    });
  }
}
