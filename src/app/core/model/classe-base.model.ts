import { Util } from '../util.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';

export class ClasseBase {
  carregando: boolean = false;
  tentando_salvar: boolean = false;
  $monitoramento_manutencao: Subscription;
  constructor(public auth: AuthService) {}

  habilitarMonitoramentos() {
    this.auth.saiuDoApp$.subscribe({
      next: (r) => this.limparTela(),
      error: (e) => console.error('saiuDoApp', e),
    });
  }

  OnDestroy(): void {
    try {
      this.$monitoramento_manutencao.unsubscribe();
    } catch {}
  }

  TratarErro(e: any) {
    Util.TratarErro(e);
    this.resetarPropriedades();
  }

  limparTela() {}

  resetarPropriedades() {
    this.carregando = false;
    this.tentando_salvar = false;
  }

  Warning(mensagem: string) {
    this.resetarPropriedades();
    Util.AlertWarning(mensagem);
  }

  Success(mensagem: string) {
    this.resetarPropriedades();
    Util.AlertSucess(mensagem);
  }

  Error(mensagem: string) {
    this.resetarPropriedades();
    Util.AlertError(mensagem);
  }

  Info(mensagem: string) {
    this.resetarPropriedades();
    Util.AlertInfo(mensagem);
  }
}
