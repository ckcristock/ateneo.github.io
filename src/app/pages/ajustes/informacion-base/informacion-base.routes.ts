import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'especialidades',
    loadChildren: () => import('./speciality/speciality.routes').then((m) => m.routes),
  },
  {
    path: 'contracts',
    loadChildren: () => import('./contracts-eps/contracts-eps.routes').then((m) => m.routes),
  },
  {
    path: 'professionals',
    loadChildren: () => import('./professionals/profesionals.routes').then((m) => m.routes),
  },
  {
    path: 'empresas',
    loadComponent: () =>
      import('./empresas/empresas.component').then((mod) => mod.EmpresasComponent),
  },
  {
    path: 'funcionarios',
    loadComponent: () =>
      import('./funcionarios/funcionarios.component').then((mod) => mod.FuncionariosComponent),
  },
  {
    path: 'funcionario/:id/:route',
    loadComponent: () =>
      import('./funcionarios/detalle-funcionario/detalle-funcionario.component').then(
        (mod) => mod.DetalleFuncionarioComponent,
      ),
  },
  {
    path: 'funcionarios/crear',
    loadComponent: () =>
      import('./funcionarios/create/create.component').then((mod) => mod.CreateComponent),
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./patient/patient.component').then((mod) => mod.PatientComponent),
  },
  {
    path: 'puntosdispensacion',
    loadComponent: () =>
      import('./puntodispensacion/puntodispensacion.component').then(
        (mod) => mod.PuntodispensacionComponent,
      ),
  },
  {
    path: 'cups',
    loadComponent: () => import('./cups/cups.component').then((mod) => mod.CupsComponent),
  },
  {
    path: 'regimenes-niveles',
    loadComponent: () =>
      import('./regimenes-niveles/regimenes-niveles.component').then(
        (mod) => mod.RegimenesNivelesComponent,
      ),
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./catalogo/catalogo.component').then((mod) => mod.CatalogoComponent),
  },
  {
    path: 'catalogo/crear',
    loadComponent: () =>
      import('./productos/crear-producto/crear-producto.component').then(
        (mod) => mod.CrearProductoComponent,
      ),
  },
  {
    path: 'catalogo/editar/:id',
    loadComponent: () =>
      import('./productos/editar-producto/editar-producto.component').then(
        (mod) => mod.EditarProductoComponent,
      ),
  },
  {
    path: 'catalogo/ver/:id',
    loadComponent: () =>
      import('./productos/producto/producto.component').then((mod) => mod.ProductoComponent),
  },
  {
    path: 'tabla-catalogo',
    loadComponent: () =>
      import(
        './catalogo/components/table-productos-catalogo/table-productos-catalogo.component'
      ).then((mod) => mod.TableProductosCatalogoComponent),
  },
  {
    path: 'bodegas',
    loadComponent: () => import('./bodegas/bodegas.component').then((mod) => mod.BodegasComponent),
  },
  {
    path: 'bodegas/grupoestiba/:id',
    loadComponent: () =>
      import('./bodegas/grupoestiba/grupoestiba.component').then((mod) => mod.GrupoestibaComponent),
  },
  {
    path: 'turnos',
    loadComponent: () => import('./turnos/turnos.component').then((mod) => mod.TurnosComponent),
  },
  {
    path: 'turnos/crear',
    loadComponent: () =>
      import('./turnos/turno-fijo/create-turno-fijo/create-turno-fijo.component').then(
        (mod) => mod.CreateTurnoFijoComponent,
      ),
  },
  {
    path: 'turnos/crear/:id',
    loadComponent: () =>
      import('./turnos/turno-fijo/create-turno-fijo/create-turno-fijo.component').then(
        (mod) => mod.CreateTurnoFijoComponent,
      ),
  },
  {
    path: 'regimenes-niveles',
    loadComponent: () =>
      import('./regimenes-niveles/regimenes-niveles.component').then(
        (mod) => mod.RegimenesNivelesComponent,
      ),
  },
  {
    path: 'bodegas/grupoestiba/:id',
    loadComponent: () =>
      import('./bodegas/grupoestiba/grupoestiba.component').then((mod) => mod.GrupoestibaComponent),
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./clientes/clientes.component').then((mod) => mod.ClientesComponent),
  },
  {
    path: 'clientecrear',
    loadComponent: () =>
      import('./clientes/components/clientecrear/clientecrear.component').then(
        (mod) => mod.ClientecrearComponent,
      ),
  },
  {
    path: 'clienteeditar/:id',
    loadComponent: () =>
      import('./clientes/components/clientecrear/clientecrear.component').then(
        (mod) => mod.ClientecrearComponent,
      ),
  },
  {
    path: 'terceros',
    loadComponent: () =>
      import('./terceros/terceros.component').then((mod) => mod.TercerosComponent),
  },
  {
    path: 'terceros/crear-tercero',
    loadComponent: () =>
      import('./terceros/crear-terceros/crear-terceros.component').then(
        (mod) => mod.CrearTercerosComponent,
      ),
  },
  {
    path: 'terceros/editar-tercero/:id',
    loadComponent: () =>
      import('./terceros/crear-terceros/crear-terceros.component').then(
        (mod) => mod.CrearTercerosComponent,
      ),
  },
  {
    path: 'terceros/ver/:id',
    loadComponent: () =>
      import('./terceros/view-third/view-third.component').then((mod) => mod.ViewThirdComponent),
  },
  {
    path: 'terceros/personas',
    loadComponent: () =>
      import('./terceros/personas/personas.component').then((mod) => mod.PersonasComponent),
  },
  {
    path: 'responsables',
    loadComponent: () =>
      import('./responsables/responsables.component').then((mod) => mod.ResponsablesComponent),
  },
];
