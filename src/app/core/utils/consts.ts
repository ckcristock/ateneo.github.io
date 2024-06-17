import { Pagination } from '@shared/interfaces/global.interface';
import { provideEnvironmentNgxCurrency, NgxCurrencyInputMode } from 'ngx-currency';

/**
 * @use for all **textarea** in the app
 */
export const LONG_TEXT = 4294967295;

export const EMPRESA: string = 'EMCO';

export const pagination: Pagination = {
  page: 1,
  length: 0,
  pageSize: 100,
};

export const consts = {
  maxSizeFile: 500000,
  degree: [
    { clave: 'Primaria', valor: 'Primaria' },
    { clave: 'Secundaria', valor: 'Secundaria' },
    { clave: 'Técnica', valor: 'Técnica' },
    { clave: 'Tecnológica', valor: 'Tecnológica' },
    { clave: 'Profesional', valor: 'Profesional' },
    { clave: 'Especialización', valor: 'Especialización' },
    { clave: 'Maestría', valor: 'Maestría' },
  ],
  maritalStatus: [
    { clave: 'Soltero(a)', valor: 'Soltero(a)' },
    { clave: 'Casado(a)', valor: 'Casado(a)' },
    { clave: 'Divorciado(a)', valor: 'Divorciado(a)' },
    { clave: 'Viudo(a)', valor: 'Viudo(a)' },
    { clave: 'Unión Libre', valor: 'Unión Libre' },
  ],
  contract_type: [
    { clave: 'Indefinido', valor: 1 },
    { clave: 'Fijo', valor: 2 },
  ],
  bonusType: [
    { clave: 'Constitutivo', valor: 'Constitutivo' },
    { clave: 'No Constitutivo', valor: 'No Constitutivo' },
  ],
  driving_requirements: [
    { text: 'Sin Licencia', value: 'Sin Licencia' },
    { text: 'A1', value: 'A1' },
    { text: 'A2', value: 'A2' },
    { text: 'B1', value: 'B1' },
    { text: 'B2', value: 'B2' },
    { text: 'B3', value: 'B3' },
  ],
  bloodType: [
    { clave: 'A+', valor: 'A+' },
    { clave: 'A-', valor: 'A-' },
    { clave: 'B+', valor: 'B+' },
    { clave: 'B-', valor: 'B-' },
    { clave: 'O+', valor: 'O+' },
    { clave: 'O-', valor: 'O-' },
    { clave: 'AB+', valor: 'AB+' },
    { clave: 'AB-', valor: 'AB-' },
  ],
  diasSemana: [
    {
      id: 1,
      text: 'Lunes',
      value: 'Monday',
    },
    {
      id: 1,
      text: 'Martes',
      value: 'Tuesday',
    },
    {
      id: 1,
      text: 'Miercoles',
      value: 'Wednesday',
    },
    {
      id: 1,
      text: 'Jueves',
      value: 'Thursday',
    },
    {
      id: 1,
      text: 'Viernes',
      value: 'Friday',
    },
    {
      id: 1,
      text: 'Sabado',
      value: 'Saturday',
    },
    {
      id: 1,
      text: 'Domingo',
      value: 'Sunday',
    },
  ],
  turnTypes: [
    { text: 'Fijo', value: 'fijo', isRotative: 0 },
    { text: 'Rotativo', value: 'rotativo', isRotative: 1 },
  ],
  shueSizes: [
    { text: '35', value: '35' },
    { text: '36', value: '36' },
    { text: '37', value: '37' },
    { text: '38', value: '38' },
    { text: '39', value: '39' },
    { text: '40', value: '40' },
    { text: '41', value: '41' },
    { text: '42', value: '42' },
    { text: '43', value: '43' },
    { text: '44', value: '44' },
    { text: '45', value: '45' },
  ],
  pantSizes: [
    { text: '28', value: '28' },
    { text: '30', value: '30' },
    { text: '32', value: '32' },
    { text: '34', value: '34' },
    { text: '36', value: '36' },
    { text: '38', value: '38' },
    { text: '38', value: '38' },
    { text: '40', value: '40' },
  ],
  shirtSize: [
    { text: 'XS', value: 'XS' },
    { text: 'S', value: 'S' },
    { text: 'M', value: 'M' },
    { text: 'L', value: 'L' },
    { text: 'XL', value: 'XL' },
    { text: 'XXL', value: 'XXL' },
  ],

  meses: [
    { id: 1, name: 'Enero' },
    { id: 2, name: 'Febrero' },
    { id: 3, name: 'Marzo' },
    { id: 4, name: 'Abril' },
    { id: 5, name: 'Mayo' },
    { id: 6, name: 'Junio' },
    { id: 7, name: 'Julio' },
    { id: 8, name: 'Agosto' },
    { id: 9, name: 'Septiembre' },
    { id: 10, name: 'Octubre' },
    { id: 11, name: 'Noviembre' },
    { id: 12, name: 'Diciembre' },
  ],

  status: [
    { clave: 'Todos', valor: '' },
    { clave: 'Abierto', valor: 'Abierto' },
    { clave: 'Cerrado', valor: 'Cerrado' },
  ],

  modalities: [
    { clave: 'Por Dia', valor: 'Por Dia' },
    { clave: 'Por Hora', valor: 'Por Hora' },
  ],

  Egresstypes: [
    { clave: 'Prestamo', valor: 'Prestamo' },
    { clave: 'Deducción', valor: 'Deducción' },
  ],

  Ingresstypes: [
    { clave: 'Prestacional', valor: 'Prestacional' },
    { clave: 'No Prestacional', valor: 'No Prestacional' },
  ],

  bankType: [
    { clave: 'Tarjeta de Crédito', valor: 0 },
    { clave: 'Efectivo', valor: 1 },
  ],

  options: [
    { clave: 'Si', valor: 0 },
    { clave: 'No', valor: 1 },
  ],

  sizes: [
    {
      name: '100%',
      value: 'col-md-12',
    },
    {
      name: '75%',
      value: 'col-md-10',
    },
    {
      name: '66%',
      value: 'col-md-8',
    },
    {
      name: '50%',
      value: 'col-md-6',
    },
    {
      name: '33%',
      value: 'col-md-4',
    },
    {
      name: '25%',
      value: 'col-md-3',
    },
    {
      name: '20%',
      value: 'col-md-2',
    },
    {
      name: '10%',
      value: 'col-md-1',
    },
  ],

  maskUSD: {
    prefix: 'USD ',
    suffix: '',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    precision: 2,
    align: 'right',
    nullable: false,
    inputMode: NgxCurrencyInputMode.Natural,
  },

  maskCOP: {
    prefix: '$ ',
    suffix: '',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    precision: 2,
    align: 'right',
    nullable: false,
    inputMode: NgxCurrencyInputMode.Natural,
  },

  maskNumbers: {
    prefix: '',
    suffix: '',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    precision: 0,
    align: 'right',
    nullable: false,
    inputMode: NgxCurrencyInputMode.Natural,
  },

  maskNumbers2Decimal: {
    prefix: '',
    suffix: '',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    precision: 2,
    align: 'right',
    nullable: false,
    inputMode: NgxCurrencyInputMode.Natural,
  },

  maskNumbers3Decimal: {
    prefix: '',
    suffix: '',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    precision: 3,
    align: 'right',
    nullable: false,
    inputMode: NgxCurrencyInputMode.Natural,
  },

  maskNumbers4Decimal: {
    prefix: '',
    suffix: '',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    precision: 4,
    align: 'right',
    nullable: false,
    inputMode: NgxCurrencyInputMode.Natural,
  },

  maskNumbers5Decimal: {
    prefix: '',
    suffix: '',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    precision: 5,
    align: 'right',
    nullable: false,
    inputMode: NgxCurrencyInputMode.Natural,
  },

  maskPorcentaje: {
    prefix: '',
    suffix: '%',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    precision: 2,
    align: 'right',
    nullable: false,
    inputMode: NgxCurrencyInputMode.Natural,
  },
};
