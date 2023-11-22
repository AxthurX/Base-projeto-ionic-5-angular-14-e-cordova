import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ViewProduto } from 'src/app/core/model/data-base/view-produto.model';
import { Util } from 'src/app/core/util.model';
import { ProdutoUtil } from 'src/app/core/model/produto-util.model';
import { File } from '@ionic-native/file/ngx';
import { fromEvent, Subscription } from 'rxjs';
import { CabecalhoPesquisaProdutoComponent } from 'src/app/core/components/cabecalho-pesquisa-produto/cabecalho-pesquisa-produto.component';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { DataBaseProvider } from 'src/app/core/service/database';
import { CadastrarComponent } from './cadastrar/cadastrar.component';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
})
export class ProdutosComponent extends ClasseBase implements OnInit, OnDestroy {
  @ViewChild('pesquisa') pesquisa;
  cabecalho_parente: CabecalhoPesquisaProdutoComponent;
  registros: ViewProduto[] = [];
  texto_pesquisado: string;
  path_imagens_produtos: string;
  consultando: boolean;
  apenas_consulta: boolean;
  private backbuttonSubscription: Subscription;
  constructor(
    public modal: ModalController,
    private overlay: OverlayService,
    private dbProvider: DataBaseProvider,
    private navParams: NavParams,
    private file: File,
    auth: AuthService
  ) {
    super(auth);
    this.consultando = false;
    this.apenas_consulta = false;
    this.path_imagens_produtos = Util.GetPathImagens(file);
  }

  ngOnDestroy() {
    this.backbuttonSubscription.unsubscribe();
  }

  async ngOnInit() {
    const event = fromEvent(document, 'backbutton');
    this.backbuttonSubscription = event.subscribe(async () => {
      try {
        this.aplicar();
      } catch {}
    });

    try {
      this.apenas_consulta = this.navParams.data.apenas_consulta;
      this.texto_pesquisado = this.navParams.data.texto_pesquisado;
      this.cabecalho_parente = this.navParams.data.cabecalho;
      if (this.texto_pesquisado || this.navParams.data.filtro_pesquisa) {
        this.onPesquisar(
          this.navParams.data.filtro_pesquisa,
          this.navParams.data.texto_pesquisado
        );
      }

      setTimeout(() => {
        try {
          this.pesquisa.setFocus();
        } catch {}
      }, 500);
    } catch {}
  }

  onPesquisar(filtro_pesquisa: string, texto_pesquisado: string) {
    try {
      texto_pesquisado = texto_pesquisado?.toUpperCase();
      setTimeout(async () => {
        this.consultando = true;
        this.registros = [];

        this.registros = await this.dbProvider.getProdutos(
          filtro_pesquisa,
          texto_pesquisado
        );

        if (this.registros.length === 0) {
          this.overlay.showToast('Nenhum resultado encontrado', 'light');
        }

        this.registros.forEach((produto) => {
          if (this.cabecalho_parente?.permitir_quantidade_zero === true) {
            produto.quantidade = null;
          }
        });

        const produtosJaAdicionados =
          this.cabecalho_parente?.tela_vendas?.getQuantidadesJaLancadas();

        if (produtosJaAdicionados?.length > 0) {
          produtosJaAdicionados.forEach((lancada) => {
            const pConsulta = this.registros.find((c) => c.id === lancada.id);
            if (pConsulta) {
              if (pConsulta.quantidade_adicionada > 0) {
                pConsulta.quantidade_adicionada += lancada.valor;
              } else {
                pConsulta.quantidade_adicionada = lancada.valor;
              }
              pConsulta.quantidade_adicionada = Util.GetValorArredondado(
                pConsulta.quantidade_adicionada,
                3
              );
            }
          });
        }

        this.consultando = false;
      }, 400);
    } catch (e) {
      this.consultando = false;
      Util.TratarErroEFecharLoading(e, this.overlay);
    }
  }

  async carregarImagemProduto(produto: ViewProduto) {
    try {
      const base = await this.file.readAsDataURL(
        this.path_imagens_produtos,
        `${produto.id}_1.png`
      );
      produto.imagem = base;
    } catch {}
  }

  aumentarQuantidade(registro: ViewProduto) {
    if (!registro.quantidade) {
      registro.quantidade = 0;
    }
    registro.quantidade++;
    this.CalcularPrecoETotalBruto(registro);
  }

  onAlterouQuantidadeManualmente(registro: ViewProduto) {
    if (registro.quantidade > 0) {
      this.CalcularPrecoETotalBruto(registro);
    }
  }

  mostrarFoto(registro: ViewProduto) {
    registro.mostrar_foto = !registro.mostrar_foto;
    if (registro.mostrar_foto) {
      this.carregarImagemProduto(registro);
    }
  }

  diminuirQuantidade(registro: ViewProduto) {
    if (!registro.quantidade) {
      registro.quantidade = 0;
    }
    registro.quantidade--;
    this.CalcularPrecoETotalBruto(registro);
    if (registro.quantidade < 0) {
      registro.quantidade = null;
    }
  }

  CalcularPrecoETotalBruto(registro: ViewProduto) {
    ProdutoUtil.CalcularPrecoETotalBruto(registro);
  }

  aplicar() {
    if (this.cabecalho_parente) {
      const aplicar = this.registros.filter(
        (c) =>
          c.quantidade > 0 ||
          // eslint-disable-next-line eqeqeq
          (this.cabecalho_parente.permitir_quantidade_zero && c.quantidade == 0)
      );
      if (aplicar.length === 0) {
        this.overlay.showToast('Nenhuma quantidade foi informada', 'warning');
      } else {
        this.modal.dismiss();
        this.cabecalho_parente.ConsultouProdutos(aplicar);
      }
    } else {
      this.modal.dismiss();
    }
  }

  getFoto(index: number): ViewProduto {
    try {
      return this.registros[index];
    } catch {
      return null;
    }
  }

  async AbrirTelaCadastro() {
    const modal = await this.modal.create({
      component: CadastrarComponent,
    });

    await modal.present();
  }
}
