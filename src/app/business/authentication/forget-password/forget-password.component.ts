import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangedPasswordService } from '../../../core/services/changed-password.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export default class ForgetPasswordComponent {

  formChangedPassword: FormGroup;
  emailChangedPassword: string = '';

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private changedPassServ: ChangedPasswordService) {
      this.formChangedPassword = this.fb.group({
        emailChangedPassword: ['', Validators.required]
      });
    }

  forwardLogin(): void {
    this.router.navigate(['/login']);
  }

  changedPassword(): void{
    if (this.formChangedPassword.valid) {
      this.changedPassServ.requestChangedPassword(
        this.formChangedPassword.get('emailChangedPassword')?.value).subscribe({
      next: (response)=> {
        if(response.response.codeResult === '200'){
          localStorage.setItem('emailChangedPassword',this.formChangedPassword.get('emailChangedPassword')?.value);
          this.router.navigate(['/reset-password'])
        }
      },
      error: (err) => console.error('Error al momento de solicitar cambio de contraseña', err)
    })
    } else {
      this.formChangedPassword.markAllAsTouched(); // Muestra errores si intenta enviar
    }
  }
}
