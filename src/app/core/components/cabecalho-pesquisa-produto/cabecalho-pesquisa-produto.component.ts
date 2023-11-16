import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConsultaProdutoComponent } from 'src/app/views/modais/consulta-produto/consulta-produto.component';
import { ViewProdutoEmpresa } from '../../model/data-base/view-produto-empresa.model';
import { Util } from '../../util.model';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { TelaVendaComponent } from 'src/app/views/abas/vendas/tela-venda/tela-venda.component';
import { ProdutoUtil } from '../../model/produto-util.model';
import { TelaBalancoComponent } from '../../../views/abas/balanco/tela-balanco/tela-balanco.component';
import { OverlayService } from '../../service/overlay.service';
import { DataBaseProvider } from '../../service/database';

@Component({
  selector: 'app-cabecalho-pesquisa-produto',
  templateUrl: './cabecalho-pesquisa-produto.component.html',
  styleUrls: ['./cabecalho-pesquisa-produto.component.scss'],
})
export class CabecalhoPesquisaProdutoComponent implements OnInit {
  @ViewChild('pesquisa') pesquisa;
  @Input() texto_pesquisado: string;
  @Input() tela_consulta: ConsultaProdutoComponent;
  @Input() nao_exibir_consultando: boolean;
  @Input() permitir_quantidade_zero: boolean;
  @Input() tela_vendas: TelaVendaComponent;
  @Input() tela_balanco: TelaBalancoComponent;
  @Input() modal: ModalController;
  @Input() tipo_preco_produto?: number;
  @Input() id_forma_pagamento?: number;
  @Input() id_tabela_preco_erp?: number;
  @Input() juros_aplicar?: number;
  @Output() OnConsultou: EventEmitter<ViewProdutoEmpresa[]> =
    new EventEmitter();
  registros: ViewProdutoEmpresa[];
  filtro_pesquisa: string;
  type: string;
  consultando: boolean;
  constructor(
    private overlay: OverlayService,
    private barcodeScanner: BarcodeScanner,
    private dados: DataBaseProvider
  ) {
    this.registros = [];
    this.texto_pesquisado = '';
    this.consultando = false;
    this.nao_exibir_consultando = false;
  }

  ngOnInit() {
    this.checkType();
    setTimeout(() => {
      this.pesquisa.setFocus();
    }, 500);
  }

  checkType() {
    if (this.filtro_pesquisa === 'id') {
      this.pesquisa = '';
      this.type = 'number';
    } else {
      this.type = 'text';
    }
  }

  lerQrCode() {
    try {
      this.barcodeScanner
        .scan()
        .then((barcodeData) => {
          this.texto_pesquisado = barcodeData.text;
          if (this.texto_pesquisado) {
            this.filtro_pesquisa = 'gtin';
            this.onPesquisar();
          }
        })
        .catch((e) => {
          Util.logarErro(e);
          this.overlay.notificarAlerta('Ação cancelada');
        });
    } catch (e) {
      Util.TratarErro(e);
    }
  }

  segmentChangedFiltro(event) {
    this.filtro_pesquisa = event.detail.value;
    this.checkType();
    setTimeout(() => {
      this.pesquisa.setFocus();
    }, 500);
  }

  setTextoEFiltro(filtro_pesquisa: string, texto_pesquisado: string) {
    this.filtro_pesquisa = filtro_pesquisa;
    this.texto_pesquisado = texto_pesquisado;
  }

  onPesquisar() {
    try {
      this.consultando = true;
      setTimeout(async () => {
        this.texto_pesquisado = this.texto_pesquisado?.toUpperCase();
        const id = +this.texto_pesquisado;
        this.consultando = false;
        if (
          //se for uma pesquisa direto, nao chamo a tela de consulta
          !this.tela_consulta &&
          ((id > 0 && this.filtro_pesquisa === 'id') ||
            this.filtro_pesquisa === 'gtin')
        ) {
          if (this.tela_vendas) {
            const existente = this.tela_vendas.getByIdOrGtin(
              this.filtro_pesquisa,
              this.texto_pesquisado
            );
            if (existente) {
              this.tela_vendas.ajustarQuantidade(existente, 0, 1);
              this.overlay.showToast(
                `Quantidade alterada para ${existente.quantidade}`,
                'light'
              );
              return;
            }
          }

          if (this.tela_balanco) {
            const existente = this.tela_balanco.getByIdOrGtin(
              this.filtro_pesquisa,
              this.texto_pesquisado
            );
            if (existente) {
              this.tela_balanco.ajustarQuantidade(existente, 0, 1);
              this.overlay.showToast(
                `Quantidade alterada para ${existente.quantidade}`,
                'light'
              );
              return;
            }
          }

          this.consultando = true;
          const registros = await this.dados.getProdutosComPrecoJaCalculado(
            this.filtro_pesquisa,
            this.texto_pesquisado,
            this.tipo_preco_produto,
            this.id_tabela_preco_erp,
            this.id_forma_pagamento
          );

          this.consultando = false;
          if (registros.length === 0) {
            this.overlay.showToast('Nenhum resultado encontrado', 'light');
          } else {
            registros.forEach((r) => {
              r.quantidade = 1;
              ProdutoUtil.CalcularPrecoETotalBruto(
                r,
                null,
                this.tipo_preco_produto,
                null,
                null,
                null,
                null,
                null,
                this.juros_aplicar
              );
            });

            this.OnConsultou.emit(registros);
          }
        } else {
          if (this.tela_consulta) {
            this.tela_consulta.onPesquisar(
              this.filtro_pesquisa,
              this.texto_pesquisado
            );
          } else {
            this.showTelaConsulta();
          }
        }
      }, 500);
    } catch (e) {
      Util.TratarErroEFecharLoading(e, this.overlay);
    }
  }

  ConsultouProdutos(produtos: ViewProdutoEmpresa[]) {
    this.OnConsultou.emit(produtos);
  }

  async showTelaConsulta() {
    const modal = await this.modal.create({
      component: ConsultaProdutoComponent,
      componentProps: {
        filtro_pesquisa: this.filtro_pesquisa,
        texto_pesquisado: this.texto_pesquisado,
        cabecalho: this,
        tipo_preco_produto: this.tipo_preco_produto,
        id_tabela_preco_erp: this.id_tabela_preco_erp,
        id_forma_pagamento: this.id_forma_pagamento,
        juros_aplicar: this.juros_aplicar,
      },
    });

    return await modal.present();
  }

  async showTelaConsultaO() {
    const modal = await this.modal.create({
      component: ConsultaProdutoComponent,
      componentProps: {
        filtro_pesquisa: this.filtro_pesquisa,
        texto_pesquisado: this.texto_pesquisado,
        cabecalho: this,
      },
    });

    return await modal.present();
  }
}
