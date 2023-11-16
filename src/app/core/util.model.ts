import Swal from 'sweetalert2';
import { SweetAlertInput } from 'sweetalert2';
import { SweetAlertIcon } from 'sweetalert2';
import { OverlayService } from './service/overlay.service';
import { File } from '@ionic-native/file/ngx';
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */

export type PredefinedColorsCardNumber =
  | 'success'
  | 'info'
  | 'danger'
  | 'warning';

export class Util {
  static confirm(pergunta: string, confirmou: () => void) {
    Swal.fire({
      heightAuto: false,
      title: '<strong>Confirma esta ação?</strong>',
      icon: 'question',
      html: pergunta,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<ion-icon name="thumbs-up"></ion-icon> Sim',
      cancelButtonText: '<ion-icon name="thumbs-down"></ion-icon> Não',
    }).then((result) => {
      if (result.value) {
        confirmou();
      }
    });
  }

  static GetPathImagens(file: File) {
    return file.dataDirectory + 'imagens_produto';
  }

  setFocusDocumento() {
    try {
      setTimeout(() => {
        const input = document.getElementsByClassName('swal2-input');
      }, 500);
    } catch (e) {
      console.error('setFocusDocumento', e);
    }
  }

  static async EspecificarTexto(
    title: string,
    inputPlaceholder: string,
    digitou: (data: any) => void,
    textoSalvo?: string,
    input?: SweetAlertInput
  ) {
    if (!textoSalvo) {
      textoSalvo = '';
    }

    if (!input) {
      input = 'textarea';
    }
    const { value: text } = await Swal.fire({
      title,
      input,
      inputPlaceholder,
      inputValue: textoSalvo,
      showCancelButton: true,
      heightAuto: false,
      didOpen: () => {},
    });
    if (text) {
      textoSalvo = text.toString();
      return digitou(text.toString().toUpperCase());
    }
  }

  static TratarErroEFecharLoading(e, overlay: OverlayService) {
    Util.AlertErrorPadrao();
    overlay.dismissLoadCtrl();
  }

  static TratarErro(e: any) {
    Util.AlertErrorPadrao();
    console.error(e);
  }

  static AlertError(mensagem: string) {
    this.Alert('Ops...', mensagem, 'error');
  }

  static AlertSucess(mensagem: string) {
    this.Alert('OK', mensagem, 'success');
  }

  static AlertErrorPadrao() {
    this.Alert('Ops...', 'Algo deu errado, tente novamente', 'error');
  }

  static AlertErrorStatus(status: number) {
    this.Alert(
      'Ops...',
      'Ocorreu algum erro, tente novamente, cód do erro: ' + status,
      'error'
    );
  }

  static AlertWarning(mensagem: string) {
    this.Alert('Atenção!', mensagem, 'warning');
  }

  static AlertInfo(mensagem: string) {
    this.Alert('', mensagem, 'info');
  }

  static Alert(title?: string, html?: string, icon?: SweetAlertIcon) {
    Swal.fire({
      title,
      html,
      icon,
      heightAuto: false,
    });
  }

  static Notificacao(
    title: string,
    icon: SweetAlertIcon,
    timer: number = 3000
  ) {
    Swal.fire({
      heightAuto: false,
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer,
      title,
      icon,
    });
  }

  static AnyToBool(valor: any) {
    try {
      if (!valor) {
        return null;
      }

      return valor === 'true';
    } catch {
      return false;
    }
  }

  static logarErro(e) {
    const key = 'computaria:log_erro';
    let erros: any[];
    const listaSalva = localStorage.getItem(key);
    if (listaSalva) {
      erros = JSON.parse(listaSalva);
    } else {
      erros = [];
    }

    while (erros.length >= 20) {
      erros.pop();
    }

    erros.push(e);
    localStorage.setItem(key, JSON.stringify(erros));
    console.error(e);
  }

  static CalculaPorcentagem(
    valor_informado: number,
    valor_total: number
  ): number {
    return this.GetValorArredondado((valor_informado * 100) / valor_total);
  }

  static CalculaValorSobrePorcentagem(
    valor_informado: number,
    porcentagem: number,
    casas_decimais: number = 2
  ): number {
    return this.GetValorArredondado(
      valor_informado * (porcentagem / 100),
      casas_decimais
    );
  }

  static GetValorArredondado(
    valor: number,
    casas_decimais: number = 2
  ): number {
    return parseFloat(valor.toFixed(casas_decimais));
  }

  static randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static Confirm(pergunta: string, confirmou: () => void) {
    Swal.fire({
      heightAuto: false,
      title: '<strong>Confirma esta ação?</strong>',
      icon: 'question',
      html: pergunta,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<ion-icon name="thumbs-up"></ion-icon> Sim',
      cancelButtonText: '<ion-icon name="thumbs-down"></ion-icon> Não',
    }).then((result) => {
      if (result.value) {
        confirmou();
      }
    });
  }

  static ConfirmComRetorno(pergunta: string) {
    return Swal.fire({
      heightAuto: false,
      title: '<strong>Confirma esta ação?</strong>',
      icon: 'question',
      html: pergunta,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<ion-icon name="thumbs-up"></ion-icon> Sim',
      cancelButtonText: '<ion-icon name="thumbs-down"></ion-icon> Não',
    });
  }
}
