export interface UserDetail {
  id: number;
  identifier: number;
  type_document_id: null;
  first_name: string;
  second_name: string;
  first_surname: string;
  second_surname: string;
  full_name: string;
  full_names: string;
  birth_date: string;
  birth_place: null;
  blood_type: string;
  phone: string;
  optional_phone: null;
  cellphone: null;
  email: string;
  address: string;
  marital_status: string;
  degree_instruction: null;
  title: string;
  talla_pantalon: null;
  talla_bata: null;
  talla_botas: null;
  talla_camisa: null;
  image: string;
  image_blob: string;
  signature_blob: null;
  eps_id: number;
  compensation_fund_id: number;
  degree: string;
  number_of_children: number;
  people_type_id: number;
  severance_fund_id: number;
  shirt_size: number;
  pension_fund_id: number;
  arl_id: null;
  personId: null;
  persistedFaceId: null;
  sex: null;
  status: string;
  pants_size: number;
  signature: null;
  color: null;
  medical_record: null;
  company_id: number;
  specialities: null;
  department_id: null;
  municipality_id: null;
  external_id: null;
  date_last_session: null;
  created_at: string;
  updated_at: string;
  to_globo: number;
  can_schedule: number;
  cell_phone: string;
  payroll_risks_arl_id: number;
  company_worked_id: number;
  dispensing_point_id: null;
  place_of_birth: null;
  gener: string;
  visa: string;
  passport_number: null;
  contractultimate_full_information: ContractultimateFullInformation;
  work_contracts: WorkContract[];
  usuario: Usuario;
  eps: Eps;
  arl: AffiliationsFund | null;
  compensation_fund: AffiliationsFund;
  severance_fund: AffiliationsFund | null;
  pension_funds: AffiliationsFund;
}

export interface AffiliationsFund {
  id: number;
  name: string;
  code: null | string;
  nit: null | string;
  created_at: null | string;
  updated_at: null | string;
  status: string;
}

export interface ContractultimateFullInformation {
  id: number;
  position_id: number;
  company_id: number;
  liquidated: number;
  person_id: number;
  salary: number;
  turn_type: string;
  fixed_turn_id: number;
  date_of_admission: string;
  work_contract_type_id: number;
  date_end: null;
  created_at: string;
  updated_at: string;
  rotating_turn_id: null;
  contract_term_id: number;
  old_date_end: null;
  transport_assistance: number;
  position: ContractultimateFullInformationPosition;
  work_contract_type: ContractTerm;
  contract_term: ContractTerm;
  company: Company;
  bonifications: any[];
  fixed_turn: FixedTurn;
  rotating_turn: null;
}

export interface Company {
  id: number;
  name: string;
  short_name: null;
  tin: string;
  dv: number;
  address: string;
  code: string;
  agreements: null;
  category: string;
  city: string;
  country_code: string;
  creation_date: string;
  disabled: number;
  email: string;
  encoding_characters: string;
  interface_id: number;
  logo: null;
  parent_id: number;
  pbx: null;
  regional_id: number;
  send_email: number;
  settings: string;
  slogan: string;
  phone: null;
  email_contact: null;
  social_reason: null;
  document_type: null;
  state: number;
  telephone: string;
  type: number;
  api_key: null;
  globo_id: null;
  simbol: string;
  payment_frequency: null;
  account_type: null;
  account_number: null;
  bank_id: null;
  payment_method: null;
  base_salary: null;
  paid_operator: null;
  law_1429: null;
  law_590: null;
  law_1607: null;
  transportation_assistance: null;
  arl_id: null;
  night_end_time: null;
  night_start_time: null;
  max_late_arrival: null;
  max_holidays_legal: null;
  max_extras_hours: null;
  page_heading: null;
  created_at: null;
  updated_at: null;
}

export interface ContractTerm {
  id: number;
  name: string;
  status: string;
  created_at: null | string;
  updated_at: string;
  conclude: number;
  modified: number;
  description: null | string;
}

export interface FixedTurn {
  id: number;
  name: string;
  extra_hours: number;
  entry_tolerance: number;
  leave_tolerance: number;
  color: string;
  company_id: number;
  created_at: string;
  updated_at: string;
  state: string;
  horarios_turno_fijo: HorariosTurnoFijo[];
}

export interface HorariosTurnoFijo {
  id: number;
  day: string;
  fixed_turn_id: number;
  entry_time_one: string;
  leave_time_one: string;
  jornada_turno: string;
  entry_time_two: string;
  leave_time_two: string;
}

export interface ContractultimateFullInformationPosition {
  id: number;
  dependency_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  dependency: Dependency;
}

export interface Dependency {
  id: number;
  name: string;
  group_id: number;
  created_at: string;
  updated_at: string;
  group: Group;
}

export interface Group {
  id: number;
  name: string;
  created_at: null | string;
  updated_at: string;
  company_id?: number;
  group_id?: number;
}

export interface Eps {
  id: number;
  name: string;
  logo: string;
  address: string;
  agreements_id: number;
  category: string;
  city: string;
  code: string;
  country_code: string;
  creation_date: string;
  disabled: number;
  epss_id: number;
  email: string;
  encoding_characters: string;
  interface_id: number;
  parent_id: number;
  pbx: string;
  regional_id: number;
  send_email: number;
  settings: string;
  slogan: string;
  state: string;
  telephone: string;
  nit: string;
  type: number;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface Usuario {
  id: number;
  usuario: string;
  person_id: number;
  menu: Menu[];
  created_at: string;
  updated_at: string;
  change_password: number;
  password_updated_at: null;
  board_id: null;
}

export interface Menu {
  id: number;
  name: string;
  child: any[];
}

export interface WorkContract {
  id: number;
  position_id: number;
  company_id: number;
  liquidated: number;
  person_id: number;
  salary: number;
  turn_type: string;
  fixed_turn_id: number;
  date_of_admission: string;
  work_contract_type_id: number;
  date_end: null;
  created_at: string;
  updated_at: string;
  rotating_turn_id: null;
  contract_term_id: number;
  old_date_end: null;
  transport_assistance: number;
  position: WorkContractPosition;
  company: Company;
  work_contract_type: ContractTerm;
}

export interface WorkContractPosition {
  id: number;
  dependency_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  dependency: Group;
}
