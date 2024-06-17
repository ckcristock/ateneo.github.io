import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { SwalService } from '../../../../services/swal.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgTemplateOutlet } from '@angular/common';
interface NavItem {
  checked: boolean;
  name: string;
  link: boolean;
  child: NavItem[];
  permissions: any;
}
@Component({
  selector: 'app-menu-child',
  templateUrl: './menu-child.component.html',
  styleUrls: ['./menu-child.component.scss'],
  standalone: true,
  imports: [MatExpansionModule, MatSlideToggleModule, NgTemplateOutlet],
})
export class MenuChildComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() navItems: NavItem[];

  color = 'primary';
  disabled = false;

  constructor(private _swal: SwalService) {}

  ngOnInit(): void {
    this.isChecked(this.navItems);
  }

  isChecked(array) {
    array.forEach((element1) => {
      element1.checked = this.checkPermissions(element1);
      element1.child.forEach((element2) => {
        element2.checked = this.checkPermissions(element2);
        element2.child.forEach((element3) => {
          element3.checked = this.checkPermissions(element3);
          element3.child.forEach((element4) => {
            element4.checked = this.checkPermissions(element4);
          });
          if (!element3.checked) {
            element2.checked = false;
            element1.checked = false;
          }
        });
        if (!element2.checked) {
          element1.checked = false;
        }
      });
    });
  }

  checkPermissions(element) {
    if (element.permissions) {
      for (let permission of element.permissions) {
        if (!permission.Activo) {
          return false;
        }
      }
    }
    return true;
  }

  changeAll(item, event) {
    item.child.forEach((el) => {
      el.permissions?.forEach((permission) => {
        if (event.checked) {
          permission.Activo = true;
        } else {
          permission.Activo = false;
        }
      });
      el.child?.forEach((child) => {
        child.permissions?.forEach((childPermission) => {
          if (event.checked) {
            childPermission.Activo = true;
          } else {
            childPermission.Activo = false;
          }
        });
        child.child?.forEach((subchild) => {
          subchild.permissions?.forEach((childPermission) => {
            if (event.checked) {
              childPermission.Activo = true;
            } else {
              childPermission.Activo = false;
            }
          });
        });
      });
    });
    this.isChecked(this.navItems);
  }

  activateAll(permissions) {
    let state: boolean = true;
    permissions.forEach((element) => {
      if (!element.Activo) {
        element.Activo = true;
        state = false;
      }
    });
    if (state) {
      permissions.forEach((element) => {
        element.Activo = false;
      });
    }
    this.isChecked(this.navItems);
  }
}
