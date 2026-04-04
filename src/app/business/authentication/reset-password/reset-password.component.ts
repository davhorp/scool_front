import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangedPasswordService } from '../../../core/services/changed-password.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export default class ResetPasswordComponent {

  formResetPassword: FormGroup;
  codeVerification: string = '';
  newPassword: string = '';
  emailChangedPasswordUser : string | null = localStorage.getItem('emailChangedPassword')

  constructor(
      private router: Router, 
      private fb: FormBuilder,
      private resetPassServ: ChangedPasswordService) {
        this.formResetPassword = this.fb.group({
          codeVerification: ['', Validators.required],
          newPassword: ['', Validators.required]
        });
      }

  forwardLogin(): void {
    this.router.navigate(['/login']);
  }

  resetPassword(): void{
    if (this.formResetPassword.valid) {
      const email = this.emailChangedPasswordUser;
      const codeVerification = this.formResetPassword.get('codeVerification')?.value;
      const newPassword = this.formResetPassword.get('newPassword')?.value;
      if (!email || !codeVerification || !newPassword) {
        console.error('Faltan datos para restablecer la contraseña');
        return;
      }
      this.resetPassServ.resetPassword(email, codeVerification, newPassword).subscribe({
      next: (response)=> {
        console.log(response);
        if(response.response.codeResult === '200'){
          console.log(response.response.codeResult);
          localStorage.removeItem('emailChangedPassword');
          this.router.navigate(['/login'])
        }
      },
      error: (err) => console.error('Error al momento de actualizar cambio de contraseña', err)
    })
    } else {
      this.formResetPassword.markAllAsTouched(); // Muestra errores si intenta enviar
    }
  }

}
