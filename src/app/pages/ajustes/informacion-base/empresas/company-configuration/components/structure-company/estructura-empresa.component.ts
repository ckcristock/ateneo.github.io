import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgbModal,
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
} from '@ng-bootstrap/ng-bootstrap';
import { DependenciesService } from 'src/app/services/dependencies.service';
import { GroupService } from 'src/app/services/group.service';
import { PositionService } from 'src/app/services/positions.service';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { Texteditor2Service } from 'src/app/pages/ajustes/informacion-base/services/texteditor2.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NotDataSaComponent } from 'src/app/components/not-data-sa/not-data-sa.component';
import { ModalService } from '@app/core/services/modal.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-estructura-empresa',
  templateUrl: './estructura-empresa.component.html',
  styleUrls: ['./estructura-empresa.component.scss'],
  standalone: true,
  imports: [
    CKEditorModule,
    NotDataSaComponent,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    CardComponent,
  ],
})
export class EstructuraEmpresaComponent implements OnInit {
  @ViewChild('modal') modal: any;
  grupos = [];
  dependencies = [];
  positions = [];
  loading: any = {
    grupos: false,
    dependencies: false,
    positions: false,
  };
  name = '';
  tipo = '';
  currentCompany: any;
  responsibilities: any = '';
  newType: boolean = false;

  constructor(
    private _group: GroupService,
    private _dependencies: DependenciesService,
    private _position: PositionService,
    public rutaActiva: ActivatedRoute,
    private swalService: SwalService,
    private _texteditor: Texteditor2Service,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.currentCompany = this.rutaActiva.snapshot.params.id;
    this.getGroupsByCompanyId();
  }

  getGroupsByCompanyId() {
    this.loading.grupos = true;
    let params: any = {};
    params ? (params.company_id = parseInt(this.currentCompany)) : '';

    this._group.getGroupsByCompanyId(params).subscribe((r: any) => {
      this.grupos = r.data;
      if (this.grupos.length > 0) {
        this.getDependencies(this.grupos[0].value);
        this.grupos[0].selected = true;
      }
      this.loading.grupos = false;
    });
  }

  handleClick(elemento, tipo) {
    if (tipo === 'grupo') {
      this.grupos.forEach((g) => (g.selected = false));
    } else if (tipo === 'dependency') {
      this.dependencies.forEach((d) => (d.selected = false));
    } else if (tipo === 'position') {
      this.positions.forEach((c) => (c.selected = false));
    }
    elemento.selected = true;
  }

  openConfirm(content, size = 'md') {
    this.modalService.open(content, size);
  }
  grupoSelected: any;
  getDependencies(group_id) {
    this.grupoSelected = group_id;
    this.loading.dependencies = true;
    this._dependencies.getDependencies({ group_id }).subscribe((r: any) => {
      this.dependencies = r.data;
      if (this.dependencies.length != 0) {
        this.getPositions(this.dependencies[0].value);
        this.dependencies[0].selected = true;
      } else {
        this.positions = [];
      }
      this.loading.dependencies = false;
    });
  }

  dependenceSelected: any;
  getPositions(dependency_id) {
    this.dependenceSelected = dependency_id;
    this.loading.positions = true;
    this._position.getPositions({ dependency_id }).subscribe((r: any) => {
      this.positions = r.data;
      this.loading.positions = false;
    });
  }

  openModal(tipo, add) {
    this.id = '';
    this.name = '';
    this.operation = 'guardar';
    const size = tipo === 'cargo' ? 'lg' : 'md';
    this.tipo = tipo;
    this.responsibilities = '';
    this.newType = true;
    this.openConfirm(add, size);
  }

  save() {
    if (this.tipo == 'dependencia') {
      let selected = this.grupos.find((r) => r.selected == true);
      let params: any = { group_id: selected.value, name: this.name };
      params ? (params.id = this.id) : '';
      this.saveDependency(params);
    }
    if (this.tipo == 'cargo') {
      let selected = this.dependencies.find((r) => r.selected == true);
      let params: any = { dependency_id: selected.value, name: this.name };
      params ? (params.id = this.id) : '';
      params ? (params.responsibilities = this.responsibilities) : '';
      this.savePosition(params);
    }

    if (this.tipo == 'grupo') {
      let params: any = { name: this.name };
      params ? (params.company_id = this.currentCompany) : '';
      params ? (params.id = this.id) : '';
      this.saveGroup(params);
    }
    this.newType = false;
  }

  saveGroup(params) {
    const request = (resolve: CallableFunction) => {
      this._group.save(params).subscribe({
        next: (res: any) => {
          this.getGroupsByCompanyId();
          resolve(true);
          let swal = {
            icon: 'success',
            title: 'Operación exitosa',
            text: res.data,
            timer: 1000,
            showCancel: false,
          };
          this.swalService.show(swal);
          this.modalService.close();
        },
      });
    };
    this.swalService.swalLoading('Vamos a guardar/actualizar el grupo', request);
  }
  saveDependency(params) {
    const request = (resolve: CallableFunction) => {
      this._dependencies.save(params).subscribe({
        next: (res: any) => {
          this.getDependencies(params.group_id);
          resolve(true);
          let swal = {
            icon: 'success',
            title: 'Operación exitosa',
            text: res.data,
            timer: 1000,
            showCancel: false,
          };
          this.swalService.show(swal);
          this.modalService.close();
        },
      });
    };
    this.swalService.swalLoading('Vamos a guardar/actualizar la dependencia', request);
  }
  savePosition(params) {
    const request = (resolve: CallableFunction) => {
      this._position.save(params).subscribe({
        next: (res: any) => {
          this.getPositions(params.dependency_id);
          resolve(true);
          let swal = {
            icon: 'success',
            title: 'Operación exitosa',
            text: res.data,
            timer: 1000,
            showCancel: false,
          };
          this.swalService.show(swal);
          this.modalService.close();
        },
      });
    };
    this.swalService.swalLoading('Vamos a guardar/actualizar el cargo', request);
  }
  id = '';
  operation = '';

  editar(tipo, modelo, add) {
    this.name = modelo.text;
    this.responsibilities = modelo.responsibilities;
    this.newType = false;
    const size = tipo === 'cargo' ? 'lg' : 'md';
    this.openConfirm(add, size);
    this.tipo = tipo;
    this.operation = 'editar';
    this.id = modelo.value;
  }
}
