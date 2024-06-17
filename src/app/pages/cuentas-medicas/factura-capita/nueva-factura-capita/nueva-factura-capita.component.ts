import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { debounceTime, map } from 'rxjs/operators';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-nueva-factura-capita',
  templateUrl: './nueva-factura-capita.component.html',
  styleUrls: ['./nueva-factura-capita.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgSelectModule, NgbTypeahead, CurrencyPipe, DatePipe],
})
export class NuevaFacturaCapitaComponent implements OnInit {
  public id = this.route.snapshot.params['id'];
  public Fecha = new Date();
  public Idcliente: any = [];
  public Cliente: any = [];
  ListaGananciaFactura: any;
  BodegaFactura: any;
  ListaProductoFactura: any;
  precioCumFactura: any;
  diaPagoClienteFactura: string;
  public reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer2 = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Iva);
  public reducer3 = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Total_Descuento);
  public Lista_Factura = [
    {
      Descripcion: '',
      Precio: 0,
      Descuento: 0,
      Impuesto: 0,
      Cantidad: 0,
      Subtotal: 0,
      Iva: 0,
      Total_Descuento: 0,
    },
  ];
  SubtotalFactura: number = 0;
  IvaFactura: number;
  DescuentosFactura: number;
  TotalFactura: number = 0;
  ImpuestoFactura: any;
  public Cuota = 0;
  public user: any = JSON.parse(localStorage.getItem('User'));
  public alertOption: SweetAlertOptions = {};
  public clientesReadOnly = true;
  public Puntos: Array<String>;
  public Punto: any = '';

  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('FormFactura') FormFactura: any;
  public divFactura = true;
  Departamento = [];
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  ) {
    this.alertOption = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Guardar esta Factura',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarFacturaCapita(this.FormFactura);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  ngOnInit() {
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Lista_Ganancia' },
      })
      .subscribe((data: any) => {
        this.ListaGananciaFactura = data;
      });
    this.http
      .get(environment.base_url + '/php/lista_generales.php', { params: { modulo: 'Impuesto' } })
      .subscribe((data: any) => {
        this.ImpuestoFactura = data;
      });
    this.http
      .get(environment.ruta + 'php/factura_capita/clientes_con_contrato.php')
      .subscribe((data: any) => {
        this.Cliente = data;
        this.clientesReadOnly = false;
      });
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Departamento' },
      })
      .subscribe((data: any) => {
        this.Departamento = data;
      });
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.Cliente.filter(
              (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 10),
      ),
    );
  formatter = (x: { Nombre: string }) => x.Nombre;
  CalculoTotal(pos) {
    var Cantidad = (document.getElementById('CantidadFactura' + pos) as HTMLInputElement).value;
    var Precio: any = (document.getElementById('PrecioFactura' + pos) as HTMLInputElement).value;

    if (parseInt(Cantidad) > 0) {
      let subtotal = parseInt(Cantidad) * parseFloat(Precio);
      if (Cantidad != '' && parseFloat(Precio) > 0) {
        this.Lista_Factura[pos].Precio = Precio;
        this.Lista_Factura[pos].Cantidad = parseInt(Cantidad);
        this.Lista_Factura[pos].Subtotal = subtotal;

        setTimeout(() => {
          this.actualizarValores();
        }, 100);

        var posicion = this.Lista_Factura.length - 1;
        if (posicion == pos) {
          this.Lista_Factura.push({
            Descripcion: '',
            Precio: 0,
            Descuento: 0,
            Impuesto: 0,
            Cantidad: 0,
            Subtotal: 0,
            Iva: 0,
            Total_Descuento: 0,
          });
        }
      }
    } else {
      this.confirmacionSwal.title = 'Error en la cantidad Ingresada';
      this.confirmacionSwal.text = 'La cantidad ingresada No puede ser Cero';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();
    }
  }

  cargarPuntos(id_dep) {
    if (id_dep != '') {
      this.http
        .get(environment.ruta + 'php/reportes/puntos.php', { params: { id_dep: id_dep } })
        .subscribe((data: any) => {
          this.Puntos = data;
        });
    } else {
      this.Puntos = [];
    }
  }

  actualizarValores() {
    this.SubtotalFactura = parseFloat(this.Lista_Factura.reduce(this.reducer, 0));
    this.TotalFactura = this.SubtotalFactura - this.Cuota;
  }

  VerPantallaLista() {
    this.router.navigate(['tablero']);
  }

  BuscarDatosCliente(event: any): void {
    if (event.target.value != '') {
      /* this.http.get(environment.ruta + 'php/cotizacionesventas/detalle_cliente.php', {
        params: { NombreCliente: event.target.value }
      }).subscribe((data: any) => {
        this.Idcliente = data.Id_Cliente;

      }); */
      let pos = this.Cliente.findIndex((x) => {
        return x.Nombre == event.target.value;
      });

      if (pos >= 0) {
        this.Idcliente = this.Cliente[pos].Id_Cliente;
        setTimeout(() => {
          // console.log(this.Idcliente);
        }, 500);
      }
    }
  }
  EliminarProductoRemsion(i) {
    if (this.Lista_Factura[i].Descripcion != '') {
      this.Lista_Factura.splice(i, 1);
      this.CalculoTotal(i);
    }
  }
  GuardarFacturaCapita(formulario: NgForm) {
    // console.log(formulario.value);
    let Datos = JSON.stringify(formulario.value);
    let Descripcion = JSON.stringify(this.Lista_Factura);
    let datos = new FormData();
    datos.append('modulo', 'Factura_Capita');
    datos.append('datos', Datos);
    datos.append('productos', Descripcion);
    this.http
      .post(environment.ruta + '/php/factura_capita/guardar_factura.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSwal.title = data.titulo;
        this.confirmacionSwal.text = data.mensaje;
        this.confirmacionSwal.type = data.tipo;
        this.confirmacionSwal.show();
        if (data.tipo === 'success') {
          if (data.id) {
            window.open(
              environment.ruta + 'php/factura_capita/factura_capita_pdf.php?id=' + data.id,
              '_blank',
            );
          }
          this.VerPantallaLista();
          this.FormFactura.reset();
        }
      });
  }

  getCuotasMod(regimen) {
    // console.log(regimen, typeof(regimen));

    if (regimen != '' && parseInt(regimen) != 2) {
      let cliente = (document.getElementById('Id_Cliente') as HTMLInputElement).value;
      let departamento = (document.getElementById('Id_Departamento') as HTMLInputElement).value;
      let mes = (document.getElementById('Mes') as HTMLInputElement).value;
      let punto = this.Punto;

      this.http
        .get(environment.ruta + 'php/factura_capita/cuotas_moderadora.php', {
          params: { client: cliente, dep: departamento, pto: punto, mes: mes },
        })
        .subscribe((data: any) => {
          this.Cuota = parseFloat(data.Cuotas);
        });
    } else {
      this.Cuota = 0;
    }
  }
}
