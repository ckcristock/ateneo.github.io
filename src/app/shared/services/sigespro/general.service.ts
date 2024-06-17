import { Injectable } from '@angular/core';
// import { Globales } from '../../globales/globales';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import moment from 'moment';
// import { MenuItems } from '../../menu-items/menu-items';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  public MomentObj: any;
  public Ruta_Principal: string;
  public Ruta_Reportes: string;
  public Ruta_Imagenes: string;
  public FechaActual: string;
  public FullFechaActual: string;
  public FuncionarioData: any = JSON.parse(localStorage.getItem('User'));
  public PerfilSesion: any = JSON.parse(localStorage.getItem('miPerfil'));
  public Mes: number = 0;
  // public MenuItems: Array<any> = this._menuItems.getAll();
  public Configuracion: any = {};

  //Variables para validacion de entregas dobles
  public _subjectEntregasDobles = new Subject<object>();
  public eventEntregasDobles = this._subjectEntregasDobles.asObservable();

  globales = environment;

  constructor(
    private datePipe: DatePipe,
    private client: HttpClient,
    // private _menuItems: MenuItems,
  ) {
    this.MomentObj = moment();
    this.FechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.FullFechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.Ruta_Principal = this.globales.ruta;
    this.Ruta_Reportes = this.globales.ruta + 'php/reportes/';
    this.Ruta_Imagenes = this.globales.ruta + 'IMAGENES/';
    this.GetInfoConfiguracion();
    //this.GetConfiguracion();
  }

  getMondays() {
    var d = new Date(),
      month = d.getMonth(),
      mondays = [];

    d.setDate(1);

    // Get the first Monday in the month
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
    }

    // Get all the other Mondays in the month
    while (d.getMonth() === month) {
      mondays.push(new Date(d.getTime()));
      d.setDate(d.getDate() + 7);
    }

    return mondays;
  }

  /*getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    let weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
  }*/

  IsObjEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  IsValidObj(obj) {
    console.log(typeof obj);

    if (typeof obj == 'object') {
      return Object.keys(obj).length > 0 ? true : false; // Si es valido ó tiene propiedades devuelve "true", si no, devuelve "false".
    }
    return false;
  }

  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç\n\r'",
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNncc--*',
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++) {
      mapping[from.charAt(i)] = to.charAt(i);
    }

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
        else ret.push(c);
      }
      return ret.join('');
    };
  })();

  public Utf8 = {
    // public method for url encoding
    encode: function (string) {
      string = string.replace(/\r\n/g, '\n');
      var utftext = '';
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    },

    // public method for url decoding
    decode: function (utftext) {
      var string = '';
      var i = 0;
      var c = 0;
      var c2 = 0;
      var c3 = 0;

      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if (c > 191 && c < 224) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    },
  };

  public limpiarString(modelo: any) {
    let tipo = typeof modelo;

    switch (tipo) {
      case 'string':
        return modelo.trim();

      case 'object':
        let clean_model = modelo;
        for (const key in clean_model) {
          if (clean_model.hasOwnProperty(key)) {
            if (typeof clean_model[key] == 'string') {
              clean_model[key] = clean_model[key].trim();
            }
          }
        }
        return clean_model;

      default:
        break;
    }
  }

  private GetInfoConfiguracion(): void {
    this.client
      .get(this.globales.base_url + '/php/actarecepcion/lista_impuesto_mes.php', {
        params: { modulo: 'Impuesto' },
      })
      .subscribe((data: any) => {
        this.Mes = parseInt(data.Meses.Meses_Vencimiento);
      });
  }

  public GetConfiguracion(): Observable<any> {
    return this.client.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Configuracion', id: '1' },
    });
  }

  public GetNoConformes(): Observable<any> {
    return this.client.get(
      this.globales.ruta + 'php/actarecepcioninternacional/causal_no_conformes_internacional.php',
    );
  }

  public GetCausalNoPago(): Observable<any> {
    let p = { modulo: 'Causal_No_Pago' };
    return this.client.get(this.globales.base_url + '/php/lista_generales.php', { params: p });
  }

  public GetMunicipiosDepartamento(idDepartamento: string): Observable<any> {
    let p = { id: idDepartamento };
    return this.client.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', {
      params: p,
    });
  }

  public GetTiposDocumentos(): Observable<any> {
    let p = { modulo: 'Tipo_Documento' };
    return this.client.get(this.globales.base_url + '/php/lista_generales.php', { params: p });
  }

  public GetListaEps(): Observable<any> {
    return this.client.get(this.globales.ruta + 'php/GENERALES/eps/lista_eps.php');
  }

  public GetGeneralData(modulo: string): Observable<any> {
    let p = { modulo: modulo };
    return this.client.get(this.globales.base_url + '/php/lista_generales.php', { params: p });
  }

  public ThousandRound(value: number): number {
    let calculo = Math.round(value / 1000) * 1000;
    console.log(calculo);

    return calculo;
  }

  public TestRemoteConnection(data: FormData): Observable<any> {
    return this.client.post(this.globales.ruta + 'php/test_remote_connection.php', data);
  }

  public ProbarCaracteresEspeciales(data: FormData) {
    return this.client.post(this.globales.ruta + 'php/test_especiales.php', data);
  }

  public ValidarEntregasDobles(puntoDispensacion: any, entregados: Array<any>, idProducto: string) {
    let response = { codigo: '', fecha: '', validar: false };
    if (puntoDispensacion.Entrega_Doble == 'No') {
      let exist = entregados.filter((x) => x.Id_Producto == idProducto);

      if (exist.length > 0) {
        let e = entregados.find((x) => x.Id_Producto == idProducto);
        response.codigo = e.Codigo;
        response.fecha = e.Fecha;
        // this._swalService.ShowMessage(['warning','Alerta','Esta producto ya fue entregado este mes en la dis '+entregado.Codigo+' en la fecha '+entregado.Fecha+'!']);
        response.validar = false;
        // this._subjectEntregasDobles.next(response);
        return response;
      } else {
        response.validar = true;
        // this._subjectEntregasDobles.next(response);
        return response;
      }
    } else {
      response.validar = true;
      // this._subjectEntregasDobles.next(response);
      return response;
    }
  }

  public getMeses() {
    let meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    return meses;
  }

  public getMes(pos) {
    let meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    return meses[pos];
  }
}
