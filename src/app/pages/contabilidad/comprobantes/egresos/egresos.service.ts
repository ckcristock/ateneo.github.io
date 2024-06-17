import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EgresosService {
  public _subject = new Subject<any>();
  public event = this._subject.asObservable();
  private ToastObj: any = {
    textos: ['Default title', 'Default message'],
    tipo: 'warning',
    duracion: 0,
  };

  constructor(
    private http: HttpClient,
  ) {}

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

  public ShowToast(data: any) {
    this._setToastData(data);
    this._subject.next(this.ToastObj);
  }

  private _setToastData(data: any) {
    this.ToastObj.textos = data.textos;
    this.ToastObj.tipo = data.tipo ? data.tipo : 'default';
    this.ToastObj.duracion = data.duracion ? data.duracion : 3000;
  }

  public ClearToasty() {
    this._subject.next('limpiar');
  }

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

  descargarNIIF(comprobanteId) {
    return this.http.get(`${environment.base_url}/php/comprobantes/egreso_descarga_pdf.php?id=${comprobanteId}&tipo=Niif`,
      { responseType: 'blob' });
  }
}
