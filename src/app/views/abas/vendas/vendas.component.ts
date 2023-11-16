import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetButton,
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { OperacaoSaidaUtil } from 'src/app/core/model/operacao-saida-util.model';
import { OperacaoSaida } from 'src/app/core/model/operacao-saida.model';
import { Util } from 'src/app/core/util.model';
import { environment } from 'src/environments/environment';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { IonContent } from '@ionic/angular';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { DataBaseProvider } from 'src/app/core/service/database';
import { AuthService } from 'src/app/core/service/auth.service';
import { SincronizacaoService } from 'src/app/core/service/sincronizacao.service';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss'],
})
export class VendasComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  carregando_mais_vendas: boolean = false;
  nenhuma_venda_localizada: boolean = false;
  abaSelecionada: string;
  consultando: boolean;
  sincronizando: boolean;
  apenas_pendentes: boolean;
  apenas_sincronizadas: boolean;
  pendentes: OperacaoSaida[] = [];
  sincronizados: OperacaoSaida[] = [];
  ultimaVenda: number;
  offSet_pendentes: number = 0;
  offSet_sincronizadas: number = 0;
  limit: number = 3;
  nao_consultar_nada_ao_abrir_tela_vendas: boolean;
  constructor(
    private actionSheetController: ActionSheetController,
    private dados: DataBaseProvider,
    private overlay: OverlayService,
    private sincSrv: SincronizacaoService,
    private route: ActivatedRoute,
    private modal: ModalController,
    private router: Router,
    auth: AuthService
  ) {
    this.abaSelecionada = 'pendentes';
    this.consultando = false;
    this.sincronizando = false;
    this.pendentes = [];
    this.sincronizados = [];
  }

  apenasPendentes() {
    this.apenas_sincronizadas = false;
    this.onForcarConsultarNovamente();
  }

  apenasSicronizadas() {
    this.apenas_pendentes = false;
    this.onForcarConsultarNovamente();
  }

  onForcarConsultarNovamente() {
    this.limparConsultas();
    this.OnConsultar();
  }

  limparConsultas() {
    this.offSet_pendentes = 0;
    this.offSet_sincronizadas = 0;
    this.pendentes = [];
    this.sincronizados = [];
    this.carregando_mais_vendas = false;
  }

  doRefresh(event) {
    event.target.complete();
    this.limparConsultas();
    this.OnConsultar();
  }

  ngOnInit() {
    if (!this.nao_consultar_nada_ao_abrir_tela_vendas) {
      this.OnConsultar();
    }
  }

  async OnConsultar() {
    setTimeout(() => {
      try {
        if (!this.carregando_mais_vendas) {
          this.abaSelecionada = 'pendentes';
          this.consultando = true;
        }

        this.nenhuma_venda_localizada = false;

        const apenas_pendentes = this.abaSelecionada === 'pendentes';
        const apenas_sincronizadas = !apenas_pendentes;
        const offSet = apenas_pendentes
          ? this.offSet_pendentes
          : this.offSet_sincronizadas;

        this.dados
          .getVendas(this.limit, offSet, apenas_pendentes, apenas_sincronizadas)
          .then((vendas) => {
            if (vendas?.length > 0) {
              vendas.forEach((v) => OperacaoSaidaUtil.PreecherDadosJson(v));

              vendas
                .filter((c) => !c.id_nuvem)
                .forEach((v) => {
                  this.pendentes.push(v);
                });
              vendas
                .filter((c) => c.id_nuvem)
                .forEach((s) => {
                  this.sincronizados.push(s);
                });
            } else {
              this.nenhuma_venda_localizada = true;
            }
            this.consultando = false;
            this.carregando_mais_vendas = false;

            if (this.abaSelecionada === 'pendentes') {
              this.offSet_pendentes += this.limit;
            } else {
              this.offSet_sincronizadas += this.limit;
            }
          })
          .catch((err) => {
            this.consultando = false;
            this.carregando_mais_vendas = false;
          });
      } catch (e) {
        this.consultando = false;
        this.carregando_mais_vendas = false;
      }
    }, 500);
  }

  async sincronizarTudo() {
    try {
      this.sincronizando = true;
      const sincronizar = this.pendentes.filter(
        (c) => !c.dados_json.status_manipulacao && !c.id_nuvem
      );

      const qtdOrcamentos = sincronizar.filter(
        (c) => c.dados_json.pedido === false
      ).length;
      if (qtdOrcamentos > 0) {
        const ret = await Util.ConfirmComRetorno(
          `Você irá sincronizar ${qtdOrcamentos} orçamento(s)`
        );
        if (ret.isConfirmed === false) {
          this.sincronizando = false;
          return;
        }
      }

      this.overlay.showLoading('Sincronizando vendas...');

      if (sincronizar.length > 0) {
        for (let i = 0; i < sincronizar.length; i++) {
          await this.sincronizarPedido(sincronizar[i], i, true);
        }
        this.limparConsultas();
        this.OnConsultar();
        try {
          this.informarQueTemNovasVendas();
        } catch {}
      } else {
        Util.AlertInfo('Nenhum PEDIDO pendente foi localizado');
      }
      this.overlay.dismissLoadCtrl();
    } catch (e) {
      Util.TratarErroEFecharLoading(e, this.overlay);
    }
    this.sincronizando = false;
  }

  async mostrarOpcoesVenda(venda: OperacaoSaida, index: number) {
    const tipoVenda = OperacaoSaidaUtil.GetTipoVenda(venda.dados_json.pedido);

    const buttons: ActionSheetButton[] = [];
    buttons.push({
      text: 'Copiar',
      icon: 'copy',
      handler: () => {
        this.AbrirTelaVenda(venda, true);
      },
    });

    buttons.push({
      text: 'Imprimir',
      icon: 'print',
      handler: async () => {
        const modal = await this.modal.create({
          component: DetalhesComponent,
          componentProps: {
            venda,
          },
        });

        await modal.present();
      },
    });

    //nao ta sincronizado
    if (!venda.id_nuvem && !venda?.dados_json?.status_manipulacao) {
      buttons.push({
        text: 'Reabrir',
        icon: 'pencil',
        handler: () => {
          this.AbrirTelaVenda(venda);
        },
      });
      buttons.push({
        text: 'Sincronizar',
        icon: 'sync',
        handler: async () => {
          if (!venda.dados_json.status_manipulacao) {
            if (venda.dados_json.pedido === false) {
              const ret = await Util.ConfirmComRetorno(
                'Você está sincronizando uma venda como ORÇAMENTO'
              );
              if (ret.isConfirmed === false) {
                return;
              }
            }

            await this.sincronizarPedido(venda, index, false, true);
            this.informarQueTemNovasVendas();
          }
        },
      });

      buttons.push({
        text: 'Excluir',
        icon: 'trash',
        handler: () => {
          Util.Confirm('Excluindo ' + tipoVenda, async () => {
            try {
              this.dados
                .excluirVenda(venda.id)
                .then(() => {
                  this.overlay.notificarSucesso(
                    tipoVenda + ' excluído com sucesso!'
                  );
                  this.pendentes.splice(index, 1);
                })
                .catch((e) => {
                  Util.TratarErroEFecharLoading(e, this.overlay);
                });
            } catch (e) {
              Util.TratarErroEFecharLoading(e, this.overlay);
            }
          });
        },
      });
    }

    buttons.push({
      text: 'Voltar',
      icon: 'close',
      role: 'cancel',
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Opções do ' + tipoVenda,
      mode: 'ios',
      buttons,
    });
    await actionSheet.present();
  }

  informarQueTemNovasVendas() {
    try {
      this.sincSrv.informarQueTemNovasVendas().subscribe({
        next: (retorno) => {
          if (!retorno.success) {
            console.error('informarQueTemNovasVendas');
          }
        },
        error: (e) => {
          console.error('informarQueTemNovasVendas', e);
        },
      });
    } catch {}
  }

  sincronizarPedido(
    venda: OperacaoSaida,
    index: number,
    nao_fazer_nada_apos_sincronizar?: boolean,
    mostrar_overlay?: boolean
  ) {
    if (mostrar_overlay) {
      this.overlay.showLoading('Sincronizando a venda...');
    }
    if (venda.dados_json.status_manipulacao) {
      //ja ta fazendo alguma coisa (sincronizando ou ta excluido)
      return;
    }
    venda.dados_json.status_manipulacao = 1;
    try {
      this.sincSrv.enviarOperacaoSaida(venda.dados_json).subscribe({
        next: (r) => {
          venda.dados_json.status_manipulacao = null;
          if (r.success === true) {
            venda.id_nuvem = r.retorno.id;
            venda.sincronizado_em = r.retorno.sincronizado_em;
            OperacaoSaidaUtil.PreecherDadosJson(venda);
            this.dados
              .atualizarIdNuvemVenda(
                venda.id,
                r.retorno.id,
                r.retorno.sincronizado_em
              )
              .then(() => {
                if (!nao_fazer_nada_apos_sincronizar) {
                  this.overlay.notificarSucesso(
                    'Venda sincronizada com sucesso!'
                  );

                  this.pendentes.splice(index, 1);
                  this.sincronizados.unshift(venda);

                  if (mostrar_overlay) {
                    this.overlay.dismissLoadCtrl();
                  }
                }
              })
              .catch((e) => {
                Util.TratarErro(e);
                venda.dados_json.status_manipulacao = null;
                if (mostrar_overlay) {
                  this.overlay.dismissLoadCtrl();
                }
              });
          } else {
            this.overlay.notificarErro(r.message);
            if (mostrar_overlay) {
              this.overlay.dismissLoadCtrl();
            }
          }
        },
        error: (e) => {
          Util.TratarErro(e);
          venda.dados_json.status_manipulacao = null;
          if (mostrar_overlay) {
            this.overlay.dismissLoadCtrl();
          }
        },
      });
    } catch (e) {
      Util.TratarErro(e);
      venda.dados_json.status_manipulacao = null;
      if (mostrar_overlay) {
        this.overlay.dismissLoadCtrl();
      }
    }
  }

  AbrirTelaVenda(objVenda?: OperacaoSaida, copiando?: boolean) {
    let id_venda: number = null;
    let acao = 'novo';
    if (objVenda) {
      id_venda = objVenda.id;
      if (copiando === true) {
        acao = 'copiando';
      } else {
        acao = 'editando';
      }
    }

    this.router.navigate(['home/vendas/tela-venda', { id_venda, acao }]);
  }
}
