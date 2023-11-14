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

  getRegistros(
    controler: string,
    PageNumber: number,
    id_empresa?: number,
    id_colaborador?: number,
    rota_adicional?: string
  ) {
    let url = `${''}/${controler}/all`;
    if (rota_adicional) {
      url += `/${rota_adicional}`;
    }

    url += `?PageNumber=${PageNumber}&PageSize=10000`;

    if (id_empresa) {
      url += `&id_empresa=${id_empresa}`;
    }
    if (id_colaborador) {
      url += `&id_colaborador=${id_colaborador}`;
    }
    return this.http.get<RetornoAPIGenerico>(url);
  }

  getJsonVendaNuvem(id_venda_erp: number) {
    const id_empresa_nuvem =
      this.authSrv.getDadosEmpresaLogada().id_empresa_nuvem;
    const url = `${''}/envios/get-json-venda?id_empresa_nuvem=${id_empresa_nuvem}&id_venda_erp=${id_venda_erp}`;

    return this.http.get<RetornoAPIGenerico>(url);
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
      c.imagem =
        c.descricao =
        c.grupo =
        c.fabricante =
        c.sub_grupo =
        c.aplicacao =
          '';
      c.invalidades = [];
    });
    const json_envio = JSON.stringify(objEnviar);
    return this.http.post<RetornoAPIGenerico>(`${''}/Envios`, {
      id_empresa: dadosEmpresa.id_empresa_nuvem,
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
      c.imagem =
        c.descricao =
        c.grupo =
        c.fabricante =
        c.sub_grupo =
        c.aplicacao =
          '';
      c.invalidades = [];
    });
    objEnviar.id_erp_estoque_locais = objEnviar.estoque_locais?.id_erp;
    const json_envio = JSON.stringify(objEnviar);
    return this.http.post<RetornoAPIGenerico>(`${''}/Envios`, {
      id_empresa: dadosEmpresa.id_empresa_nuvem,
      id_colaborador: dadosEmpresa.id_colaborador,
      json_envio,
      tipo_sincronizacao: 1,
    });
  }

  enviarTeste() {
    const dadosEmpresa = this.authSrv.getDadosEmpresaLogada();
    //clono o objeto pra poder limpar algumas variais q n vou precisar, e assim economizar espaço na nuvem
    //pq n uso json ignore? pq essa merda n funciona, testei as principais soluções e nenhuma funfou
    //entao bora apelar!
    const objEnviar = {
      teste: 'enviarTeste',
    };

    const json_envio = JSON.stringify(objEnviar);
    return this.http.post<RetornoAPIGenerico>(`${''}/Envios`, {
      id_empresa: dadosEmpresa.id_empresa_nuvem,
      id_colaborador: dadosEmpresa.id_colaborador,
      json_envio,
      tipo_sincronizacao: -1,
    });
  }

  enviarTesteUrlFunctions() {
    const dadosEmpresa = this.authSrv.getDadosEmpresaLogada();
    //clono o objeto pra poder limpar algumas variais q n vou precisar, e assim economizar espaço na nuvem
    //pq n uso json ignore? pq essa merda n funciona, testei as principais soluções e nenhuma funfou
    //entao bora apelar!
    const objEnviar = {
      teste: 'enviarTesteUrlFunctions',
    };

    const json_envio = JSON.stringify(objEnviar);
    return this.http.post<RetornoAPIGenerico>(
      `https://us-central1-nossoerp-obtersolucoes.cloudfunctions.net/webApi/api/auxiliar`,
      {
        id_empresa: dadosEmpresa.id_empresa_nuvem,
        id_colaborador: dadosEmpresa.id_colaborador,
        json_envio,
        tipo_sincronizacao: -1,
      }
    );
  }

  postObjNossoERPCollectionWebApi(obj: any) {
    return this.http.post<RetornoAPIGenerico>(
      `https://us-central1-nossoerp-obtersolucoes.cloudfunctions.net/webApi/api/nossoerp`,
      obj
    );
  }

  informarQueTemNovasVendas() {
    const id_banco = this.authSrv
      .getDadosEmpresaLogada()
      .id_banco_gerenciador.toString();

    return this.http.post<RetornoAPIGenerico>(
      `${''}/Envios/InformarQueTemNovasVendas?id_banco=${id_banco}`,
      null
    );
  }
}
