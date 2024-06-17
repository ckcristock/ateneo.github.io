import { Component, OnInit } from '@angular/core';
import { debounceTime, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RemisionModelNuevo } from '../RemisonModelNuevo';
import { environment } from 'src/environments/environment';
import { RemisionnuevoService } from '../../services/remisionnuevo.service';
import { ProductosremisionnuevoComponent } from './productosremisionnuevo/productosremisionnuevo.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AutocompleteMdlComponent } from '@app/components/autocomplete-mdl/autocomplete-mdl.component';
import { CategoriasService } from '@app/pages/ajustes/informacion-base/empresas/company-configuration/components/categorias/categorias.service';
import { NotDataSaComponent } from '@app/components/not-data-sa/not-data-sa.component';

@Component({
  selector: 'app-remisioncrearnuevo',
  templateUrl: './remisioncrearnuevo.component.html',
  styleUrls: ['./remisioncrearnuevo.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CabeceraComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgIf,
    NgFor,
    NgSelectModule,
    NgClass,
    MatInputModule,
    TextFieldModule,
    ProductosremisionnuevoComponent,
    CardComponent,
    AutocompleteMdlComponent,
    NotDataSaComponent,
  ],
})
export class RemisioncrearnuevoComponent implements OnInit {
  public RutaPrincipal: string = environment.ruta;
  public Datos: any = {
    Titulo: 'Nueva remisión',
    Fecha: new Date(),
    Codigo: '',
  };
  public Cliente: any = [];
  public ModeloRemision: RemisionModelNuevo = new RemisionModelNuevo(environment.id_funcionario);

  public Datos_Iniciales: any = {};
  public Origen: any = [];
  public Categorias_Nuevas: any = [];
  public Grupos: any = [];
  public Destino: any = [];
  public Meses: any = [];
  public Contratos: any = [];
  public Bodegas_Nuevo: any = [];
  loading = true;
  categories = [];

  public ActualizarModelProductos: Subject<any> = new Subject();
  private EnviarPendientes: Subject<any> = new Subject();

  constructor(
    private http: HttpClient,
    private readonly categoryService: CategoriasService,
  ) {}

  ngOnInit() {
    this.GetDatosIniciales();
    this.getCategories();
    for (let i = 1; i <= 18; i++) {
      this.Meses.push({
        dia: i,
      });
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.Cliente.filter(
              (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 100),
      ),
    );

  formatter = (x: { Nombre: string }) => x.Nombre;

  Cambiar_Remision() {
    this.ModeloRemision.Id_Destino = 0;
    if (this.ModeloRemision.Tipo == 'Interna') {
      this.Destino = this.Datos_Iniciales.Punto;
      this.ModeloRemision.Modelo = 'Bodega-Bodega';
      this.ModeloRemision.Estado = 'Pendiente';
      this.ModeloRemision.Estado_Alistamiento = '0';
      this.ModeloRemision.Tipo_Origen = 'Bodega';
      this.ModeloRemision.Tipo_Destino = 'Punto_Dispensacion';
    } else if (this.ModeloRemision.Tipo == 'Contrato') {
      this.http
        .get(environment.base_url + '/php/rotativoscompras/get_contratos_remision.php')
        .subscribe((data: any) => {
          this.Contratos = data.Contratos;
          this.Destino = this.Datos_Iniciales.Clientes;
          this.ModeloRemision.Estado_Alistamiento = '0';
          this.ModeloRemision.Estado = 'Pendiente';
          this.ModeloRemision.Tipo_Origen = 'Bodega';
          this.ModeloRemision.Tipo_Destino = 'Contrato';
        });
    } else {
      this.Destino = this.Datos_Iniciales.Clientes;
      this.ModeloRemision.Estado_Alistamiento = '0';
      this.ModeloRemision.Estado = 'Pendiente';
      this.ModeloRemision.Tipo_Origen = 'Bodega';
      this.ModeloRemision.Tipo_Destino = 'Cliente';
    }
    this.EnviarModelo();
  }

  EnviarModelo(flag = true) {
    let p = { modelo: this.ModeloRemision, actualizar_productos: flag };
    this.ActualizarModelProductos.next(p);
  }

  getCategoryField() {
    this.categoryService.getCampos(this.ModeloRemision.Category, { lists: '' }).subscribe({
      next: (res: any) => {
        this.categoryService.categoryFields = res.data;
      },
    });
  }

  ActualizarModelo(modelo: any) {
    if (modelo.Tipo_Origen == 'Bodega') {
      this.ModeloRemision = modelo;
      this.Datos.Origen_Grupo = modelo.Grupo.Id_Grupo.toString();
    }
    if (this.ModeloRemision.Tipo == 'Interna') {
      switch (this.ModeloRemision.Modelo) {
        case 'Punto-Bodega':
          this.Datos.Destino = 'B-' + this.ModeloRemision.Id_Destino;
          this.Datos.Origen = 'P-' + this.ModeloRemision.Id_Origen;
          break;
        case 'Punto-Punto':
          this.Datos.Destino = 'P-' + this.ModeloRemision.Id_Destino;
          this.Datos.Origen = 'P-' + this.ModeloRemision.Id_Origen;
          break;
        case 'Bodega-Bodega':
          this.Datos.Destino = 'B-' + this.ModeloRemision.Id_Destino;
          this.Datos.Origen = 'B-' + this.ModeloRemision.Id_Origen;
          break;
        case 'Bodega-Punto':
          this.Datos.Destino = 'P-' + this.ModeloRemision.Id_Destino;
          this.Datos.Origen = 'B-' + this.ModeloRemision.Id_Origen;
          break;
      }
      setTimeout(() => {
        this.CambiarPunto(false);
      }, 300);
    } else {
      this.Datos.Destino = 'B-' + this.ModeloRemision.Id_Destino;
      this.Datos.Origen = 'C-' + this.ModeloRemision.Id_Origen;
      this.Destino = this.Datos_Iniciales.Clientes;
      this.Origen = this.Datos_Iniciales.Bodega;
    }
  }
  setGrupo() {
    this.ModeloRemision.Grupo.Id_Grupo = 0;
    this.ModeloRemision.Grupo.Nombre_Grupo = '';
    this.ModeloRemision.Grupo.Fecha_Vencimiento = '';
    this.ModeloRemision.Grupo.Presentacion = '';
    this.Datos.Origen_Grupo = '';
  }
  CambiarPunto(cambiarlista = true) {
    switch (this.ModeloRemision.Modelo) {
      case 'Punto-Bodega':
        this.Origen = this.Datos_Iniciales.Punto;
        this.Destino = this.Datos_Iniciales.Bodega;
        this.ModeloRemision.Estado_Alistamiento = '2';
        this.ModeloRemision.Estado = 'Alistada';
        this.ModeloRemision.Tipo_Origen = 'Punto_Dispensacion';
        this.ModeloRemision.Tipo_Destino = 'Bodega';
        this.setGrupo();
        break;
      case 'Punto-Punto':
        this.Origen = this.Datos_Iniciales.Punto;
        this.Destino = this.Datos_Iniciales.Punto;
        this.ModeloRemision.Estado_Alistamiento = '2';
        this.ModeloRemision.Estado = 'Alistada';
        this.ModeloRemision.Tipo_Origen = 'Punto_Dispensacion';
        this.ModeloRemision.Tipo_Destino = 'Punto_Dispensacion';
        this.setGrupo();
        break;
      case 'Bodega-Punto':
        this.Origen = this.Datos_Iniciales.Bodega;
        this.Destino = this.Datos_Iniciales.Punto;
        this.ModeloRemision.Estado_Alistamiento = '0';
        this.ModeloRemision.Estado = 'Pendiente';
        this.ModeloRemision.Tipo_Origen = 'Bodega';
        this.ModeloRemision.Tipo_Destino = 'Punto_Dispensacion';
        break;
      case 'Bodega-Bodega':
        this.Origen = this.Datos_Iniciales.Bodega;
        this.Destino = this.Datos_Iniciales.Bodega;
        this.ModeloRemision.Estado_Alistamiento = '0';
        this.ModeloRemision.Estado = 'Pendiente';
        this.ModeloRemision.Tipo_Origen = 'Bodega';
        this.ModeloRemision.Tipo_Destino = 'Bodega';
        break;
    }
    if (cambiarlista) {
      setTimeout(() => {
        this.EnviarModelo();
      }, 100);
    }
  }

  GetDatosIniciales() {
    let params: any = {};
    params.id = environment.id_funcionario;
    this.http
      .get(environment.base_url + '/php/remision_nuevo/get_datos_iniciales.php', { params: params })
      .subscribe((data: any) => {
        this.Datos_Iniciales = data;
        this.Cliente = data.Clientes;
        this.Origen = data.Bodega;
        this.Destino = data.Punto;
        this.Cambiar_Remision();
        this.CambiarPunto();
        this.loading = false;
      });
  }
  getCategoriasNuevas() {
    let params: any = {};
    params.id_bodega_nuevo = this.ModeloRemision.Id_Origen;
    params.text = true;
    this.http
      .get(environment.base_url + '/php/categoria_nueva/get_categorias_por_bodega.php', {
        params: params,
      })
      .subscribe((res: any) => {
        if (res.Tipo == 'success') {
          this.Categorias_Nuevas = res.Categorias;
        }
      });
  }

  private getCategories() {
    this.categoryService.listarCategorias().subscribe({
      next: (res: any) => {
        this.categories = res.data;
      },
    });
  }

  AsignarNombre(tipo) {
    if (tipo == 'Origen') {
      let pos = this.Origen.findIndex((x) => x.value === this.Datos.Origen);
      if (pos >= 0) {
        if (this.ModeloRemision.Tipo_Origen == 'Bodega') {
          this.ModeloRemision.Id_Origen = this.Origen[pos].value.substr(2);
          this.ModeloRemision.Nombre_Origen = this.Origen[pos].text;
        } else {
          this.ModeloRemision.Id_Origen = this.Origen[pos].value.substr(2);
          this.ModeloRemision.Nombre_Origen = this.Origen[pos].text;
        }
      }
    } else if (tipo == 'Destino') {
      let pos = this.Destino.findIndex((x) => x.value === this.Datos.Destino);
      if (pos >= 0) {
        this.ModeloRemision.Id_Destino = this.Destino[pos].value.substr(2);
        this.ModeloRemision.Nombre_Destino = this.Destino[pos].text;
        if (this.ModeloRemision.Tipo == 'Cliente') {
          this.ModeloRemision.Id_Lista = this.Destino[pos].Id_Lista_Ganancia;
        }
      }
    } else if (tipo == 'Contrato') {
      let pos = this.Contratos.findIndex((x) => x.value === this.Datos.DestinoContrato);
      if (pos >= 0) {
        this.ModeloRemision.Id_Contrato = this.Contratos[pos].value;
        this.ModeloRemision.Id_Destino = this.Contratos[pos].value;
        this.ModeloRemision.Nombre_Destino = this.Contratos[pos].text;
      }
    }
    // if (tipo == 'Grupo') {
    //   let pos = this.Grupos.findIndex((x) => x.value === this.Datos.Origen_Grupo);
    //   if (pos >= 0) {
    //     this.ModeloRemision.Grupo.Id_Grupo = this.Grupos[pos].value;
    //     this.ModeloRemision.Grupo.Nombre_Grupo = this.Grupos[pos].text;
    //     this.ModeloRemision.Grupo.Fecha_Vencimiento = this.Grupos[pos].Fecha_Vencimiento;
    //     this.ModeloRemision.Grupo.Presentacion = this.Grupos[pos].Presentacion;
    //   }
    // }
    this.EnviarModelo();
  }

  tab(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  }
}
