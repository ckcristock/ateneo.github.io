const typeDocuments = [
  {
    value: 1,
    text: 'Cedula',
  },
  {
    value: 2,
    text: 'Passaporte',
  },
  {
    value: 3,
    text: 'Cedula de Extrangeria',
  },

  {
    value: 1,
    text: 'Registro civil',
  },

  {
    value: 1,
    text: 'Permiso Especial de Permanencia',
  },
];
const typeRegimens = [
  {
    value: 1,
    text: 'Subsidiado',
  },
  {
    value: 2,
    text: 'Contributivo',
  },
  {
    value: 3,
    text: 'Contributivo Beneficiario',
  },
  {
    value: 4,
    text: 'Contributivo Cotizante',
  },
];

const levels = [
  {
    value: 1,
    text: 'Nivel 1',
    cuota: '3500',
  },
  {
    value: 1,
    text: 'Nivel 2',
    cuota: '3500',
  },
  {
    value: 2,
    text: 'Nivel 1',
    cuota: '7000',
  },
  {
    value: 3,
    text: 'Nivel 3',
    cuota: '14000',
  },
];

const genders = [
  {
    value: '',
    text: 'Seleccione',
  },
  {
    value: 'M',
    text: 'Masculino',
  },
  {
    value: 'F',
    text: 'Femenino',
  },
];

const types = [
  {
    value: '',
    text: 'Seleccione',
  },
  {
    value: 'Cabeza Flia Subsidiado',
    text: 'Cabeza Flia Subsidiado',
  },
  {
    value: 'COTIZANTE',
    text: 'COTIZANTE',
  },
  {
    value: 'Benef. Subsidiado',
    text: 'Benef. Subsidiado',
  },
  {
    value: 'BENEFICIARIO',
    text: 'BENEFICIARIO',
  },
];

const epss = [
  {
    value: 'Medimas',
    text: 'Medimas',
  },
  {
    value: 'Ecoopsos',
    text: 'Ecoopsos',
  },
];

export { genders, levels, typeRegimens, typeDocuments, epss, types };
