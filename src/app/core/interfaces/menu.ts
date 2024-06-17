import { PermissionComponent } from './permissionComponent';
export interface Menu {
  name: String;
  icon: String;
  url: String;
  permissons: Array<PermissionComponent>;
}

export interface MenuInterface {
  id: number;
  icon: string;
  name: string;
  child: Child[];
  checked: boolean;
  [Symbol.iterator](): IterableIterator<Child>;
}

export interface Child {
  id: number;
  icon: null;
  link: null | string;
  name: string;
  child: Child[];
  order: number | null;
  parent_id: number;
  created_at: Date;
  updated_at: Date;
  description: ChildDescription | null;
  isUiElement: null;
  permissions?: Permission[];
  checked?: boolean;
  [Symbol.iterator](): IterableIterator<Child>;
}

export enum ChildDescription {
  Null = 'null',
}

export interface Permission {
  name: Name;
  Activo: boolean | number;
  menu_id: number;
  description: PermissionDescription;
  public_name: PublicName;
  permission_id: number;
  menu_permission_id: number;
}

export enum PermissionDescription {
  AprobarCategoriasProducto = 'Aprobar categorias producto',
  CrearNuevoRegistro = 'Crear nuevo registro',
  EditarRegistroExistente = 'Editar registro existente',
  ElFuncionarioPuedeRecibirLlamadasOAtientePresencialmente = 'El funcionario puede recibir llamadas o atiente presencialmente',
  VerElMenú = 'Ver el menú',
  VerTodasLasEmpresas = 'Ver todas las empresas',
}

export enum Name {
  Add = 'add',
  AllCompanies = 'all_companies',
  ApproveProductCategories = 'approve_product_categories',
  Edit = 'edit',
  ReceiveCalls = 'receive_calls',
  Show = 'show',
}

export enum PublicName {
  AprobarCategorías = 'Aprobar categorías',
  Crear = 'Crear',
  Editar = 'Editar',
  RecibirLlamadas = 'Recibir Llamadas',
  Ver = 'Ver',
  VerTodoEmpresas = 'Ver todo (empresas)',
}
