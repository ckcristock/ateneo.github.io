import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getAsignadas(id, params = {}) {
    return this.http.get(`${environment.base_url}/taskfor/${id}`, { params });
  }

  personCompany(companyId) {
    return this.http.get(`${environment.base_url}/taskperson/${companyId}`);
  }

  personTasks(params = {}) {
    return this.http.get(`${environment.base_url}/person-tasks`, { params });
  }

  getArchivadas(params = {}) {
    return this.http.get(`${environment.base_url}/get-archivadas`, { params });
  }

  getTypes() {
    return this.http.get(`${environment.base_url}/task-types`);
  }

  saveType(data) {
    return this.http.post(`${environment.base_url}/task-types`, data);
  }

  paginateTypes(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-task-types`, { params });
  }

  statusUpdate(data) {
    return this.http.post(`${environment.base_url}/status-update`, data);
  }

  save(data) {
    return this.http.post(`${environment.base_url}/newtask`, data);
  }

  taskView(id) {
    return this.http.get(`${environment.base_url}/taskview/${id}`);
  }

  newComment(data) {
    return this.http.post(`${environment.base_url}/newcomment`, data);
  }

  deleteComment(commentId) {
    return this.http.get(`${environment.base_url}/deletecomment/${commentId}`);
  }

  updateComments(params = {}) {
    return this.http.get(`${environment.base_url}/update-comments`, { params });
  }
}
