import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';
import { FormBuilder } from '@angular/forms';

@Injectable()
export class Globales {
  // ruta: string = 'http://localhost:4500/';

  ruta: string;

  Nombre: string = '';
  Nit: string = 'NIT ';
  Direccion: string = '';
  Condiciones_Comerciales: string = '';
  Telefono: string = 'Tel ';
  mensajeComprasNacionales = 'Rotativo Nacional ';
  mensajeComprasInternacionales = 'Rotativo Internacional';

  public urlLogoColor: string;
  public urlLogoNegro: string;
  public urlLogoBlanco: string;
  public Resolucion: any;
  public Nota_1: any;
  public Nota_2: any;
  public Cuenta_Bancaria: any;
  public porcentaje_rotativo: any;
  public dias_1: any;
  public dias_2: any;
  public funcionarios_autorizados_inventario: any;
  public meses: any = [
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
  public Pendientes_Libres: any = 'No';

  //llamar de base de datos para obtener los datos de configuración
  //se declara constructor para poderlo inicalizar
  constructor(
    private http: HttpClient,
    public platformLocation: PlatformLocation,
  ) {
    // if((platformLocation as any).location.origin == 'https://200.200.40.250')
    // {
    //   this.ruta = 'https://sigespro.com.co/';
    // }else if((platformLocation as any).location.origin == 'http://localhost:4200'){
    //   this.ruta = 'http://localhost/sigespro/back/';
    // }else{
    //   this.ruta = 'http://back/';
    // }
    //this.ruta ='https://sigespro.com.co/';
    // this.ruta ='https://sigesproreslpaldo.com/';
    //this.ruta ='http://localhost:4500/sigespro/sigespro-backend/';
    // this.ruta ='http://localhost/sigespro-backend/';
    // this.http.post(this.ruta + 'php/genericos/detalle.php',payload).subscribe((data: any) => {
    //   this.Nombre = data.Nombre_Empresa;
    //   this.Nit += data.NIT;
    //   this.Direccion = data.Direccion;
    //   this.Condiciones_Comerciales = data.Condiciones_Comerciales;
    //   this.Telefono += data.Telefono;
    //   this.Resolucion =data.Resolucion;
    //   this.Nota_1 =data.Nota_1;
    //   this.Nota_2 =data.Nota_2;
    //   this.Cuenta_Bancaria =data.Cuenta_Bancaria;
    //   this.urlLogoColor = this.ruta+'IMAGENES/LOGOS/'+data.Logo_Color;
    //   this.urlLogoNegro = this.ruta+'IMAGENES/LOGOS/'+data.Logo_Negro;
    //   this.urlLogoBlanco = this.ruta+'IMAGENES/LOGOS/'+data.Logo_Blanco;
    //   this.porcentaje_rotativo = data.Porcentaje_Rotativo;
    //   this.dias_1= data.Dias_Capita;
    //   this.dias_2= data.Dias_Otros_Servicios;
    //   this.funcionarios_autorizados_inventario = data.Funcionarios_Autorizados_Inventario;
    //   this.Pendientes_Libres = data.Productos_Pendientes_Libres;
    // });
  }

  ConvertToStringDate(date: string) {
    let splittedDate = date.split('-');
    let returnedValue = splittedDate[1] + ' de ' + this.meses[parseInt(splittedDate[0]) - 1];
    return returnedValue;
  }

  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇçÂ®Ã\n',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNnccARA ',
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++) mapping[from.charAt(i)] = to.charAt(i);

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
}
