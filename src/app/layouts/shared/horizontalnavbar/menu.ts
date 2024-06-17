import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'Tablero',
    icon: 'ri-dashboard-line',
    link: '/',
  },
  {
    id: 2,
    label: 'Agendamiendo',
    icon: 'fas fa-calendar-alt',
    isUiElement: true,
    subItems: [
      {
        id: 3,
        label: 'Abir Agendas',
        link: '/agendamiento/abrir-agendas',
        parentId: 2,
      },
      {
        id: 4,
        label: 'Asignación de Citas',
        link: '/agendamiento/asignacion-citas',
        parentId: 2,
      },
      {
        id: 5,
        label: 'Lista de Espera',
        link: '/agendamiento/lista-espera',
        parentId: 2,
      },
      {
        id: 6,
        label: 'Lista de Trabajo',
        link: '/agendamiento/lista-trabajo',
        parentId: 2,
      },
      {
        id: 6,
        label: 'Lista de Agendas',
        link: '/agendamiento/agendas',
        parentId: 2,
      },

      {
        id: 7,
        label: 'Indicadores Gestión',
        link: '/agendamiento/indicadores-gestion',
        parentId: 2,
      },
      {
        id: 8,
        label: 'Reportes',
        link: '/agendamiento/reportes',
        parentId: 2,
      },
    ],
  },
  {
    id: 9,
    label: 'Gestión del Riesgo',
    icon: 'ri-bar-chart-2-line',
    subItems: [
      {
        id: 10,
        label: 'Caracterización',
        link: '/gestion-riesgo/caracterizacion',
        parentId: 9,
      },
      {
        id: 11,
        label: 'Kardex por Patología',
        link: '/gestion-riesgo/kardex-patologia',
        parentId: 9,
      },
      {
        id: 12,
        label: 'Historias Clínicas',
        link: '/gestion-riesgo/historia-clinica',
      },
    ],
  },
  {
    id: 13,
    label: 'SST',
    icon: 'ri-heart-2-line',
    subItems: [
      {
        id: 14,
        label: 'Documentos de Gestón',
        link: '/sst/documentos-gestion',
        parentId: 13,
      },
    ],
  },

  {
    id: 15,
    label: 'Ajustes',
    icon: 'ri-settings-2-line',
    subItems: [
      {
        id: 16,
        label: 'Información Base',
        link: '/',
        parentId: 15,
        subItems: [
          {
            id: 17,
            label: 'Empresas',
            link: '/ajustes/informacion-base/empresas',
            parentId: 16,
          },
          {
            id: 18,
            label: 'Sedes',
            link: '/ajustes/informacion-base/sedes',
            parentId: 16,
          },
          {
            id: 19,
            label: 'Funcionarios',
            link: '/ajustes/informacion-base/funcionarios',
            parentId: 16,
          },
          {
            id: 20,
            label: 'Profesionales',
            link: '/ajustes/informacion-base/persons',
            parentId: 16,
          },
          {
            id: 21,
            label: 'Pacientes',
            link: '/ajustes/informacion-base/pacientes',
            parentId: 16,
          },
          {
            id: 22,
            label: 'Especialidades',
            link: '/ajustes/informacion-base/especialidades',
            parentId: 16,
          },
          {
            id: 22,
            label: 'CUPS',
            link: '/ajustes/informacion-base/cups',
            parentId: 16,
          },
          {
            id: 23,
            label: 'Regímenes y Niveles',
            link: '/ajustes/informacion-base/regimenes-niveles',
            parentId: 16,
          },
          /*  {
                         id: 24,
                         label: 'Aseguradoras',
                         link: '/ajustes/informacion-base/aseguradoras',
                         parentId: 16
                     }, */
        ],
      },
      {
        id: 25,
        label: 'Tipos',
        parentId: 15,
        subItems: [
          {
            id: 26,
            label: 'Tipos de Agenda',
            link: 'ajustes/tipos/tipos-agenda',
            parentId: 25,
          },
          {
            id: 27,
            label: 'Tipos de Consulta',
            link: 'ajustes/tipos/tipos-consulta',
            parentId: 25,
          },
        ],
      },

      {
        id: 28,
        label: 'Parametros',
        icon: 'ri-map-pin-line',
        subItems: [
          {
            id: 29,
            label: 'Perfiles',
            link: '/ajustes/parametros/perfiles',
            parentId: 28,
          },
          {
            id: 30,
            label: 'PGP',
            link: '/ajustes/parametros/rgp',
            parentId: 28,
          },
          {
            id: 31,
            label: 'Notas Técnicas',
            link: '/ajustes/parametros/notas-tecnicas',
            parentId: 28,
          },
        ],
      },
      // {
      //     id: 28,
      //     label: 'Encuestas',
      //     icon: 'ri-map-pin-line',
      //     subItems: [
      //         {
      //             id: 29,
      //             label: 'Crear encuesta',
      //             link: '/ajustes/encuestas/create-quest',
      //             parentId: 28
      //         },
      //         // {
      //         //     id: 29,
      //         //     label: 'Aplcar encuesta',
      //         //     link: '/ajustes/encuestas/apply-quest',
      //         //     parentId: 28
      //         // },
      //     ]
      // }
    ],
  },
];
