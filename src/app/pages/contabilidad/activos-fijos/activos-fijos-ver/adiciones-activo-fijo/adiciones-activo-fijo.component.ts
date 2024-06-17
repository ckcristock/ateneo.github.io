import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-adiciones-activo-fijo',
  templateUrl: './adiciones-activo-fijo.component.html',
  styleUrls: ['./adiciones-activo-fijo.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NotDataComponent,
    CurrencyPipe,
    DatePipe,
  ],
})
export class AdicionesActivoFijoComponent implements OnInit {
  loading: boolean = false;
  @Input() Id: any;
  public Adiciones: any = [];
  // public funcionario:any = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
  public reducer_total = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Costo);
  envirom: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.listarAdicionesActivo();
    this.envirom = environment;
  }

  listarAdicionesActivo() {
    this.loading = true;
    this.http
      .get(environment.base_url + '/php/activofijo/adiciones_activo.php', {
        params: { id: this.Id },
      })
      .subscribe((data: any) => {
        this.Adiciones = data;
        this.loading = false;
      });
  }

  getTotal() {
    return this.Adiciones.reduce(this.reducer_total, 0);
  }
}
