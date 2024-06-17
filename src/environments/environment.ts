// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/* export const environment = {
  production: false,
  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }

};
 */

export const environment = {
  production: false,
  id_funcionario: 1,
  // base_url: 'https://backend.ateneoerp.com/api',
  //base_url: 'http://127.0.0.1:8000/api',
  // url_assets: 'https://backend.ateneoerp.com/',
  //url_assets: 'http://127.0.0.1:8000/',
  ruta: 'https://inventario.ateneoerp.com/',
  url_assets: 'http://ateneo-server.test/',
  base_url: 'http://ateneo-server.test/api',
  //ruta: 'http://ateneo-server.test/ateneo-back-php/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
