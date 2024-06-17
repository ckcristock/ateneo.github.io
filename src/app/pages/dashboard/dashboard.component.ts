import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { BuildingComponent } from '../../components/building/building.component';
import { GraficalModuleComponent } from '../grafical-module/grafical-module.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [NgIf, GraficalModuleComponent, BuildingComponent],
})
export class DashboardComponent implements OnInit {
  /* public board: any; */

  constructor(
    public _user: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.validarTablero();
  }
  board: any;
  validarTablero() {
    if (this._user.user.board) {
      switch (this._user.user.board.name_board) {
        case 'LIDER CECON':
          this.board = 1;
          return this.board;
        case 'CECON':
          this.board = 0;
          return this.board;
        default:
          this.board = 0;
          return this.board;
      }
      /* if (this._user.user.board.name_board == 'LIDER CECON'){
        this.board = 1;
        return this.board;
      } else {
        this.board = 0;
        return this.board;
      } */
    } else {
      this.board = 0;
      return this.board;
    }
  }
}
