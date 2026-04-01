import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IdleServiceService } from './core/services/idle-service.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  title = 'ng-menu-dashboard';

  constructor(
    public idleService: IdleServiceService,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
   if(this.authService.isAuthenticated()) {
    this.authService.autoRefreshToken()
   }
  }

  // Escucha clics, pulsaciones de teclas y scroll
  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  @HostListener('window:click')
  @HostListener('window:scroll')
  refreshUserState() {
    this.idleService.onUserActivity();
  }
}
