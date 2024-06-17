export interface DetailsDianReport {
  id: number;
  person_id: number;
  payroll_payment_id: number;
  worked_days: number;
  salary: number;
  transportation_assistance: number;
  retentions_deductions: number;
  net_salary: number;
  created_at: Date;
  updated_at: Date;
  user_electronic_reported: null;
  electronic_reported_date: null;
  electronic_reported: null;
  status: null;
  code: string;
  cune: null;
  electronic_payroll: ElectronicPayroll;
  person_basic: PersonBasic;
}
export interface ElectronicPayroll {
  id: number;
  person_id: number;
  person_payroll_payment_id: number;
  cune: string;
  report_date: Date;
  status: string;
  dian_response: null;
  payroll_code: string;
  observation: null;
  created_at: Date;
  updated_at: Date;
}
export interface PersonBasic {
  id: number;
  image: string;
  full_names: string;
}
