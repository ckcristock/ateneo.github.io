import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AutocompleteFcComponent } from '@app/components/autocomplete-fc/autocomplete-fc.component';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotasContablesService } from '../../notas-contables/notas-contables.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-sharedform',
  standalone: true,
  imports: [
    AutocompleteFcComponent,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TextFieldModule,
  ],
  templateUrl: './sharedform.component.html',
  styleUrl: './sharedform.component.scss',
})
export class SharedformComponent implements OnInit, AfterViewInit {
  @Input() Centro_Costo!: any;
  @Input() Cliente!: any;
  @Input() formControls: FormControl[] = [];
  @Input() tipo: string = '';
  @Output() codigoCabecera = new EventEmitter();

  constructor(
    private _general: NotasContablesService,
    private http: HttpClient,
  ) {}
  ngAfterViewInit(): void {
    console.log('Centro_Costo', this.Centro_Costo);
  }

  ngOnInit(): void {}

  getFormControl(nombre: string): FormControl | undefined {
    return this.formControls[nombre];
  }

  loquesea(value) {
    this.codigoCabecera.emit(value);
  }

  getCodigoCabecera(fecha?: string) {
    let datos: any = { Tipo: this.tipo };

    if (fecha != undefined && fecha != null) {
      datos.Fecha = fecha;
    }

    this.http
      .get(environment.base_url + '/php/comprobantes/get_codigo.php', { params: datos })
      .subscribe((data: any) => {
        this.codigoCabecera.emit(data.consecutivo);
      });
  }

  tabular(event, ele) {
    this._general.tabular(event, ele);
  }

  ////reactivar
  // getErrorMessage(fieldName: string) {
  //   if (this.form.get(fieldName).hasError('required')) {
  //     return 'Campo requerido';
  //   } else null;
  // }
}

