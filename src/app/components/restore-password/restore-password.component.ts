import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@app/core/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss'],
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgClass,
  ],
})
export class RestorePasswordComponent implements OnInit {
  @ViewChild('restoreModal') restoreModal!: any;

  changeForm!: FormGroup;

  changePassword!: boolean;

  hide: boolean = true;

  passwordRequirements: any = {
    minLength: false,
    upperCase: false,
    lowerCase: false,
    digit: false,
    specialChar: false,
  };

  conditions = [
    {
      name: 'minLength',
      text: 'Al menos 8 caracteres',
    },
    {
      name: 'upperCase',
      text: 'Al menos una mayúscula',
    },
    {
      name: 'lowerCase',
      text: 'Al menos una minúscula',
    },
    {
      name: 'digit',
      text: 'Al menos un número',
    },
    {
      name: 'specialChar',
      text: 'Al menos un caracter especial',
    },
  ];

  constructor(
    private fb: FormBuilder,
    public userServce: UserService,
    private modalService: NgbModal,
    private swalService: SwalService,
  ) {
    this.changePassword = userServce.user.change_password;
    this.changeForm = this.fb.group({
      id: [userServce.user.id, Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
          ),
        ],
      ],
    });
  }

  onPasswordInput() {
    const value = this.changeForm.get('newPassword').value;
    this.passwordRequirements.minLength = value.length >= 8;
    this.passwordRequirements.upperCase = /[A-Z]/.test(value);
    this.passwordRequirements.lowerCase = /[a-z]/.test(value);
    this.passwordRequirements.digit = /\d/.test(value);
    this.passwordRequirements.specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
  }

  isRequirementMet(requirement: string): boolean {
    return this.passwordRequirements[requirement];
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.changePassword) {
      this.modalService.open(this.restoreModal, { backdrop: 'static' });
    }
  }

  changePasswordPost() {
    if (this.changeForm.valid) {
      const request = () => {
        this.userServce.changePassword(this.changeForm.value).subscribe({
          next: (res: any) => {
            this.modalService.dismissAll();
            this.userServce.logout();
            this.swalService.success(res.data, 0);
          },
          error: () => {
            this.swalService.error();
          },
        });
      };
      this.swalService.swalLoading('¿Deseas cambiar tu contraseña?', request);
    } else {
      this.swalService.incompleteError();
    }
  }
}
