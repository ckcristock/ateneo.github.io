import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  sideBar: any;

  constructor() {}

  onTaskButtonClicked() {
    this.sideBar.toggle();
  }
}
