import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/core/shared.module';
import { PDFGenerator } from '@awesome-cordova-plugins/pdf-generator/ngx';
import { RelatoriosComponent } from './relatorios.component';
import { RelatorioEntradaComponent } from './relatorio-entrada/relatorio-entrada.component';
import { RelatorioSaidaComponent } from './relatorio-saida/relatorio-saida.component';

@NgModule({
  declarations: [
    RelatoriosComponent,
    RelatorioEntradaComponent,
    RelatorioSaidaComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: RelatoriosComponent,
      },
      {
        path: 'relatorio-saida',
        component: RelatorioSaidaComponent
      },
      {
        path: 'relatorio-entrada',
        component: RelatorioEntradaComponent
      }
    ]),
  ],
  providers: [PDFGenerator],
})
export class RelatoriosModule {}
