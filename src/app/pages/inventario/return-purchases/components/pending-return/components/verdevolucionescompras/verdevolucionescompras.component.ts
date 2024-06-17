import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-verdevolucionescompras',
  templateUrl: './verdevolucionescompras.component.html',
  styleUrls: ['./verdevolucionescompras.component.scss'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, TextFieldModule, CabeceraComponent],
})
export class VerdevolucionescomprasComponent implements OnInit {
  Bodegas: any;
  encabezado: any = {};
  public Facturas: any[] = [];
  public Lista_Productos = [];
  public Fecha = new Date();
  public User = JSON.parse(localStorage.getItem('User'));
  Tratamientos = [];

  globales = environment;

  confirmacionSwal: any;

  datosCabecera = {
    Titulo: 'Generar devolución',
    Fecha: new Date(),
    Codigo: '',
    CodigoFormato: '',
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private readonly swalService: SwalService,
    private readonly userService: UserService,
  ) {
    let id = this.route.snapshot.params['id'];

    this.http
      .get(this.globales.base_url + '/php/noconforme/Vista_Principal.php', { params: { id: id } })
      .subscribe((data: any) => {
        switch (data.respuesta) {
          case 'Devuelta': {
            this.VerPantallaLista();
            break;
          }
        }
      });
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.http
      .get(this.globales.base_url + '/php/noconforme/ver_no_conforme.php', {
        params: { id: id },
      })
      .subscribe((data: any) => {
        this.encabezado = data.encabezado;
        this.datosCabecera.Codigo = this.encabezado.Acta;
        this.Lista_Productos = data.Productos;
        this.Facturas = data.Facturas;
      });
  }

  guardarDevolucion(formulario) {
    const request = () => {
      let info = JSON.stringify(formulario.value);
      let prod = JSON.stringify(this.Lista_Productos);

      let datos = new FormData();

      datos.append('datos', info);
      datos.append('productos', prod);
      datos.append('Id_No_Conforme', this.encabezado.Id_No_Conforme);
      datos.append('Identificacion_Funcionario', this.userService.user.person.identifier);
      datos.append('Id_Proveedor', this.encabezado.Id_Proveedor);
      datos.append('Id_Bodega_Nuevo', this.encabezado.Id_Bodega_Nuevo);
      datos.append('id', this.route.snapshot.params['id']);

      const headers = new HttpHeaders({
        Accept: 'text/plain',
      });

      this.http
        .post(
          this.globales.base_url + '/php/noconforme/devolucion_producto_no_conforme.php',
          datos,
          {
            headers,
          },
        )
        .subscribe((data: any) => {
          this.swalService.show({
            title: 'Devolución de compra',
            icon: data.mensaje,
            text: data.tipo,
            showCancel: false,
            timer: 2000,
          });
          this.VerPantallaLista();
          formulario.reset();
        });
    };
    this.swalService.swalLoading('Se procede a realizar la devolución de compra', request);
  }
  VerPantallaLista() {
    this.router.navigate(['inventario/devoluciones']);
  }
}
