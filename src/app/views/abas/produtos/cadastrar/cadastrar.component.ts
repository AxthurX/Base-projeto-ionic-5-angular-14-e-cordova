import { Util } from 'src/app/core/util.model';
import { ModalController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { DataBaseProvider } from 'src/app/core/service/database';
import { Produto } from 'src/app/core/model/data-base/produto.model';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { CurrencyMaskConfig } from 'ng2-currency-mask';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss'],
})
export class CadastrarComponent extends ClasseBase implements OnInit {
  @ViewChild('btnVoltar') btnVoltar;
  produto: Produto;
  submitted: boolean;
  consultando: boolean = false;
  dias_restantes: number;
  mask: CurrencyMaskConfig = {
    align: 'right',
    allowNegative: true,
    decimal: ',',
    precision: 2,
    prefix: 'R$ ',
    suffix: '',
    thousands: '.',
  };
  constructor(
    private overlay: OverlayService,
    private dados: DataBaseProvider,
    private modal: ModalController,
    protected rota: Router,
    auth: AuthService
  ) {
    super(auth);
    this.submitted = false;
    this.consultando = false;
    this.produto = new Produto();
    this.produto.data_fabricacao = new Date().toISOString();
    this.produto.data_vencimento = new Date().toISOString();
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

  ajustarQuantidade(registro: Produto, incremento: number) {
    if (!registro.quantidade) {
      registro.quantidade = 0;
    }
    registro.quantidade += incremento;
    if (registro.quantidade <= -1) {
      registro.quantidade = null;
      return;
    }

    this.GetDiasRestantes();
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
      if (!this.produto.nome) {
        Util.AlertWarning('Por favor, informe o nome para o produto.');
        this.overlay.dismissLoadCtrl();
        return;
      }

      if (!this.produto.data_vencimento) {
        Util.AlertWarning(
          'Por favor, informe a data de vencimento para o produto.'
        );
        this.overlay.dismissLoadCtrl();
        return;
      }

      if (!this.produto.quantidade) {
        Util.AlertWarning('Por favor, informe uma quantidade para o produto.');
        this.overlay.dismissLoadCtrl();
        return;
      }

      if (!this.produto.valor_unitario) {
        Util.AlertWarning('Por favor, informe o valor unitário do produto.');
        this.overlay.dismissLoadCtrl();
        return;
      }

      novoProduto.descricao = novoProduto.nome = this.produto.nome
        .toString()
        .toUpperCase();
      novoProduto.data = new Date().getTime();
      novoProduto.ativo = true;
      novoProduto.quantidade_cadastrada = novoProduto.quantidade_original =
        this.produto.quantidade;
      novoProduto.valor_total_cadastrado = novoProduto.valor_total_original =
        this.produto.valor_total;
      novoProduto.valor_unitario_original = this.produto.valor_unitario;
      this.dados
        .setProdutos([novoProduto])
        .then(() => {
          this.overlay.dismissLoadCtrl();
          this.overlay.notificarSucesso('Produto salvo com sucesso!');
          this.rota.navigate(['home/produtos']);
          this.modal.dismiss();
        })
        .catch((e) => {
          Util.TratarErroEFecharLoading(e, this.overlay);
        });
    } catch (e) {
      Util.TratarErroEFecharLoading(e, this.overlay);
    }
  }

  GetDiasRestantes() {
    if (this.produto.data_vencimento !== null) {
      return (this.dias_restantes =
        moment(this.produto.data_vencimento, 'YYYY-MM-DD').diff(
          moment(this.produto.data_fabricacao, 'YYYY-MM-DD'),
          'days'
        ) + 1);
    }
  }

  GetValorTotal() {
    return (
      (this.produto.valor_total =
        this.produto.valor_unitario * this.produto.quantidade) ?? 0
    );
  }
}
