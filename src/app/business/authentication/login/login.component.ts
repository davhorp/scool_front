
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

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
        localStorage.setItem('emailUsr', this.email);
        const token = response.accessToken;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        if(role === 'ADMIN') {
          this.router.navigate(['/dashboard'])
        }
        //else {
        //  this.router.navigate(['/profile'])
       // }
      },
      error: (err) => console.error('Login failed', err)
    })
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

}
