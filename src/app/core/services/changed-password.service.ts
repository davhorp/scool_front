import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangedPasswordService {

  constructor(
    private httpClient: HttpClient, 
    private router: Router) { }

    requestChangedPassword(email: string): Observable<any>{
      return this.httpClient.post<any>(environment.urlHostSchool.concat(environment.urlServiceChangedPassword), {email}).pipe(
        tap(response => {
          
        })
      )
    }

    resetPassword(email: string, code: string, newPassword: string): Observable<any>{
      return this.httpClient.post<any>(environment.urlHostSchool.concat(environment.urlServiceResetPassword), {email, code, newPassword}).pipe(
        tap(response => {
          
        })
      )
    }
}
