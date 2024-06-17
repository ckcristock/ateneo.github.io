import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { functionsUtils } from '../../../../core/utils/functionsUtils';
import { ConsumeserviceService } from './consumeservice.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: true,
})
export class CreateComponent implements OnInit {
  // @ViewChild('confirmacionSwal') confirmacionSwal:any;
  // @ViewChild('Swal') Swal: any;

  public Cargando: boolean = true;
  public Editar: boolean = false;
  public id = this.route.snapshot.params['id'];

  public selectTipo = '';
  public Tipos: any = [
    { id: 1, name: 'Selección Simple (Si - No)' },
    { id: 2, name: 'Selección Simple (Personalizada)' },
    { id: 3, name: 'Selección Múltiple' },
    { id: 4, name: 'Respuesta Corta' },
    { id: 5, name: 'Fecha' },
    { id: 6, name: 'Telefono' },
    { id: 7, name: 'Email' },
  ];
  public Formulario: any = {
    Nombre: '',
    Descripcion: '',
  };
  public Preguntasc: any = [];
  public Preguntas: any = [];

  public Pregunta = {
    Pregunta: '',
    Valor: '',
    Tipo: '',
    Respuestas: [],
  };

  public Respuesta = {
    Res: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _consumeServise: ConsumeserviceService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    if (this.id) {
      this.AsignarValores();
    }
  }
  AsignarValores() {
    this._consumeServise.getEncuestas().subscribe((data: any) => {
      this.Cargando = false;
      this.Editar = true;
      this.Formulario = data.Encabezado[0];
      this.Preguntas = data.Preguntas;
    });
  }
  AgregarPregunta() {
    let res = {
      Pregunta: '',
      Valor: '',
      Tipo: '',
      Respuestas: [],
    };
    this.Preguntas.push(res);
  }
  AgregarRespuesta(Pregunta: any) {
    let c = {
      Res: '',
    };
    Pregunta.Respuestas.push(c);
  }

  TipoPregunta(tipo: any, Preguntas: any, item: any, i: any) {
    let P = this.Tipos.find((x: any) => x.id == tipo);
    item.Respuestas = [];

    if (tipo == 1) {
      let s = {
        Res: '',
        Respuesta: 'Si',
        Valor: 100,
      };
      let n = {
        Res: '',
        Respuesta: 'No',
        Valor: 0,
      };
      item.Respuestas.push(s, n);
    }
    if (tipo == 2) {
      let c = {
        Res: '',
      };
      item.Respuestas.push(c);
    }
    if (tipo == 3) {
      let c = {
        Res: '',
      };
      item.Respuestas.push(c);
    }
    if (tipo == 4) {
      let c = {
        Res: '',
        Respuesta: 'Respuesta Corta',
        Valor: 100,
      };
      item.Respuestas.push(c);
    }
    if (tipo == 5) {
      let c = {
        Res: '',
        Respuesta: 'Fecha',
        Valor: 100,
      };
      item.Respuestas.push(c);
    }
    if (tipo == 6) {
      let c = {
        Res: '',
        Respuesta: 'Telefono',
        Valor: 100,
      };
      item.Respuestas.push(c);
    }
    if (tipo == 7) {
      let c = {
        Res: '',
        Respuesta: 'Email',
        Valor: 100,
      };
      item.Respuestas.push(c);
    }

    return true;
  }
  ComprobarPorcentajes() {
    let valido = true;
    let procenPre = 0;

    this.Preguntas.forEach((pre: any) => {
      let procenRes = 0;

      if (pre.Tipo == 3) {
        pre.Respuestas.forEach((V: any) => {
          procenRes += +V.Valor;
        });
        if (procenRes > 100) {
          let swal = {
            codigo: 'warning',
            mensaje: 'Porcentaje de Respuesta Fuera de Rango',
            titulo: 'Porcentaje Erroneo',
          };
          // this.swalService.ShowMessage(swal);
          valido = false;
        }
      }
      procenPre += +pre.Valor;
      if (procenPre > 100) {
        let swal = {
          codigo: 'warning',
          mensaje: 'Porcentaje Fuera de Rango',
          titulo: 'Porcentaje Erroneo',
        };
        // this.swalService.ShowMessage(swal);
        valido = false;
      }
    });

    return valido;
  }
  GuardarFormulario() {
    if (this.ComprobarPorcentajes() && this.ComprobarInput()) {
      let datos = new FormData();
      datos.append('Formulario', functionsUtils.normalize(JSON.stringify(this.Formulario)));
      datos.append('Preguntas', functionsUtils.normalize(JSON.stringify(this.Preguntas)));
      this.http
        .post(
          environment.base_url + '/php/recursos_humanos/formularios/guardar_formulario.php',
          datos,
        )
        .subscribe((data: any) => {
          this.LimpiarCampos();
          // this.confirmacionSwal.title = data.Titulo;
          // this.confirmacionSwal.text = data.Mensaje;
          // this.confirmacionSwal.type = data.Tipo;
          // this.confirmacionSwal.show();
          this.router.navigate(['formulario']);
        });
    }
  }
  ComprobarInput() {
    let valido = true;

    if (this.Formulario.Nombre == '' || this.Formulario.Descripcion == '') {
      let swal = {
        codigo: 'warning',
        mensaje: 'Faltan Algunos Datos del Formulario',
        titulo: 'Faltan Datos',
      };
      // this.swalService.ShowMessage(swal);
      valido = false;
    } else {
      //   this.Preguntas.forEach((pre) => {
      //       let pregun =  pre.Pregunta;
      //       if (pregun == '' ){
      //         let swal = {
      //             codigo: 'warning',
      //             mensaje: 'Formulario sin Preguntas',
      //             titulo: 'Error Preguntas'
      //         }
      //       this.swalService.ShowMessage(swal);
      //       valido = false;
      //       }
      // });
    }

    return valido;
  }
  LimpiarCampos() {
    this.Preguntas = [];
    this.Formulario = {
      Nombre: '',
      Descripcion: '',
    };
  }
  EstadoPregunta(item: any) {
    let id = item.Id_Pregunta_Formulario;
    let estado = item.Estado;
    this.http
      .get(environment.base_url + '/php/recursos_humanos/formularios/anular_pregunta.php', {
        params: { id: id, estado: estado },
      })
      .subscribe((data: any) => {
        this.AsignarValores();
      });
  }
  EstadoRespuesta(item: any) {
    let id = item.Id_Respuesta_Formulario;
    let estado = item.Estado;
    this.http
      .get(environment.base_url + '/php/recursos_humanos/formularios/anular_respuesta.php', {
        params: { id: id, estado: estado },
      })
      .subscribe((data: any) => {
        this.AsignarValores();
      });
  }
  QuitarPregunta(item: any, i: any) {
    if (item.Pregunta != '') {
      this.Preguntas.splice(i, 1);
      if (this.Preguntas.length == 0) {
        this.AgregarPregunta();
      }
    } else {
      this.Preguntas.splice(i, 1);
    }
  }
}
