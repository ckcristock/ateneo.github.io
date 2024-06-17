import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/core/services/user.service';
import { CompanyWorked } from 'src/app/core/interfaces/person.interface';
import { PuntosPipe } from '../../core/pipes/puntos';
import { NgOptimizedImage, NgIf, DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, NgIf, DecimalPipe, DatePipe, PuntosPipe],
})
export class CabeceraComponent implements OnChanges {
  @Input() datosCabecera: any;

  Empresa: CompanyWorked;

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
  ) {
    this.Empresa = this.userService.user.person.company_worked;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.datosCabecera.previousValue !== undefined) {
      this.datosCabecera = changes.datosCabecera.currentValue;
    }
  }
}
