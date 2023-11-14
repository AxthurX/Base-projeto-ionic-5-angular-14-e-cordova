import { Component, OnInit } from '@angular/core';
import { AuthService, DadosEmpresa } from '../../service/auth.service';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.scss'],
})
export class CabecalhoComponent implements OnInit {
  instalacoes: DadosEmpresa;
  constructor(private srv: AuthService) {}

  ngOnInit() {
    this.instalacoes = this.srv.getDadosEmpresaLogada();
  }
}
