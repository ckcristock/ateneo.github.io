import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, Location, UpperCasePipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ActaRecepcionService } from '../../acta-recepcion.service';
import { environment } from 'src/environments/environment';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';
import { HttpHeaders } from '@angular/common/http';
import { downloadFile } from '@shared/functions/download-pdf.function';

@Component({
  selector: 'app-actas-ingresadas',
  standalone: true,
  imports: [
    CardComponent,
    TableComponent,
    RouterModule,
    DropdownActionsComponent,
    ActionViewComponent,
    ActionButtonComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    DatePipe,
    UpperCasePipe,
    DatePickerComponent,
  ],
  templateUrl: './actas-ingresadas.component.html',
  styleUrl: './actas-ingresadas.component.scss',
})
export class ActasIngresadasComponent implements OnInit {
  @Input() companyWorkedId!: any;
  datePipe = new DatePipe('es-CO');
  public Cargando: boolean = false;
  public actarecepciones: any = [];
  public funcionario = { Identificacion_Funcionario: '1' };
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  public filtro_cod: string = '';
  public filtro_fact: string = '';
  public filtro_fecha: any = '';
  public filtro_fecha2: any = '';
  public filtro_proveedor: any = '';
  public filtro_compra: any = '';
  public filtro_Codigo: any = '';
  public filtro_Proveedor: any = '';
  downloading = -1;

  constructor(
    private route: ActivatedRoute,
    private _actaRecepcion: ActaRecepcionService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.getActasIngresadas();
  }

  selectedDate(dates: DatePicker, isPurchase?: boolean) {
    const varName = 'filtro_fecha' + (isPurchase ? '2' : '');
    if (dates.start_date && dates.end_date)
      this[varName] = `${dates.start_date} - ${dates.end_date}`;
    else this[varName] = '';
    this.getActasIngresadas();
  }

  getActasIngresadas() {
    this.Cargando = true;
    const params = {
      estado: 'Acomodada',
      tipo: 'General',
      company_id: this.companyWorkedId,
      cod: this.filtro_cod,
      fecha: this.filtro_fecha,
      fact: this.filtro_fact,
      fecha2: this.filtro_fecha2,
      proveedor: this.filtro_proveedor,
      compra: this.filtro_compra,
      ...this.pagination,
    };
    this._actaRecepcion.getActasIngresadas(params).subscribe((data: any) => {
      this.actarecepciones = data.data.data;
      this.pagination.length = data.data.total;
      this.Cargando = false;
    });
  }

  verContabilidad(item, tipo, index: number) {
    let tipoCont = tipo == 'NIF' ? 'Niif' : '';
    let archivo = '';

    this.downloading = index;

    if (item.Tipo_Acomodar == 'Acta_Recepcion') {
      archivo = 'movimientos_acta_recepcion_pdf.php';
    } else if (item.Tipo_Acomodar == 'Ajuste_Individual') {
      archivo = 'movimientos_ajuste_individual_pdf.php';
    } else if (item.Tipo_Acomodar == 'Nota_Credito') {
      archivo = 'movimientos_nota_credito_pdf.php';
    }
    const params = {
      id_registro: item.Id_Acta,
      id_funcionario_elabora: this.funcionario.Identificacion_Funcionario,
      tipo_valor: tipoCont,
    };
    // let ruta = `${environment.ruta}php/contabilidad/movimientoscontables/${archivo}?id_registro=${item.Id_Acta}&id_funcionario_elabora=${this.funcionario.Identificacion_Funcionario}${tipoCont}`;
    this._actaRecepcion.seeAccounting(archivo, params).subscribe({
      next: (file: any) => {
        downloadFile({ name: 'contabilidad', file });
        this.downloading = -1;
      },
      error: () => {
        this.downloading = -1;
      },
    });
  }

  verActa(item) {
    switch (item.Tipo_Acomodar) {
      case 'Acta_Recepcion':
        this.router.navigate(['/inventario/acta-recepcion/ver', item.Id_Acta]);
        break;

      case 'Ajuste_Individual':
        this.router.navigate(['/ajustesinventariover', item.Id_Acta]);
        break;

      case 'Nota_Credito':
        this.router.navigate(['/notascreditover', item.Id_Acta]);
        break;

      default:
        break;
    }
  }
}
