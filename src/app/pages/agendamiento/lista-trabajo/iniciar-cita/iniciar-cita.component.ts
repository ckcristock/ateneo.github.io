import { Component, OnInit } from '@angular/core';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-iniciar-cita',
  standalone: true,
  imports: [NotDataComponent],
  templateUrl: './iniciar-cita.component.html',
  styleUrl: './iniciar-cita.component.scss',
})
export class IniciarCitaComponent implements OnInit {
  loading: boolean = false;
  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 10000);
  }
}
