import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { SafePipe } from '../../../core/pipes/safe.pipe';

@Component({
  selector: 'app-documentos-gestion',
  templateUrl: './documentos-gestion.component.html',
  styleUrls: ['./documentos-gestion.component.scss'],
  standalone: true,
  imports: [SafePipe],
})
export class DocumentosGestionComponent implements OnInit {
  modulo: string;
  public url = 'https://backend.ateneoerp.com/filemanagercalidad/dialog.php?lang=es&car=';
  public ruta3 = environment.url_assets + '/filemanager3/tinyfilemanager.php';
  constructor(private rutaActiva: ActivatedRoute) {}

  ngOnInit(): void {
    this.rutaActiva.paramMap.subscribe((params: ParamMap) => {
      //window.open(this.ruta3, '_blank')
      this.modulo = params.get('modulo');
      switch (this.modulo) {
        case 'rrhh':
          this.ruta3 =
            environment.url_assets + '/filemanager4/filemanager/dialog.php?type=0&lang=es&car=rrhh';
          break;
        case 'contabilidad':
          this.ruta3 =
            environment.url_assets +
            '/filemanager4/filemanager/dialog.php?type=0&lang=es&car=contabilidad';
          break;
        case 'juridico':
          this.ruta3 =
            environment.url_assets + '/filemanager4/filemanager/dialog.php?type=0&car=juridico';
          break;
        case 'calidad':
          this.ruta3 =
            environment.url_assets + '/filemanager4/filemanager/dialog.php?type=0&car=calidad';
          break;
        case 'gerencia':
          this.ruta3 = environment.url_assets + '/filemanager4/filemanager/dialog.php?type=0&car=';
          break;
        default:
          this.ruta3 = environment.url_assets + '/filemanager4/filemanager/dialog.php?type=0&car=';
      }
    });
    //console.log(this.rutaActiva.snapshot.params.modulo);
  }
}
