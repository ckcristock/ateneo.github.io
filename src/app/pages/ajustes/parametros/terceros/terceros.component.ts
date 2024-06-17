import { Component, OnInit } from '@angular/core';
import { ResponsabilidadesFiscalesComponent } from './components/responsabilidades-fiscales/responsabilidades-fiscales.component';
import { TiposRegimenComponent } from './components/tipos-regimen/tipos-regimen.component';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss'],
  standalone: true,
  imports: [TiposRegimenComponent, ResponsabilidadesFiscalesComponent],
})
export class TercerosComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
