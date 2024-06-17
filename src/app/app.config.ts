import { AsyncPipe, CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  importProvidersFrom,
} from '@angular/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideAnimations } from '@angular/platform-browser/animations';
import localeEs from '@angular/common/locales/es';
import { AuthInterceptor } from './auth.interceptor';
import { ModalService } from './core/services/modal.service';
import { getEspañolPaginatorIntl } from './core/utils/español-paginator-intl';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from '@viso-trust/angular-archwizard';
import { PageInterceptor } from './core/interceptors/page.interceptor';
import { DispensacionService } from './services/dispensacion.service';
import { GeneralService } from './services/general.service';
import { Globales } from './pages/contabilidad/globales';
import 'moment/locale/es';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
registerLocaleData(localeEs, 'es');
export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ArchwizardModule,
      BrowserModule,
      FormsModule,
      NgSelectModule,
      HttpClientModule,
    ),
    provideRouter(routes, withComponentInputBinding()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: PageInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: MatPaginatorIntl, useValue: getEspañolPaginatorIntl() },
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'COP' },
    CurrencyPipe,
    DatePipe,
    AsyncPipe,
    ModalService,
    GeneralService,
    DispensacionService,
    Globales,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
};
