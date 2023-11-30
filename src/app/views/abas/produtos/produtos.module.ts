import { NgModule } from '@angular/core';
import { ProdutosComponent } from './produtos.component';
import { CadastrarComponent } from './cadastrar/cadastrar.component';
import { SharedModule } from 'src/app/core/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProdutosComponent, CadastrarComponent],
  imports: [
    SharedModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild([
      {
        path: '',
        component: ProdutosComponent,
      },
    ]),
  ],
})
export class ProdutosModule {}
