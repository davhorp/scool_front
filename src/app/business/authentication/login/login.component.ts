
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { User, UserRole } from '../../../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  currentUser = signal<User | null>(null);
  userData: User | null = null;

  // Mapa de rutas por rol
  private readonly dashboardRoutes: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    docente: '/docente/dashboard',
    alumno: '/alumno/mis-clases',
    padre: '/tutor/seguimiento'
  };

  private toastService = inject(ToastService);

  formLoginApp: FormGroup;
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder){
      this.formLoginApp = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required] 
    });
    }

  login(): void {
    if (this.formLoginApp.valid) {
      this.authService.login(
        this.formLoginApp.get('email')?.value, 
        this.formLoginApp.get('password')?.value).subscribe({
      next: (response)=> {
        this.userData = { id: response.id, nombre: response.nameFull, rol: response.profile.profile } as User;
        this.currentUser.set(this.userData);
        localStorage.setItem('emailUsr', this.email);
        this.redirectByRole(this.userData.rol); // Redirige según el rol del usuario, por defecto a 'alumno'
      },
      error: (err) => {
        this.toastService.show(
          'Error de Acceso', 
          err.error.message, 
          'error',
          3000 // Duración larga para que lo lea bien
        );
    }
    });
    } else {
      this.formLoginApp.markAllAsTouched(); // Muestra errores si intenta enviar
    }
  }

  forwardForgetPassword(): void {
    this.router.navigate(['/forget-password']);
    // Lógica para guardar...
    this.toastService.show(
      'Re-direeccionando a recuperación de contraseña', 
      'Redireccionamiento completo.', 
      'info',
      3000
    );
  }

  redirectByRole(rol: UserRole) {
    console.log(this.dashboardRoutes[rol]);
    const targetRoute = this.dashboardRoutes[rol] || '/login';
    console.log('URL ROL');
    console.log(targetRoute);
    //this.router.navigate([targetRoute]);
    this.router.navigate(["alumno/dashboard"]);
  }

}
