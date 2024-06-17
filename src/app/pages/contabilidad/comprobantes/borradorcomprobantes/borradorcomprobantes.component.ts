import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-borradorcomprobantes',
  templateUrl: './borradorcomprobantes.component.html',
  styleUrls: ['./borradorcomprobantes.component.scss'],
  standalone: true,
  imports: [FormsModule, NgFor],
})
export class BorradorcomprobantesComponent implements OnInit {
  @Input() Tipo_Comprobante: any = '';
  @Output() Borrador: EventEmitter<any> = new EventEmitter();
  // Identificacion_Funcionario: any = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
  borradores: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.listaBorradores();
  }

  listaBorradores() {
    let p: any = {
      Tipo_Comprobante: this.Tipo_Comprobante,
      // Identificacion_Funcionario: this.Identificacion_Funcionario
    };

    this.http
      .get(environment.ruta + 'php/contabilidad/lista_borrador_contable.php', { params: p })
      .subscribe((data: any) => {
        this.borradores = data;
      });
  }

  sendDatosBorrador(id_borrador) {
    if (id_borrador != '') {
      this.http
        .get(environment.ruta + 'php/contabilidad/detalles_borrador_contable.php', {
          params: { id: id_borrador },
        })
        .subscribe((data: any) => {
          this.Borrador.emit(data);
        });
    } else {
      this.Borrador.emit('clean');
    }
  }
}
