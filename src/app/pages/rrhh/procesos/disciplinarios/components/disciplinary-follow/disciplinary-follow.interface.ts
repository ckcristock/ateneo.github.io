export interface DisciplinaryFollow {
  id: number;
  person_id: number;
  process_description: string;
  date_of_admission: Date;
  date_end: Date | null;
  created_at: Date;
  updated_at: Date;
  status: string;
  file: string;
  code: string;
  fileType: string;
  approve_user_id: number;
  close_description: string;
  memorandum_id: number;
  title: string;
  history: DisciplinaryHistory[];
  person: person;
  person_involved: DisciplinaryPersonInvolved[];
  legal_documents: legalDocument[];
  actions: ProcessAction[];
  closure: Closure;
}

export interface DisciplinaryHistory {
  id: number;
  person_id: number;
  user_id: number;
  company_id: number;
  title: string;
  description: string;
  icon: string;
  type: string;
  created_at: Date;
  updated_at: Date;
  historable_type: string;
  historable_id: number;
  user: user;
}

interface user {
  id: number;
  person_id: number;
  person_image_name: person;
}

interface person {
  id: number;
  image: string;
  full_names: string;
}

interface legalDocument {
  id: number;
  file: string;
  disciplinary_process_id: number;
  name: string;
  type: string;
  state: string;
  motivo: string;
  created_at: Date;
  updated_at: Date;
  size: number | null;
}

interface memorandumInvolved {
  id: number;
  memorandum_id: number;
  person_involved_id: number;
  created_at: Date;
  updated_at: Date;
  memorandum: memorandum;
  person_involved: DisciplinaryPersonInvolved;
}

export interface DisciplinaryPersonInvolved {
  id: number;
  observation: string;
  disciplinary_process_id: number;
  file: string;
  fileType: string;
  user_id: number;
  state: string;
  person_id: number;
  created_at: Date;
  updated_at: Date;
  person?: person;
  user?: user;
  memorandum_involved?: memorandumInvolved[];
}

interface memorandum {
  id: number;
  person_id: number;
  details: string;
  file: string;
  level: string;
  state: string;
  approve_user_id: number;
  created_at: Date;
  updated_at: Date;
  memorandum_type_id: number;
  memorandumtype: memorandumtype;
  person: person;
}

interface memorandumtype {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  status: string;
  company_id: number;
}

interface ProcessAction {
  id: number;
  disciplinary_process_id: number;
  user_id: number;
  description: string;
  file: string;
  created_at: string;
  updated_at: string;
  date: string;
  action_type: ActionType;
  user: user;
}

interface Closure {
  id: number;
  disciplinary_closure_reasons_id: number;
  disciplinary_process_id: number;
  user_id: number;
  description: string;
  file: string;
  created_at: string;
  updated_at: string;
  user: user;
  closure_reason: ClosureReason;
}

export interface ClosureReason {
  id: number;
  name: string;
  status: string;
  company_id: number;
  created_at: string;
  updated_at: string;
}

export interface ActionType {
  id: number;
  name: string;
  status: string;
  company_id: number;
  created_at: Date;
  updated_at: Date;
}
