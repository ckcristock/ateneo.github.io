import { Component, OnInit } from '@angular/core';
import { ResponsablesService } from './responsables.service';
import { PersonService } from '../services/person/person.service';
import { SwalService } from '../services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { SearchSelectComponent } from '../../../../shared/components/search-select/search-select.component';

@Component({
  selector: 'app-responsables',
  templateUrl: './responsables.component.html',
  styleUrls: ['./responsables.component.scss'],
  standalone: true,
  imports: [SearchSelectComponent, NotDataComponent],
})
export class ResponsablesComponent implements OnInit {
  responsibles: any[] = [];
  people: any[] = [];
  loading: boolean = false;

  constructor(
    private _responsibles: ResponsablesService,
    private readonly personService: PersonService,
    private _swal: SwalService,
  ) {}

  ngOnInit() {
    this.getResponsiles();
    this.getPeople();
  }

  getResponsiles() {
    this.loading = true;
    this._responsibles.getResponsibles().subscribe((res: any) => {
      this.responsibles = res.data;
      this.loading = false;
    });
  }

  private getPeople(): void {
    this.personService.getPersonCompany().subscribe({
      next: (res) => {
        this.people = res['data'];
      },
    });
  }

  changeResponsible(person_id, id) {
    if (person_id) {
      this._swal
        .show({
          icon: 'question',
          title: '¿Estás seguro(a)?',
          text: 'Vamos a cambiar el funcionario responsable.',
        })
        .then((r) => {
          if (r.isConfirmed) {
            let data = {
              person_id: person_id,
            };
            this._responsibles.changeResponsible(data, id).subscribe(
              (res: any) => {
                if (res.status) {
                  this._swal.show({
                    icon: 'success',
                    title: 'Funcionario asignado correctamente.',
                    text: '',
                    showCancel: false,
                    timer: 1000,
                  });
                }
              },
              (error) => {
                this._swal.hardError();
              },
            );
          }
        });
    }
  }
}
