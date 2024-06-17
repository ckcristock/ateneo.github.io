import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request, RequestPaginate } from '@shared/interfaces/request.interface';

export interface HistoryModelPaginate {
  id: number;
  name: string;
  company_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  template_sections: TemplateSection[];
  specialities: Speciality[];
}

export interface Speciality {
  id: number;
  code: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  pivot: SpecialityPivot;
}

export interface SpecialityPivot {
  template_id: number;
  speciality_id: number;
}

export interface TemplateSection {
  id: number;
  created_at: Date;
  updated_at: Date;
  template_id: number;
  section_id: number;
  deleted_at: null;
  section: Section;
}

export interface Section {
  id: number;
  name: string;
  fixed: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  variables: Variable[];
}

export interface Variable {
  id: number;
  name: string;
  size: string;
  required: number;
  section_id: number;
  variable_type_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  conditions: Condition[];
}

export interface Condition {
  id: number;
  name: string;
  value: string;
  type: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  pivot: ConditionPivot;
}

export interface ConditionPivot {
  variable_id: number;
  type_condition_id: number;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryModelsService {
  API_URL = environment.base_url;

  constructor(private httpClient: HttpClient) {}

  sectionList(params = {}) {
    return this.httpClient.get(`${this.API_URL}/sections-list`, { params });
  }

  getVariablesTypes() {
    return this.httpClient.get(`${this.API_URL}/variable-type-list`);
  }

  templatesPaginate(params = {}) {
    return this.httpClient.get<Request<RequestPaginate<HistoryModelPaginate[]>>>(
      `${this.API_URL}/templates-paginate`,
      { params },
    );
  }

  getTemplate(id: number) {
    return this.httpClient.get<Request<HistoryModelPaginate>>(`${this.API_URL}/templates/${id}`);
  }
}
