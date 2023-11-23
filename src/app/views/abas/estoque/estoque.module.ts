import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/core/shared.module';
import { PDFGenerator } from '@awesome-cordova-plugins/pdf-generator/ngx';
import { EstoqueComponent } from './estoque.component';
import { RelatorioEntradaComponent } from './relatorio-entrada/relatorio-entrada.component';
import { RelatorioSaidaComponent } from './relatorio-saida/relatorio-saida.component';

@NgModule({
  declarations: [
    EstoqueComponent,
    RelatorioEntradaComponent,
    RelatorioSaidaComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: EstoqueComponent,
      },
    ]),
  ],
  providers: [PDFGenerator],
})
export class EstoqueModule {}
