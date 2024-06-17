import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const MAX_WIDTH = 100;

@Injectable()
export class ExcelService {
  constructor() {}

  public exportAsExcelFile(
    json: any[],
    excelFileName: string,
    sheetName = 'data',
  ): Observable<any> {
    try {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {
        cellDates: true,
      });
      let cols = this.fitToColumn(json);
      worksheet['!cols'] = cols;
      const workbook: XLSX.WorkBook = { Sheets: { reporte: worksheet }, SheetNames: ['reporte'] };
      XLSX.writeFile(workbook, excelFileName + EXCEL_EXTENSION);
      return of(true);
    } catch (error) {
      return of(error);
    }
  }

  /**
   * Analiza el tamaño de los datos (incluyendo los titlulos de las columnas) para hacer un "autofit"
   * @param json Array de datos
   * @returns Array con el ancho de las columnas
   */
  private fitToColumn(json: any[]) {
    let objectMaxLength = [];
    let encabezados = json ? Object.keys(json[0]) : [];
    for (let i = 0; i < json.length; i++) {
      let value = Object.values(json[i]);
      for (let j = 0; j < value.length; j++) {
        let ancho = Math.max(
          objectMaxLength[j] || 0,
          encabezados[j] ? encabezados[j].toString().length : 0,
          value[j] ? value[j].toString().length : 0,
        );
        objectMaxLength[j] = ancho > MAX_WIDTH ? MAX_WIDTH : ancho;
      }
    }
    var wscols = [];
    objectMaxLength.forEach((val, i) => {
      wscols.push({ width: val + 1, alignment: { wrapText: true } });
    });
    return wscols;
  }
}

