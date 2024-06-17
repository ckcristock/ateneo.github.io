import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/users.model';
import { LoginForm } from '../interfaces/login-form.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user: User;

  private renewingTokenSubject = new Subject<boolean>();

  get renewingToken$(): Observable<boolean> {
    return this.renewingTokenSubject.asObservable();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.renewingTokenSubject.next(true);
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  guardarLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }

  validateToken(): Observable<boolean> {
    this.renewingTokenSubject.next(true);
    return this.http.get(`${base_url}/auth/renew`, {}).pipe(
      map((resp: any) => {
        const { id, usuario, change_password, person, menu, board, task } = resp.user;
        this.user = new User(id, usuario, change_password, person, menu, board, task);
        this.guardarLocalStorage(resp.token);
        this.renewingTokenSubject.next(false);
        return true;
      }),
      catchError((error) => {
        this.renewingTokenSubject.next(false);
        return of(false);
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/auth/login`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token);
      }),
    );
  }

  restorePassword(id: number | string) {
    return this.http.get(`${base_url}/auth/restore-password/${id}`);
  }

  changePassword(params) {
    return this.http.get(`${base_url}/auth/change-password`, { params });
  }

  changeCompany(companyId) {
    return this.http.post(`${base_url}/change-company-work/${companyId}`, {});
  }
}
