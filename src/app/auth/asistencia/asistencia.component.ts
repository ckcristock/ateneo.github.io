import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import Swal from 'sweetalert2';
import { AsistenciaService } from './asistenca.service';
import { NgClass, NgIf } from '@angular/common';
import { EMPRESA } from '@app/core/utils/consts';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf],
})
export class AsistenciaComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;

  @ViewChild('video', { static: false }) video!: ElementRef;

  company = EMPRESA;

  time = moment().format('LTS');

  vista = true;

  temp = 0.0;

  constructor(
    private readonly _asistencia: AsistenciaService,
    private readonly _swal: SwalService,
  ) {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.beforeCreate();
    this.mounted();
  }

  capture() {
    var context = this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.video.nativeElement, 0, 0, 640, 480);
    var imagen = this.canvas.nativeElement.toDataURL('image/png');

    const video: HTMLVideoElement = this.video.nativeElement;
    video.pause();
    this.CambiaVista();
    this._asistencia.validate({ imagen }).subscribe(
      (r: any) => {
        this.CambiaVista();
        /*  r.data.timer = 4000; */
        /*  r.data.showConfirmButton = false; */
        r.timer = 2500;
        Swal.fire(r);
      },
      (err) => {
        this.CambiaVista();

        this._swal.show({
          title: 'Oops!',
          text: 'Han ocurrido errores, por favor intentar más tarde',
          icon: 'error',
          timer: 2000,
        });
      },
    );
  }

  CambiaVista() {
    this.vista = !this.vista;
    if (this.vista) {
      const video: HTMLVideoElement = this.video.nativeElement;
      video.play();
    }
  }
  mounted() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const video: HTMLVideoElement = this.video.nativeElement;

          video.srcObject = stream;
          video.setAttribute('crossorigin', 'anonymous');
          video.play();
        })
        .catch(function (error) {
          alert('No se puede acceder a la Cámara : ' + error.name + ' ' + error.message);
        });
    }

    setInterval(() => {
      this.time = moment().format('LTS');
    }, 1000);
  }

  genRand(min: number, max: number, decimalPlaces: number): number {
    const rand = Math.random() * (max - min) + min;
    const power = 10 ** decimalPlaces;
    return Math.floor(rand * power) / power;
  }

  beforeCreate() {
    // validar empresa
    if (localStorage.getItem('tenant')) {
    } else {
      /* Swal.fire({
         title: 'Ingresa el nit de vuestra compañia',
         input: 'text',
         inputAttributes: {
           autocapitalize: 'on',
         },
         // showCancelButton: true,
         confirmButtonText: 'Aceptar',
         showLoaderOnConfirm: true,
         preConfirm: (nit) => {
           return axios
               .post(`/getTenant`, { nit: nit })
               .then(datos => {
                 if (datos.data == "") {
                   window.location = "/";
                 }
                 localStorage.setItem("tenant", datos.data);
               })
               .catch(err => {
                 this.$swal.showValidationMessage(
                   `Esta compañia no se encuentra registrada`
                 );
               });
         },
         allowOutsideClick: () => !Swal.isLoading(),
       }).then((result) => {
         if (result.isConfirmed) {
           Swal.fire({
              title: `${result.value.login}'s avatar`,
               imageUrl: result.value.avatar_url
           });
         }
       }); */
    }
  }
}
