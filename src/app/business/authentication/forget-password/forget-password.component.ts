import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export default class ForgetPasswordComponent {

  constructor(private router: Router) { }

  forwardLogin(): void {
    this.router.navigate(['/login']);
  }
}
