import { Injectable } from '@angular/core';
import { RetornoAPIModel } from '../model/retorno-api.model';
import { fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  keyToken: string = 'computaria:token';
  keyGuidInstalacao: string = 'computaria:guid_instalacao';
  public salvouVenda$ = new Subject();
  public salvouBalanco$ = new Subject();
  public saiuDoApp$ = new Subject();
  public appIsOnline$: Observable<boolean>;
  constructor(private router: Router) {
    this.initConnectivityMonitoring();
  }

  get isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      const token = this.getToken();
      if (token) {
        return resolve(true);
      }
      return resolve(false);
    });
  }

  initConnectivityMonitoring() {
    if (!window || !navigator || !('onLine' in navigator)) {
      return;
    }

    this.appIsOnline$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine));
  }

  informarSalvouVenda() {
    this.salvouVenda$.next('');
  }

  informarSalvouBalanco() {
    this.salvouBalanco$.next('');
  }

  getToken(): string {
    return localStorage.getItem(this.keyToken);
  }

  logout() {
    localStorage.removeItem(this.keyToken);
    this.router.navigateByUrl('/login');
    this.saiuDoApp$.next();
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }
}

export class NotificacaoToken {
  excluir_token: boolean;
}

export class RetornoInstalacao extends RetornoAPIModel<LoginResponse> {}

export class LoginResponse {
  id: number;
  token: string;
  guid_instalacao: string;
}
