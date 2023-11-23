import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/core/shared.module';
import { DetalhesBalancoComponent } from './detalhes-balanco/detalhes-balanco.component';
import { BalancoComponent } from './balanco.component';
import { PDFGenerator } from '@awesome-cordova-plugins/pdf-generator/ngx';

@NgModule({
  declarations: [
    BalancoComponent,
    DetalhesBalancoComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: BalancoComponent,
      }
    ]),
  ],
  providers: [PDFGenerator],
})
export class BalancoModule {}
