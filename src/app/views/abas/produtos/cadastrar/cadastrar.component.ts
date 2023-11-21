import { Util } from 'src/app/core/util.model';
import { ModalController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { DataBaseProvider } from 'src/app/core/service/database';
import { Produto } from 'src/app/core/model/data-base/produto.model';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss'],
})
export class CadastrarComponent implements OnInit {
  @ViewChild('btnVoltar') btnVoltar;
  produto: Produto;
  submitted: boolean;
  consultando: boolean = false;
  dias_restantes: number;
  constructor(
    private overlay: OverlayService,
    private dados: DataBaseProvider,
    private modal: ModalController
  ) {
    this.submitted = false;
    this.consultando = false;
    this.produto = new Produto();
  }

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    try {
      this.btnVoltar.voltar();
    } catch {
      setTimeout(() => {
        this.btnVoltar.voltar();
      }, 500);
    }
  }

  ngOnInit() {
    try {
      this.consultando = true;
      const modalState = {
        modal: true,
        desc: 'fake state for our modal',
      };
      history.pushState(modalState, null);
    } catch (e) {
      Util.TratarErro(e);
      this.consultando = false;
    }
  }

  setFocusDocumento() {
    try {
      setTimeout(() => {
        document.getElementById('').focus();
      }, 500);
    } catch (e) {
      console.error('setFocusDocumento', e);
    }
  }

  ajustarQuantidade(registro: Produto, incremento: number) {
    if (!registro.quantidade) {
      registro.quantidade = 0;
    }
    registro.quantidade += incremento;
    if (registro.quantidade <= -1) {
      registro.quantidade = null;
      return;
    }
  }

  alterouQuantidadeManualmente(registro: Produto, novoValor) {
    registro.quantidade = novoValor;
    if (registro.quantidade && registro.quantidade < 0) {
      registro.quantidade = 1;
    }
  }

  async onSalvar() {
    this.submitted = true;
    try {
      this.overlay.showLoading('Cadastrando produto...');

      let novoProduto = new Produto();
      novoProduto = this.produto;
      novoProduto.descricao = novoProduto.nome = this.produto.nome
        .toString()
        .toUpperCase();
      novoProduto.data = new Date().getTime();
      novoProduto.codigo_original = novoProduto.gtin = '';
      novoProduto.ativo = true;
      console.log(novoProduto);

      this.dados
        .setProdutos([novoProduto])
        .then((result) => {
          this.overlay.dismissLoadCtrl();
          this.overlay.notificarSucesso('Produto salvo com sucesso!');
          this.modal.dismiss(novoProduto);
          console.log(result);
        })
        .catch((e) => {
          Util.TratarErroEFecharLoading(e, this.overlay);
        });
    } catch (e) {
      Util.TratarErroEFecharLoading(e, this.overlay);
    }
  }

  calcularDiasRestantes() {
    const data_vencimento = moment(this.produto.data_vencimento, 'YYYY-MM-DD');
    this.dias_restantes = data_vencimento.diff(moment(), 'days') + 1;
    return this.dias_restantes;
  }
}
