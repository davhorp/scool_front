import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'authToken';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<any>{
    return this.httpClient.post<any>(environment.urlHostSchool.concat(environment.serviceLoginPath), {email, password}).pipe(
      tap(response => {
        if(response.access_token)
          console.log(response.access_token);
      })
    )
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticate(): boolean{
    const token = this.getToken();
    if(!token)
      return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate([environment.navigate_path_login]);
  }
}
