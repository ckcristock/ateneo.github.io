import { Component, OnInit } from '@angular/core';
import { VerViaticosService } from '../ver-viaticos/ver-viaticos.service';
import { ActivatedRoute } from '@angular/router';
import { PlaceholderFormComponent } from '../../../../components/placeholder-form/placeholder-form.component';
import { CrearViaticosComponent } from '../crear-viaticos/crear-viaticos.component';

@Component({
  selector: 'app-editar-viatico',
  templateUrl: './editar-viatico.component.html',
  styleUrls: ['./editar-viatico.component.scss'],
  standalone: true,
  imports: [CrearViaticosComponent, PlaceholderFormComponent],
})
export class EditarViaticoComponent implements OnInit {
  id: string;
  data: any;
  loading: boolean;
  constructor(
    private route: ActivatedRoute,
    private _viatico: VerViaticosService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.getData();
  }

  getData() {
    this.loading = true;
    this._viatico.getAllViaticos(this.id).subscribe((r: any) => {
      this.data = r.data;
      this.loading = false;
    });
  }
}
