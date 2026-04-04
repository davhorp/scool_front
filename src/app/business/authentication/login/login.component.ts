
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  miFormulario: FormGroup;
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder){
      this.miFormulario = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required] 
    });
    }

  login(): void {
    if (this.miFormulario.valid) {
      this.authService.login(
        this.miFormulario.get('email')?.value, 
        this.miFormulario.get('password')?.value).subscribe({
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
      this.miFormulario.markAllAsTouched(); // Muestra errores si intenta enviar
    }
  }

  forwardForgetPassword(): void {
    console.log('Antes de ir a forget password');
    this.router.navigate(['/forget-password']);
    console.log('Ya estamos en forget password');
  }

}
