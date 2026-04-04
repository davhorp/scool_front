import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-verify-account-user',
  standalone: true,
  imports: [],
  templateUrl: './verify-account-user.component.html',
  styleUrl: './verify-account-user.component.css'
})
export default class VerifyAccountUserComponent implements OnInit{

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  status = signal<'loading' | 'success' | 'error'>('loading');
  errorMessage = signal('');

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    
    if (token) {
      //this.http.get(environment.urlHostSchool+environment.urlServiceActivateAccount+`?token=${token}`).subscribe({
      this.http.get(`http://192.168.100.35:8080/school_hermanos_grimm/auth/activate-account?token=${token}`).subscribe({
        next: () => {
          this.status.set('success');
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.status.set('error');
          this.errorMessage.set(err.error || 'Token inválido');
        }
      });
    }
  }
}
