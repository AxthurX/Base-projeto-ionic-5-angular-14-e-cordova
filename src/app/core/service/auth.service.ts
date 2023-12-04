import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  keyToken: string = 'computaria:token';
  keyGuidInstalacao: string = 'computaria:guid_instalacao';
  public salvouVenda$ = new Subject();
  public saiuDoApp$ = new Subject();
  public appIsOnline$: Observable<boolean>;
  constructor(private router: Router) {}

  informarSalvouVenda() {
    this.salvouVenda$.next('');
  }

  getToken(): string {
    return localStorage.getItem(this.keyToken);
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }
}

export class LoginResponse {
  id: number;
  token: string;
  guid_instalacao: string;
}
