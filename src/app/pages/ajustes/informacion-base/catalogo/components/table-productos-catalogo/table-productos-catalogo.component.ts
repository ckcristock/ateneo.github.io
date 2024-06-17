import { Component, Input, OnInit } from '@angular/core';
import { CatalogoService } from '../../catalogo.service';

@Component({
  selector: 'app-table-productos-catalogo',
  templateUrl: './table-productos-catalogo.component.html',
  styleUrls: ['./table-productos-catalogo.component.scss'],
  standalone: true,
})
export class TableProductosCatalogoComponent implements OnInit {
  @Input('type') type: any;

  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  };

  filtros: any = {
    name: '',
  };

  constructor(private _catalogo: CatalogoService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination,
      ...this.filtros,
      tipo: this.type,
    };
    this._catalogo.getData(params).subscribe((r: any) => {});
  }
}
