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
        document.getElementById('cpf_cnpj').focus();
      }, 500);
    } catch (e) {
      console.error('setFocusDocumento', e);
    }
  }

  ajustarQuantidade(registro: Produto, incremento: number) {
    if (!registro.qtde_produto) {
      registro.qtde_produto = 0;
    }
    registro.qtde_produto += incremento;
    if (registro.qtde_produto <= -1) {
      registro.qtde_produto = null;
      return;
    }
  }

  alterouQuantidadeManualmente(registro: Produto, novoValor) {
    registro.qtde_produto = novoValor;
    if (registro.qtde_produto && registro.qtde_produto < 0) {
      registro.qtde_produto = 1;
    }
  }

  async onSalvar() {
    this.submitted = true;
    try {
      this.overlay.showLoading('Cadastrando cliente...');
      let menorId = await this.dados.getMenorIdTabela('cliente');
      if (!menorId) {
        menorId = -1;
      } else {
        menorId = --menorId;
        if (menorId >= 0) {
          menorId = -1;
        }
      }

      const novoProduto = new Produto();
      novoProduto.id = novoProduto.id = menorId;
      novoProduto.nome = this.produto.nome.toString().toUpperCase();
      novoProduto.data_fabricacao = this.produto.data_fabricacao;
      novoProduto.data_vencimento = this.produto.data_vencimento;
      novoProduto.qtde_produto = this.produto.qtde_produto;
      novoProduto.valor_unitario = this.produto.valor_unitario;
      novoProduto.valor_total = this.produto.valor_total;
      novoProduto.produto_perecivel = this.produto.produto_perecivel;

      this.dados
        .salvarProduto(novoProduto)
        .then((result) => {
          this.overlay.dismissLoadCtrl();
          this.overlay.notificarSucesso('Produto salvo com sucesso!');
          this.modal.dismiss(novoProduto);
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
