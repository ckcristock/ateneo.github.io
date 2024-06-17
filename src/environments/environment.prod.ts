import { enableProdMode } from '@angular/core';
import { EMPRESA } from '@app/core/utils/consts';
//enableProdMode();

/* const base_url = 'https://backend.ateneoerp.com/api';
const url_assets = 'https://backend.ateneoerp.com';
const ruta = 'https://inventario.ateneoerp.com/'; */

const base_url = 'https://backend.emcosoft.com.co/api';
const url_assets = 'https://backend.emcosoft.com.co';
const ruta = 'https://inventario.emcosoft.com.co/';

export const environment = {
  production: true,
  base_url,
  url_assets,
  ruta,
  id_funcionario: 1,
  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  },
};
