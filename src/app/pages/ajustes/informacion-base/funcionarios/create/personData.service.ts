import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Person } from 'src/app/core/models/person.model';

@Injectable({
  providedIn: 'root',
})
export class PersonDataService {
  person = new BehaviorSubject<Person>(new Person());

  constructor() {}
}
