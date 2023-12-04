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
import { ViewProduto } from '../../model/data-base/view-produto.model';
import { Util } from '../../util.model';
import { TelaVendaComponent } from 'src/app/views/abas/vendas/tela-venda/tela-venda.component';
import { ProdutoUtil } from '../../model/produto-util.model';
import { OverlayService } from '../../service/overlay.service';
import { DataBaseProvider } from '../../service/database';
import { PreferenciasService } from '../../service/preferencias.service';

@Component({
  selector: 'app-cabecalho-pesquisa-produto',
  templateUrl: './cabecalho-pesquisa-produto.component.html',
  styleUrls: ['./cabecalho-pesquisa-produto.component.scss'],
})
export class CabecalhoPesquisaProdutoComponent implements OnInit {
  @ViewChild('pesquisa') pesquisa;
  @Input() texto_pesquisado: string;
  @Input() apenas_consulta: boolean;
  @Input() exibir_filtro_pesquisa: boolean;
  @Input() tela_consulta: ConsultaProdutoComponent;
  @Input() nao_exibir_consultando: boolean;
  @Input() permitir_quantidade_zero: boolean;
  @Input() tela_vendas: TelaVendaComponent;
  @Input() modal: ModalController;
  @Output() OnConsultou: EventEmitter<ViewProduto[]> = new EventEmitter();
  registros: ViewProduto[];
  filtro_pesquisa: string;
  type: string;
  consultando: boolean;
  constructor(
    private prefSrv: PreferenciasService,
    private overlay: OverlayService,
    private dados: DataBaseProvider
  ) {
    this.registros = [];
    this.texto_pesquisado = '';
    this.consultando = false;
    this.nao_exibir_consultando = false;
  }

  ngOnInit() {
    this.filtro_pesquisa = this.prefSrv.getPreferenciaProduto();
    this.checkType();
    setTimeout(() => {
      this.pesquisa?.setFocus();
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

  segmentChangedFiltro(event) {
    this.filtro_pesquisa = event.detail.value;
    this.checkType();
    setTimeout(() => {
      this.pesquisa?.setFocus();
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
          id > 0 &&
          this.filtro_pesquisa === 'id'
        ) {
          if (this.tela_vendas) {
            const existente = this.tela_vendas.getById(
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

          this.consultando = true;
          const registros = await this.dados.getProdutos(
            this.filtro_pesquisa,
            this.texto_pesquisado
          );

          this.consultando = false;
          if (registros.length === 0) {
            this.overlay.showToast('Nenhum resultado encontrado', 'light');
          } else {
            registros.forEach((r) => {
              r.quantidade = 1;
              ProdutoUtil.CalcularPrecoETotalBruto(r);
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

  ConsultouProdutos(produtos: ViewProduto[]) {
    this.OnConsultou.emit(produtos);
  }

  async showTelaConsulta() {
    const modal = await this.modal.create({
      component: ConsultaProdutoComponent,
      componentProps: {
        filtro_pesquisa: this.filtro_pesquisa,
        texto_pesquisado: this.texto_pesquisado,
        cabecalho: this,
        apenas_consulta: this.apenas_consulta
      },
    });

    return await modal.present();
  }
}
