import { Component, OnInit } from '@angular/core';
import { BuildingComponent } from '../../../components/building/building.component';

@Component({
  selector: 'app-indicadores-gestion',
  templateUrl: './indicadores-gestion.component.html',
  styleUrls: ['./indicadores-gestion.component.scss'],
  standalone: true,
  imports: [BuildingComponent],
})
export class IndicadoresGestionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
