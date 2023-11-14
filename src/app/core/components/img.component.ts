import { Component, Input, OnInit } from '@angular/core';
import { ConsultaProdutoComponent } from 'src/app/views/modais/consulta-produto/consulta-produto.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-img',
  template: `<img
    style="width: {{ largura_px }}px; height: {{ altura_px }}px "
    class="not-found-img"
    (click)="mostrarImagem()"
    [src]="base64"
    onError="this.src='assets/icon/favicon.png'"
  />`,
})
export class ImgComponent implements OnInit {
  @Input() base64: string;
  @Input() descricao: string;
  //pra quando passa pro proximo ou anterior (no modal), n mudar o valor do componente original
  @Input() base64_modal: string;
  @Input() descricao_modal: string;
  @Input() altura_px: number = 60;
  @Input() largura_px: number = 60;
  @Input() index: number = 0;
  @Input() consulta: ConsultaProdutoComponent;
  constructor() {}
  ngOnInit(): void {
    setTimeout(() => {
      this.base64_modal = this.base64;
      this.descricao_modal = this.descricao;
    }, 500);
  }

  mostrarImagem() {
    Swal.fire({
      heightAuto: false,
      html:
        '<img src="' +
        this.base64_modal +
        '" /> <br><br>' +
        this.descricao_modal,
      showConfirmButton: true,
      showCancelButton: this.consulta !== undefined,
      showDenyButton: this.consulta !== undefined && this.index > 0,
      focusConfirm: true,
      confirmButtonText: 'Próximo',
      denyButtonText: 'Anterior',
      cancelButtonText: 'Fechar',
      reverseButtons: true,
    }).then((value) => {
      if (value.isDenied || value.isConfirmed) {
        if (value.isDenied) {
          this.index--;
        } else if (value.isConfirmed) {
          this.index++;
        }
        let registro = this.consulta.getFoto(this.index);
        if (!registro) {
          this.index = 0;
          registro = this.consulta.getFoto(this.index);
        }

        this.base64_modal = registro.imagem;
        this.descricao_modal = registro.descricao;

        this.mostrarImagem();
      }
    });
  }
}
