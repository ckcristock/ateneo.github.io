import { Component, OnInit, Input } from '@angular/core';
import { PermissionService } from '../../../../../../core/services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from '../../../services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MenuChildComponent } from './menu-child/menu-child.component';

import { PersonConfigComponent } from './person-config/person-config.component';
interface NavItem {
  name: string;
  link: boolean;
  id: string;
  child: NavItem[];
}
@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  standalone: true,
  imports: [PersonConfigComponent, MenuChildComponent, NotDataComponent],
})
export class PermissionsComponent implements OnInit {
  @Input('person_id') person_id_: string = '';
  person_id: string;
  temporalMenues: Array<NavItem> = [];
  menues: Array<NavItem> = [];
  loading = false;
  saving = false;
  constructor(
    private _permissions: PermissionService,
    private route: ActivatedRoute,
    private router: Router,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.person_id = this.route.snapshot.params.id || this.person_id_;
    this.getMenuByPerson();
  }

  //? Comentada porque era una manera antigua de solicitar el menú del usuario, era demasiado lenta y hacía muchas peticiones a la base de datos
  /* getMenues() {
    this.loading = true;
    this._permissions.getPermissions({ person_id: this.person_id }).subscribe((r: any) => {
      this.menues = r;
      this.loading = false;
    });
  } */

  getMenuByPerson() {
    this.loading = true;
    const personId = Number(this.person_id);
    this._permissions.getMenuByPerson(personId).subscribe({
      next: (r: any) => {
        this.menues = r;
        this.loading = false;
      },
    });
  }

  save() {
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Se actualizarán los permisos del usuario',
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.value) {
          this.sendData();
        }
      });
  }

  sendData() {
    this.saving = true;
    let filteredMenu = this.filtertData(JSON.parse(JSON.stringify(this.menues)));
    filteredMenu = this.filterGrandpa(filteredMenu);
    this._permissions.save({ filteredMenu, person_id: this.person_id }).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal
          .show({
            title: 'Actualización exitosa',
            icon: 'success',
            text: 'Los permisos del usuario se han actualizado',
            showCancel: false,
          })
          .then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/ajustes/informacion-base/funcionarios');
            }
          });
      }
      this.saving = false;
    });
  }

  public indexMenu = (acc, els) => {
    if (els.child.length > 0) {
      els.child.reduce(this.indexMenu, els.child, {});
    }
    if (els.permissions) {
      els.permissions = els.permissions.reduce(this.indexPermissons, {});
    }
    return { ...acc, [els.name]: els };
  };

  public indexPermissons = (acc, el) => ({ ...acc, [el.name]: el });

  public filtertData(menu: any, parent: any = {}, x = -1) {
    for (let element of menu) {
      x++;
      if (element.child) {
        this.filtertData(element.child, element);
      }
      try {
        //Buscamos padres sin hijos
        if (element.child.length == 0 && !element.link && element.parent_id) {
          /*   console.log('padre', element, parent, x); */
          let pos = parent.child.findIndex((f) => f.id == element.id);
          throw pos;
        }

        if (element.link) {
          //eliminamos hijos sin permiso show
          element.permissions.forEach((ele) => {
            if (ele.name == 'show' && !ele.Activo) {
              throw x;
            }
          });
        }
      } catch (posDel) {
        /*   console.log(element, parent, posDel); */
        parent.child.splice(posDel, 1);
        this.filtertData(menu, parent);
      }
    }
    return menu;
  }

  filterGrandpa(menu: Array<NavItem>) {
    return menu.filter((d) => d.child.length > 0 || d.name == 'Tablero');
  }
}
