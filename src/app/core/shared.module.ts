import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavParams } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BtnVoltarComponent } from './components/btn-voltar.component';
import { CabecalhoPesquisaProdutoComponent } from './components/cabecalho-pesquisa-produto/cabecalho-pesquisa-produto.component';
import { CabecalhoVendaComponent } from './components/cabecalho-venda/cabecalho-venda.component';
import { LookupComponent } from './components/lookup/lookup.component';
import { TxtPesquisarComponent } from './components/txt-pesquisar.component';
import { ImgComponent } from './components/img.component';
import { NgxMaskModule } from 'ngx-mask';
import { ConsultaProdutoComponent } from '../views/modais/consulta-produto/consulta-produto.component';
import { ConsultandoComponent } from './components/consultando/consultando.component';
import { DropDownComponent } from './components/dropdown/dropdown.component';

@NgModule({
  declarations: [
    BtnVoltarComponent,
    CabecalhoPesquisaProdutoComponent,
    CabecalhoVendaComponent,
    LookupComponent,
    TxtPesquisarComponent,
    ImgComponent,
    ConsultaProdutoComponent,
    ConsultandoComponent,
    DropDownComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    BtnVoltarComponent,
    CabecalhoPesquisaProdutoComponent,
    ConsultaProdutoComponent,
    CabecalhoVendaComponent,
    LookupComponent,
    TxtPesquisarComponent,
    ImgComponent,
    ConsultandoComponent,
    DropDownComponent,
  ],
  providers: [NavParams],
})
export class SharedModule {}
