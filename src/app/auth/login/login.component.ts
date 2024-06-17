import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NgClass } from '@angular/common';
import { UserService } from '@app/core/services/user.service';
import { EMPRESA } from '@app/core/utils/consts';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, NgClass],
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;

  company = EMPRESA;

  loading!: boolean;

  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private router: Router,
    private swalService: SwalService,
  ) {}

  ngOnInit() {
    document.body.removeAttribute('data-layout');
    document.body.classList.add('auth-body-bg');

    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.loading = true;
    this.userService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.loading = false;
        this.swalService.error(
          'Error iniciando sesión',
          'Revisa tus credenciales e inténtalo de nuevo',
        );
      },
    });
  }
  get userForm() {
    return this.loginForm.get('user');
  }

  get passwordForm() {
    return this.loginForm.get('password');
  }
}
