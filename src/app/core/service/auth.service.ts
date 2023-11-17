import { Injectable } from '@angular/core';
import { RetornoAPIModel } from '../model/retorno-api.model';
import { fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  keyEmpresa: string = 'computaria:empresa';
  keyColaborador: string = 'computaria:colaborador';
  keyToken: string = 'computaria:token';
  keyGuidInstalacao: string = 'computaria:guid_instalacao';
  public salvouVenda$ = new Subject();
  public salvouBalanco$ = new Subject();
  public saiuDoApp$ = new Subject();
  public appIsOnline$: Observable<boolean>;
  _empresaLogada: DadosEmpresa;
  _colaboradorLogado: DadosColaborador;
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

  get EmpresaLogada(): DadosEmpresa {
    if (!this._empresaLogada) {
      this._empresaLogada = this.getDadosEmpresaLogada();
    }

    return this._empresaLogada;
  }

  get ColaboradorLogada(): DadosColaborador {
    if (!this._colaboradorLogado) {
      this._colaboradorLogado = this.getDadosColaboradorLogado();
    }

    return this._colaboradorLogado;
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

  setDadosEmpresaEToken(
    empresa: DadosEmpresa,
    colaborador: DadosColaborador,
    token: string,
    guid_instalacao: string
  ) {
    this.setDadosEmpresa(empresa);
    this.setDadosColaborador(colaborador);
    localStorage.setItem(this.keyToken, token);
    localStorage.setItem(this.keyGuidInstalacao, guid_instalacao);
  }

  setDadosEmpresa(empresa: DadosEmpresa) {
    this._empresaLogada = empresa;
    localStorage.setItem(this.keyEmpresa, JSON.stringify(empresa));
  }

  setDadosColaborador(colaborador: DadosColaborador) {
    this._colaboradorLogado = colaborador;
    localStorage.setItem(this.keyColaborador, JSON.stringify(colaborador));
  }

  getDadosEmpresaLogada(): DadosEmpresa {
    return JSON.parse(localStorage.getItem(this.keyEmpresa));
  }

  getDadosColaboradorLogado(): DadosColaborador {
    return JSON.parse(localStorage.getItem(this.keyColaborador));
  }

  getPermissoesUsuario(): UsuarioGrupoPermissoesMobile {
    const dadosEmpresa = this.getDadosEmpresaLogada();
    if (dadosEmpresa && dadosEmpresa.permissoes_mobile_json?.length > 0) {
      return JSON.parse(dadosEmpresa.permissoes_mobile_json);
    }
    return new UsuarioGrupoPermissoesMobile();
  }

  getToken(): string {
    return localStorage.getItem(this.keyToken);
  }

  getGuideInstalacao(): string {
    return localStorage.getItem(this.keyGuidInstalacao);
  }

  logout() {
    localStorage.removeItem(this.keyEmpresa);
    localStorage.removeItem(this.keyColaborador);
    localStorage.removeItem(this.keyToken);
    this.router.navigateByUrl('/login');
    this.saiuDoApp$.next();
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }

  public getPathRelatorios() {
    return `${this.getPathBase()}/bancos_dados/${
      this.getDadosEmpresaLogada().id_banco_gerenciador
    }/relatorios`;
  }

  getUrlAPI() {
    return `${this.getDadosEmpresaLogada().url_api}/api`;
  }

  private getPathBase() {
    return 'aplicativos/gerencial';
  }
}

export class NotificacaoToken {
  excluir_token: boolean;
  enviar_vendas: boolean;
}

export class DadosManutencaoApp {
  tela_balanco: boolean;
  tela_consulta_preco: boolean;
  tela_importacao: boolean;
  tela_venda: boolean;
}

export class RetornoInstalacao extends RetornoAPIModel<LoginResponse> {}

export class LoginResponse {
  token: string;
  guid_instalacao: string;
  dados_empresa: DadosEmpresa;
  dados_colaborador: DadosColaborador;
  id: number;
}

export class DadosColaborador {
  nome: string;
  email: string;
  id_usuario: number;
  id_colaborador: number;
  desconto_porcentagem_maximo_permitido: number;
  bloquear_acesso_aos_custos_produto: number;
  total_saldo_flex: number;
  foto_perfil?: string;
}

export class DadosEmpresa {
  razao: string;
  url_api: string;
  url_zip_imagens: string;
  versao_gratis: boolean;
  fantasia: string;
  cpf_cnpj: string;
  cpf_cnpj_formatado: string;
  nome_colaborador: string;
  email: string;
  guid_instalacao: string;
  permissoes_mobile_json: string;
  id_colaborador: number;
  id_usuario: number;
  id_banco_dados: number;
  id_banco_gerenciador: number;
  desconto_porcentagem_maximo_permitido_usuario: number;
  bloquear_acesso_aos_custos_produto_usuario: boolean;
  logradouro: string;
  numero: string;
  municipio: string;
  uf: string;
  telefone: string;
}

export class UsuarioGrupoPermissoesMobile {
  balanco: boolean = false;
  vendas: boolean = false;
  clientes: boolean = false;
}
