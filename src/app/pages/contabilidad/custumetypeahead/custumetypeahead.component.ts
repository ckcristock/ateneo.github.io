import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CustometypeaheadService } from './custometypeahead.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-custumetypeahead',
  templateUrl: './custumetypeahead.component.html',
  styleUrls: ['./custumetypeahead.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, NgbTypeahead],
})
export class CustumetypeaheadComponent implements OnInit {
  @Input() Modelo;
  @Input() Ruta;
  @Input() Campo;
  @Input() label;
  @Output() RetornarId: EventEmitter<string> = new EventEmitter<string>();
  public Model: any = '';
  public Id: any = '';
  datos: any[] = [];

  constructor(
    private _custome: CustometypeaheadService,
    private swalService: SwalService,
    private http: HttpClient,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.Campo.currentValue != undefined) {
      this.Model = changes.Campo.currentValue;
      this.datosObtenidos();
    }
  }

  ngOnInit() {}

  search_tercero = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.datos
              .filter((v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    );

  formatter_tercero = (x: { Nombre: string }) => x.Nombre;

  datosObtenidos() {
    this.Filtrar().subscribe((data: any) => {
      this.datos = data;
    });
  }

  Filtrar(): Observable<any> {
    // let p = {coincidencia:match};
    return this.http.get(environment.base_url + this.Ruta);
  }

  AsignarId() {
    if (typeof this.Model == 'object') {
      this.Id = this.Model.Id;
    } else {
      this.Id = '';
    }
    this.RetornarId.emit(this.Id);
  }

  validarCampo(campo, event, tipo) {
    // Funcion que validará los campos de typeahead
    if (typeof campo != 'object' && campo != '') {
      //  let id = event.target.id;
      this.swalService.show({
        icon: 'error',
        title: '¡Error!',
        text: `El valor ${tipo} no es valido.`,
        showCancel: false,
      });
      this.Model = '';
      //  this.swalService.ShowMessage(swal);
    }
  }
}
