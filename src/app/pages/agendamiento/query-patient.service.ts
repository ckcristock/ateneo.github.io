import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Patient } from '../../core/models/patient.model';
import { Call } from '../../core/models/call.model';
import { asignarCitaDynamic } from '../../core/models/asignarCitaDynamic.model';
import { TipificationData } from 'src/app/core/models/typificationData.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QueryPatient {
  public existPatient: EventEmitter<any> = new EventEmitter();
  public patient = new BehaviorSubject<any>({ llamada: new Call(), paciente: new Patient() });
  public cita = new Subject<any>();
  public infowailist = new BehaviorSubject<any>({});
  public space = new Subject<any>();

  public tramiteSelected = new BehaviorSubject<asignarCitaDynamic>(new asignarCitaDynamic());
  public tipificationData = new BehaviorSubject<TipificationData>(new TipificationData());

  constructor(private clientHttp: HttpClient) {}

  resetModels() {
    this.patient.next({ llamada: new Call(), paciente: new Patient() });
    this.tramiteSelected.next(new asignarCitaDynamic());
  }

  public validateInfoPatient(data) {
    return this.clientHttp.get(`${environment.base_url}/validate-info-patient`, { params: data });
  }

  public finalizeMyManagment() {
    return this.clientHttp.get(`${environment.base_url}/finalize-my-calls`);
  }

  resetPatient() {
    this.patient.next({ llamada: new Call(), paciente: new Patient() });
  }

  validate(patient) {
    let title = 'Faltan campos del paciente';
    if (!patient.type_document_id) throw { title, message: 'Es necesario el tipo de documento' };
    if (!patient.identifier) throw { title, message: 'Es necesario el número de identificación' };
    if (!patient.firstname) throw { title, message: 'Es necesario el primer nombre' };
    // if(!patient . middlenametitle ,) {message:throw ('Es necesario el segundo nombre'})
    if (!patient.surname) throw { title, message: 'Es necesario el primer apellido' };
    //if(!patient .secondsurnametitle ,) t{message:hrow ('Es necesario el segundo apellido'})
    if (!patient.eps_id) throw { title, message: 'Es necesario la EPS' };
    if (!patient.regimen_id) throw { title, message: 'Es necesario el régimen' };
    if (!patient.level_id) throw { title, message: 'Es necesario el nivel' };
    if (!patient.date_of_birth) throw { title, message: 'Es necesaria la fecha de nacimiento' };
    if (!patient.gener) throw { title, message: 'Es necesario el género' };
    if (!patient.department_id) throw { title, message: 'Es necesario el departamento' };
    if (!patient.municipality_id) throw { title, message: 'Es necesario el municipio' };
    //if (!patient.contract_id) throw ({ title, message: 'Es necesario el contrato' })
    if (!patient.company_id) throw { title, message: 'Es necesario la empresa' };
    if (!patient.location_id) throw { title, message: 'Es necesaria la sede' };
    if (!patient.email) throw { title, message: 'Es necesario el email' };
    if (!patient.address) throw { title, message: 'Es necesaria la dirección' };
    if (!patient.phone) throw { title, message: 'Es necesario el teléfono' };
    /*  if(!patient.id) throw ('El paciente no ha sido creado')  */
  }

  //usar en try catch :)
  validateTipification({ component, data }) {
    if (!component)
      throw { title: 'Faltan datos del proceso', message: 'Es necesario el tipo de documento' };
    if (component.hasAmbits && !data.ambit_id)
      throw { title: 'Faltan datos del proceso', message: 'Debe seleccionar un ámbito' };
    if (component.hasTypeServices && !data.type_service_id)
      throw { title: 'Faltan datos del proceso', message: 'Debe seleccionar un tipo de servicio' };
  }
}
