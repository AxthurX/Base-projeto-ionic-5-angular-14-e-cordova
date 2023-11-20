import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { RetornoAPIGenerico } from '../model/retorno-api.model';
import { OperacaoSaidaJson } from '../model/operacao-saida.model';
import { OperacaoBalancoJson } from '../model/operacao-balanco.model';
@Injectable({
  providedIn: 'root',
})
export class SincronizacaoService {
  keyEmpresa: string;
  constructor(private http: HttpClient, private authSrv: AuthService) {
    this.keyEmpresa = 'computaria:empresa';
  }

  enviarOperacaoSaida(objeto: OperacaoSaidaJson) {
    const dadosEmpresa = this.authSrv.getDadosEmpresaLogada();
    //clono o objeto pra poder limpar algumas variais q n vou precisar, e assim economizar espaço na nuvem
    //pq n uso json ignore? pq essa merda n funciona, testei as principais soluções e nenhuma funfou
    //entao bora apelar!
    const objEnviar: OperacaoSaidaJson = {
      ...objeto,
    };

    objEnviar.produtos.forEach((c) => {
      c.imagem = c.descricao = c.grupo = c.fabricante = c.sub_grupo = '';
    });
    const json_envio = JSON.stringify(objEnviar);
    return this.http.post<RetornoAPIGenerico>(`${''}/Envios`, {
      id_colaborador: dadosEmpresa.id_colaborador,
      json_envio,
      tipo_sincronizacao: 0,
    });
  }

  enviarBalanco(objeto: OperacaoBalancoJson) {
    const dadosEmpresa = this.authSrv.getDadosEmpresaLogada();
    //clono o objeto pra poder limpar algumas variais q n vou precisar, e assim economizar espaço na nuvem
    //pq n uso json ignore? pq essa merda n funciona, testei as principais soluções e nenhuma funfou
    //entao bora apelar!
    const objEnviar: OperacaoBalancoJson = {
      ...objeto,
    };

    objEnviar.produtos.forEach((c) => {
      c.imagem = c.descricao = c.grupo = c.fabricante = c.sub_grupo = '';
    });
    objEnviar.id_estoque_locais = objEnviar.estoque_locais?.id;
    const json_envio = JSON.stringify(objEnviar);
    return this.http.post<RetornoAPIGenerico>(`${''}/Envios`, {
      id_colaborador: dadosEmpresa.id_colaborador,
      json_envio,
      tipo_sincronizacao: 1,
    });
  }
}
