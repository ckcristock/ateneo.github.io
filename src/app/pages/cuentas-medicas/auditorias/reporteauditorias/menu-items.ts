import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  short_label?: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const MENUITEMS = [
  {
    label: 'Tablero',
    main: [
      {
        state: 'tablero',
        short_label: 'T',
        name: 'Tablero',
        type: 'link',
        icon: 'ti-dashboard',
      },
      {
        state: 'cuentasmedicas',
        short_label: 'CM',
        name: 'Cuentas Médicas',
        type: 'sub',
        icon: 'ti-heart-broken',
        children: [
          {
            state: 'cabeceradatospositiva',
            name: 'Datos Positiva ',
            type: 'link',
          },
          {
            state: 'cabecerapositiva',
            name: 'Positiva No Autorizados',
            type: 'link',
          },
          {
            state: 'dispensacionpositiva',
            name: 'Dispensaciones Positiva',
            type: 'link',
          },
          {
            state: 'dispensaciones',
            name: 'Dispensaciones',
            type: 'link',
          },
          {
            state: 'reportes',
            name: 'Reportes',
            type: 'link',
          },
          {
            state: 'auditorias',
            name: 'Auditorías',
            type: 'link',
          },
          {
            state: 'auditoriasalertas',
            name: 'Auditorías Alertas',
            type: 'link',
          },
          {
            state: 'correspondencias',
            name: 'Correspondencias',
            type: 'link',
          },
          {
            state: 'cmfacturacion',
            name: 'Facturación',
            type: 'link',
          },
          {
            state: 'radicaciones',
            name: 'Radicaciones',
            type: 'link',
          },
          {
            state: 'glosas',
            name: 'Glosas',
            type: 'link',
          },
          {
            state: 'cierrecaja',
            name: 'Cierre de Caja',
            type: 'link',
          },
          {
            state: 'superauditoria',
            name: 'Control Auditoria ',
            type: 'link',
          },
          {
            state: 'entregapendientesnopos',
            name: 'Entrega Pendientes NoPos ',
            type: 'link',
          },
          {
            state: 'firmaspaciente',
            name: 'Firmas Pacientes',
            type: 'link',
          },
          {
            state: 'facturacionmasiva',
            name: 'Facturacion Masiva',
            type: 'link',
          },
          {
            state: 'verificacionactas',
            name: 'Verificacion Acta Entrega',
            type: 'link',
          },
          {
            state: 'cambioproductonopos',
            name: 'Cambio Producto Nopos',
            type: 'link',
          },
          {
            state: 'gastospuntos',
            name: 'Gastos',
            type: 'link',
          },
          {
            state: 'remisionescallcenter',
            name: 'Remisiones Call Center',
            type: 'link',
          },
        ],
      },
      {
        state: 'mipres',
        short_label: 'M',
        name: 'Mipres',
        type: 'sub',
        icon: 'ti-location-arrow',
        children: [
          {
            state: 'direccionamientos',
            name: 'Direccionamientos',
            type: 'link',
          },
          {
            state: 'estadosdireccionamientos',
            name: 'Estados Direccionamientos',
            type: 'link',
          },
          {
            state: 'reportesdireccionamiento',
            name: 'Reportes Direccionamiento',
            type: 'link',
          },
          {
            state: 'radicacionesweb',
            name: 'Radicaciones Web',
            type: 'link',
          },
        ],
      },
      {
        state: 'inventarios',
        short_label: 'I',
        name: 'Inventarios',
        type: 'sub',
        icon: 'ti-receipt',
        children: [
          {
            state: 'listadoinventarios',
            name: 'Inventarios Fisicos Bodega Nuevo',
            type: 'link',
          },
          {
            state: 'inventarionuevo',
            name: 'Inventarios Nuevo',
            type: 'link',
          },
          {
            state: 'alistamientosnuevo',
            name: 'Alistamiento Nuevo',
            type: 'link',
          },
          {
            state: 'remisionesnuevo',
            name: 'Remisiones Nuevo ',
            type: 'link',
          },
          {
            state: 'actarecepcionnuevo',
            name: 'Acta Recepción Nuevo',
            type: 'link',
          },
          {
            state: 'actarecepcionaprobados',
            name: 'Acta Recepción Aprobados Nuevo',
            type: 'link',
          },
          {
            state: 'actarecepcionpuntonuevo',
            name: 'Acta Recepción Punto Nuevo',
            type: 'link',
          },
          {
            state: 'actarecepcionremisionesnuevo',
            name: 'Acta Recepción Remisiones Nuevo',
            type: 'link',
          },
          {
            state: 'actarecepcionbodegasnuevo',
            name: 'Acta Recepción Bodegas Nuevo',
            type: 'link',
          },
          {
            state: 'ajusteunoauno',
            name: 'Ajuste Individual Nuevo',
            type: 'link',
          },
        ],
      },

      {
        state: 'bodega',
        short_label: 'B',
        name: 'Bodega',
        type: 'sub',
        icon: 'ti-archive',
        children: [
          {
            state: 'noconformes',
            name: 'No Conformes',
            type: 'link',
          },
          /*   {
              state: 'remisiones',
              name: 'Remisiones',
              type: 'link'
            },
            {
              state: 'alistamientos',
              name: 'Alistamientos',
              type: 'link'
            },
            {
              state: 'noconformes',
              name: 'No Conformes',
              type: 'link'
            },
            {
              state: 'actarecepcion',
              name: 'Acta Recepción',
              type: 'link'
            },
            {
              state: 'actarecepcionpunto',
              name: 'Acta Recepción Puntos',
              type: 'link'
            },
            {
              state: 'actarecepcionremisiones',
              name: 'Acta Recepción Remisones',
              type: 'link'
            },
            {
              state: 'actarecepcionbodegas',
              name: 'Acta Recepción Bodegas',
              type: 'link'
            },*/
          {
            state: 'actarecepcioninternacional',
            name: 'Acta Recepción Inter.',
            type: 'link',
          } /*
        {
          state: 'vencimientos',
          name: 'Vencimientos',
          type: 'link'
        },/*
        {
          state: 'inventario',
          name: 'Inventario',
          type: 'link'
        },
        {
          state: 'ajusteinventariofisico',
          name: 'Inventario Físico',
          type: 'link'
        }, */,
          {
            state: 'inventariopuntos',
            name: 'Inventario por Puntos',
            type: 'link',
          } /* ,
        {
          state: 'ajusteunoauno',
          name: 'Ajuste Individual',
          type: 'link'
        }*/,
          {
            state: 'inventariofisicopuntos',
            name: 'Inventario Fisico Puntos',
            type: 'link',
          } /*
        {
          state: 'listadoinventariospuntos',
          name: 'Inventario Fisico Puntos Nuevo',
          type: 'link'
        },

        {
          state: 'bodegas-dispensacion',
          name: 'Bodegas de Despacho',
          type: 'link'
        },
        {
          state: 'productospendientes',
          name: 'Productos Pendientes Puntos',
          type: 'link'
        },
        /*
        {
          state: 'inventarioimportacion',
          name: 'Inventario Internacional',
          type: 'link'
        },
        {
          state: 'cronogramaremision',
          name: 'Cronograma Remisiones',
          type: 'link'
        },
        {
          state: 'descargarpendientes',
          name: 'Descarga Pendientes Punto',
          type: 'link'
        },
        {
          state: 'devolucioninterna',
          name: 'Devolucion Interna',
          type: 'link'
        }, */,
        ],
      },
      {
        state: 'compras',
        short_label: 'C',
        name: 'Compras',
        type: 'sub',
        icon: 'ti-money',
        children: [
          {
            state: 'comprasnacionales',
            name: 'Compras Nacionales',
            type: 'link',
          },
          {
            state: 'comprasinternacionales',
            name: 'Compras Internacionales',
            type: 'link',
          },
          {
            state: 'devolucionescompras',
            name: 'Devoluciones Compras',
            type: 'link',
          },
          {
            state: 'reportekardex',
            name: 'Reporte Kardex',
            type: 'link',
          },
          {
            state: 'reportesgenerales',
            name: 'Reportes Generales',
            type: 'link',
          },
          {
            state: 'mejoresprecios',
            name: 'Mejores Precios',
            type: 'link',
          },
          {
            state: 'rotativocompra',
            name: 'Rotativos Compras',
            type: 'link',
          },
          // {
          //   state: 'rotativocomprainternacional',
          //   name: 'Rotativos Compras Internacionales',
          //   type: 'link'
          // },
          {
            state: 'productodisponiblepunto',
            name: 'Productos Disponible Puntos',
            type: 'link',
          },
          {
            state: 'reporteproveedor',
            name: 'Reporte Proveedores',
            type: 'link',
          },
          {
            state: 'reportecompras',
            name: 'Reporte Compras',
            type: 'link',
          },
          {
            state: 'administracionproductos',
            name: 'Administracion Productos',
            type: 'link',
          },
        ],
      },
      {
        state: 'facturacion',
        short_label: 'F',
        name: 'Facturación',
        type: 'sub',
        icon: 'ti-files',
        children: [
          {
            state: 'cotizacionesventas',
            name: 'Cotizaciones Ventas',
            type: 'link',
          },
          {
            state: 'facturasventas',
            name: 'Facturas Ventas',
            type: 'link',
          },
          {
            state: 'noobligados',
            name: 'Documento Soporte',
            type: 'link',
          },
          {
            state: 'notascredito',
            name: 'Notas Crédito',
            type: 'link',
          },
          {
            state: 'preciosregulados',
            name: 'Precios Regulados',
            type: 'link',
          },
          {
            state: 'reportesismed',
            name: 'Reporte Sismed',
            type: 'link',
          },
          {
            state: 'eventosfacturas',
            name: 'Eventos Facturas',
            type: 'link',
          },
        ],
      },
      {
        state: 'contabilidad', //EDITANDO
        short_label: 'CM',
        name: 'Contabilidad',
        type: 'sub',
        icon: 'ti-bar-chart',
        children: [
          {
            state: 'carteras',
            name: 'Carteras',
            type: 'sub',
            children: [
              {
                state: 'cliente',
                name: 'Cliente',
                type: 'link',
              },
              {
                state: 'proveedor',
                name: 'Proveedor',
                type: 'link',
              },
            ],
          },
          {
            state: 'comprobante',
            name: 'Comprobantes',
            type: 'sub',
            children: [
              {
                state: 'ingresos',
                name: 'Recibo de Caja',
                type: 'link',
              },
              {
                state: 'egresos',
                name: 'Egresos',
                type: 'link',
              },
              {
                state: 'notascontables',
                name: 'Notas Contables',
                type: 'link',
              },
              {
                state: 'notascartera',
                name: 'Notas Cartera',
                type: 'link',
              },
              {
                state: 'notascreditonuevo',
                name: 'Notas Crédito',
                type: 'link',
              },
            ],
          },
          {
            state: 'estados',
            name: 'Estados',
            type: 'sub',
            children: [
              {
                state: 'resultados',
                name: 'Estados Resultados',
                type: 'link',
              },
              /*{
                state: 'resultadoacum',
                name: 'Est. Resultados Acumulado',
                type: 'link'
              },*/
            ],
          },
          /* {
            state: 'pyg',
            name: 'PyG',
            type: 'link'
          }, */
          {
            state: 'balance',
            name: 'Balances',
            type: 'sub',
            children: [
              {
                state: 'prueba',
                name: 'Prueba',
                type: 'link',
              },
              {
                state: 'general',
                name: 'General',
                type: 'link',
              },
              {
                state: 'movimientoglobalizado',
                name: 'Movimientos Globalizados',
                type: 'link',
              },
            ],
          },
          {
            state: 'libro',
            name: 'Libros',
            type: 'sub',
            children: [
              {
                state: 'auxiliar',
                name: 'Libro Auxiliar',
                type: 'link',
              },
              {
                state: 'contables',
                name: 'Libros Contables',
                type: 'link',
              },
            ],
          },
          {
            state: 'inventariosvalorizados',
            name: 'Inventarios Valorizados',
            type: 'link',
          },
          {
            state: 'facturaadministrativa',
            name: 'Factura Administrativa',
            type: 'link',
          },
          {
            state: 'activosfijos',
            name: 'Activos Fijos',
            type: 'link',
          },
          {
            state: 'depreciaciones',
            name: 'Depreciaciones',
            type: 'link',
          },
          {
            state: 'cierres',
            name: 'Cierres Contables',
            type: 'link',
          },
          /*  {
             state: 'amortizaciones',
             name: 'Amortizaciones',
             type: 'link'
           }, */
          {
            state: 'centroscostos',
            name: 'Centros de Costos',
            type: 'link',
          },
          {
            state: 'plancuentas',
            name: 'Plan de Cuentas (PUC)',
            type: 'link',
          },
          {
            state: 'informesdian',
            name: 'Informes DIAN',
            type: 'sub',
            children: [
              {
                state: 'mediosmagneticos',
                name: 'Medios Magneticos Basicos',
                type: 'link',
              },
              {
                state: 'mediosmagneticosespeciales',
                name: 'Medios Magneticos Especiales',
                type: 'link',
              },
              {
                state: 'agruparmediosmagneticos',
                name: 'Agrupar Formatos Especiales',
                type: 'link',
              },
              {
                state: 'certificadoretencion',
                name: 'Certificados de Retención',
                type: 'link',
              },
              {
                state: 'certificadoingresoyretencion',
                name: 'Certificados de Ingreso y Retención',
                type: 'link',
              },
              {
                state: 'resumenretenciones',
                name: 'Resumen de Retenciones',
                type: 'link',
              },
            ],
          },
        ],
      },
      {
        state: 'recursoshumanos', //EDITANDO
        short_label: 'CM',
        name: 'Recursos Humanos',
        type: 'sub',
        icon: 'ti-user',
        children: [
          {
            state: 'Hojas_vida',
            name: ' Hojas de Vida',
            type: 'sub',
            children: [
              {
                state: 'curriculum',
                name: 'Banco',
              },
              {
                state: 'vacantes',
                name: 'Vacantes',
              },
            ],
          },
          {
            state: 'Registro_llegadas',
            name: 'Registro de Llegadas',
            type: 'sub',
            children: [
              {
                state: 'reportehorario',
                name: 'Reporte Horario',
              },
              {
                state: 'certificados',
                name: 'Certificados',
              },
            ],
          },
          {
            state: 'Dotacion_Epp',
            name: 'Dotación y Epp',
            type: 'sub',
            children: [
              {
                state: 'dotacion',
                name: 'Dotación',
              },
              {
                state: 'inventariodotacion',
                name: 'Inventario Dotación y Epp',
              },
            ],
          },
          {
            state: 'procesos',
            name: 'Procesos',
            type: 'sub',
            children: [
              {
                state: 'procesosdisciplinarios',
                name: 'Disciplinarios',
              },
              {
                state: 'memorandos',
                name: 'Memorandos',
              },
            ],
          },
          {
            state: 'postulantes',
            name: 'Postulantes',
            type: 'link',
          },
          {
            state: 'contratos',
            name: 'Contratos',
            type: 'link',
          },
          {
            state: 'novedades',
            name: 'Novedades',
            type: 'link',
          },
          {
            state: 'actividades_rhumanos',
            name: 'Actividades',
            type: 'link',
          },
          {
            state: 'preliquidados',
            name: 'Preliquidados',
            type: 'link',
          },
          {
            state: 'prestamosylibranzas',
            name: 'Prestamo Libranzas',
            type: 'link',
          },
          {
            state: 'llegadastarde',
            name: 'Llegadas Tarde',
            type: 'link',
          },
          {
            state: 'prestamosylibranzas',
            name: 'Prestamo Libranzas',
            type: 'link',
          },
          {
            state: 'formulario',
            name: 'Formularios',
            type: 'link',
          },

          {
            state: 'evaluaciones',
            name: 'Evaluaciones De Desempeño',
            type: 'link',
          },

          {
            state: 'auditarevaluaciones',
            name: 'Auditar Evaluaciones',
            type: 'link',
          },
        ],
      },
      {
        state: 'comercial', //EDITANDO
        short_label: 'CM',
        name: 'Comercial',
        type: 'sub',
        icon: 'ti-shopping-cart',
        children: [
          {
            state: 'directorcomercial',
            name: 'Director Comercial',
            type: 'link',
          },
          {
            state: 'orden-pedido',
            name: 'Orden De Pedido',
            type: 'link',
          },
          {
            state: 'metas',
            name: 'Metas',
            type: 'link',
          },
          {
            state: 'actividades',
            name: 'Actividades',
            type: 'link',
          },
          {
            state: 'rutas',
            name: 'Rutas',
            type: 'link',
          },
        ],
      },

      {
        state: 'nomina', //EDITANDO
        short_label: 'NO',
        name: 'Nomina',
        type: 'sub',
        icon: 'fa fa-money',
        children: [
          {
            state: 'nomina',
            name: 'Pago Nómina',
            type: 'link',
          },
          {
            state: 'prestamosylibranzas',
            name: 'Prestamos y Libranzas',
            type: 'link',
          },
        ],
      },

      {
        state: 'configuracion',
        short_label: 'C',
        name: 'Configuración',
        type: 'sub',
        icon: 'ti-settings',
        children: [
          {
            state: 'funcionarios',
            name: 'Funcionarios',
          },
          {
            state: 'pacientes',
            name: 'Pacientes',
          },
          {
            state: 'clientes',
            name: 'Clientes',
          },
          {
            state: 'terceros',
            name: 'Terceros',
          },
          {
            state: 'proveedores',
            name: 'Proveedores',
          },

          {
            state: 'productos',
            name: 'Productos',
          },
          {
            state: 'contratosclientes',
            name: 'Contratos Clientes',
          },
          {
            state: 'bodegas',
            name: 'Bodegas',
          },
          {
            state: 'puntosdispensacion',
            name: 'Puntos de Dispensación',
          },
          {
            state: 'dependencias',
            name: 'Dependencias',
          },
          {
            state: 'cargos',
            name: 'Cargos',
          },
          {
            state: 'grupos',
            name: 'Grupos',
          },
          {
            state: 'enviomensajes',
            name: 'Envio Mensajes',
          },
          {
            state: 'presentacionproductos',
            name: 'Presentacion Productos',
            type: 'link',
          },
          {
            state: 'tecnologiasasociadas',
            name: 'Tecnologías Asociadas',
            type: 'link',
          },
        ],
      },
      {
        state: 'configuracion',
        name: 'Configuración',
        type: 'sub',
        children: [
          {
            state: 'configuraciongeneral',
            name: 'Configuración General',
          },
          {
            state: 'departamentos',
            name: 'Departamentos',
          },
          {
            state: 'causalnoconforme',
            name: 'Causual No Conforme',
          },
          {
            state: 'municipios',
            name: 'Municipios',
          },

          {
            state: 'turnos',
            name: 'Turnos',
          },

          {
            state: 'listanopos',
            name: 'Lista NoPos ',
          },

          {
            state: 'perfiles',
            name: 'Perfiles',
          },

          {
            state: 'codigoscum',
            name: 'Códigos CUM',
          },

          {
            state: 'dispositivosdis',
            name: 'Dispositivos Dispensacion',
          },

          {
            state: 'listasganancia',
            name: 'Listas de Ganancia',
          },
          {
            state: 'listaseps',
            name: 'Lista Precio Eps',
          },
          // {
          //   state: 'listaspreciosnopos',
          //   name: 'Lista Precios noPOS'
          // },
          {
            state: 'resoluciones',
            name: 'Resoluciones',
          },
          {
            state: 'turnero',
            name: 'Turnero',
          },
          {
            state: 'prioridadturnero',
            name: 'Prioridad Turnero',
          },
          {
            state: 'codigosglosa',
            name: 'Codigos Glosa',
          },
        ],
      },
      {
        state: 'tipo',
        name: 'Tipos',
        type: 'sub',
        children: [
          {
            state: 'tipodocumentos',
            name: 'Tipo Documentos',
          },
          {
            state: 'tiposervicios',
            name: 'Tipo Servicios',
          },
          {
            state: 'tiponovedades',
            name: 'Tipo de Novedades',
          },

          {
            state: 'causalesnopago',
            name: 'Causales no Pago',
          },
          {
            state: 'tiposglosa',
            name: 'Tipos Glosa',
          },

          {
            state: 'tiporetenciones',
            name: 'Tipo Retenciones',
          },
          {
            state: 'tipogasto',
            name: 'Tipos Gasto',
          },
          {
            state: 'tipoegreso',
            name: 'Tipo Egreso',
          },
          {
            state: 'tipoingreso',
            name: 'Tipo Ingreso',
          },
          {
            state: 'tipoestadofinanciero',
            name: 'Tipo Estado Financiero',
          },
          {
            state: 'anulacion',
            name: 'Tipo Anulación',
          },
          {
            state: 'tiporechazo',
            name: 'Tipo Rechazo',
          },
          {
            state: 'tipocontrato',
            name: 'Tipo Contrato',
          },
          {
            state: 'tiposalario',
            name: 'Tipo Salario',
          },
          {
            state: 'tiporiesgo',
            name: 'Tipo Riesgo',
          },
          {
            state: 'tipoactivofijo',
            name: 'Tipo Activo Fijo',
          },
          {
            state: 'clientesdepartamentofacturacion',
            name: 'Departamento Cliente',
          },
        ],
      },
      {
        state: 'parametros',
        name: 'Parametros',
        type: 'sub',
        children: [
          {
            state: 'eps',
            name: 'EPS',
          },
          {
            state: 'servicio',
            name: 'Servicios ',
          },
          {
            state: 'niveles',
            name: 'Niveles',
          },
          {
            state: 'regimenes',
            name: 'Regímenes',
          },
          {
            state: 'codigoscie',
            name: 'Códigos CIE',
          },
          {
            state: 'fondopension',
            name: 'Fondo Pensión',
          },
          {
            state: 'cajacompensacion',
            name: 'Caja Compensación',
          },
          {
            state: 'arl',
            name: 'ARL',
          },
          {
            state: 'banco',
            name: 'Banco',
          },
          {
            state: 'categoria',
            name: 'Categoria',
          },
          {
            state: 'subcategoria',
            name: 'Subcategoria',
          },
          {
            state: 'cuentabanco',
            name: 'Cuenta Banco ',
          },
          {
            state: 'zonas',
            name: 'Zonas',
          },
          {
            state: 'parametrosnomina',
            name: 'Parametros Nomina',
          },
          {
            state: 'configuracionnomina',
            name: 'Configuracion Nomina',
          },
          {
            state: 'certificadoingresoretencion',
            name: 'Certificado Ingreso y Retención',
          },
        ],
      },
    ],
  },
];

@Injectable()
export class MenuItems {
  getAll(): any[] {
    return MENUITEMS;
  }
}
