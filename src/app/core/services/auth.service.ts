import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioSesion } from '../../models/userSession.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'authToken';
  private REFRESH_URL = 'http://localhost:3000/api/v1/auth/refresh';
  private refreshTokenKey = 'refreshToken';

  constructor(private httpClient: HttpClient, private router: Router) { }

  //private userSignal = signal<UsuarioSesion | null>(this.getInvitedUser());

  //public currentUser = this.userSignal.asReadonly();
  //public isUserAuthenticated = computed(() => !!this.userSignal());
  //public userRole = computed(() => this.userSignal()?.profile || 'GUEST');

  // Intentar recuperar sesión del localStorage al cargar
  getInvitedUser(): UsuarioSesion | null {
    let data = null;
    if(localStorage.getItem('miClave') !== null){
      data = localStorage.getItem('user_session');
      
    }
    return data ? JSON.parse(data) : null;
  
  }

  login(email: string, password: string): Observable<any>{
    return this.httpClient.post<any>(environment.urlHostSchool.concat(environment.serviceRestLoginPath), {email, password}).pipe(
      tap(response => {
       // this.userSignal.set(response);
        localStorage.setItem('user_session', JSON.stringify(response));
        localStorage.setItem('nameFullUsr', response.nameFull);
        localStorage.setItem('profileUsr', response.profile.profile);
        if(response.accessToken){
          this.setToken(response.accessToken);
          //this.setRefreshToken(response.refreshToken)
          //this.autoRefreshToken();
        }
      })
    )
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  } 

  private getToken(): string | null {
    if(typeof window !== 'undefined'){
      return localStorage.getItem(this.tokenKey);
    }else {
      return null;
    }
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  } 

  private getRefreshToken(): string | null {
    if(typeof window !== 'undefined'){
      return localStorage.getItem(this.refreshTokenKey);
    }else {
      return null;
    }
  }

  refreshToken(): Observable<any>{
    const refreshToken  = this.getRefreshToken()
    return this.httpClient.post<any>(this.REFRESH_URL, {refreshToken}).pipe(
      tap(response => {
        if(response.token){
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken)
          this.autoRefreshToken()
        }
      })
    )
  }

  autoRefreshToken(): void {
    const token = this.getToken();
    if(!token){
      return;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;

    const timeout = exp - Date.now() - (60 * 1000);

    setTimeout(() => {
      this.refreshToken().subscribe()
    }, timeout);
   
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if(!token){
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    //this.userSignal.set(null);
    //localStorage.removeItem('user_session');
    this.router.navigate(['/login']);
  }
}
