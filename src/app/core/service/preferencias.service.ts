import { Injectable } from '@angular/core';
import { FiltrosPesquisarPreferenciasModel } from '../model/filtros-pesquisas-preferencias.model';

@Injectable({
  providedIn: 'root',
})
export class PreferenciasService {
  keyFiltroPesquisasPrerencias: string;
  constructor() {
    this.keyFiltroPesquisasPrerencias = 'computaria:pref:filtros_pesquisas';
  }

  setPrerencias(objeto: FiltrosPesquisarPreferenciasModel) {
    localStorage.setItem(
      this.keyFiltroPesquisasPrerencias,
      JSON.stringify(objeto)
    );
  }

  getPrerencias(): FiltrosPesquisarPreferenciasModel {
    return JSON.parse(localStorage.getItem(this.keyFiltroPesquisasPrerencias));
  }

  setPreferenciaProduto(valor: string) {
    let preferencia = this.getPrerencias();
    if (!preferencia) {
      preferencia = new FiltrosPesquisarPreferenciasModel();
    }
    preferencia.produto = valor;
    this.setPrerencias(preferencia);
  }

  getPreferenciaProduto(): string {
    let preferencia = this.getPrerencias();
    if (!preferencia) {
      preferencia = new FiltrosPesquisarPreferenciasModel();
    }
    if (!preferencia.produto) {
      preferencia.produto = 'geral';
      this.setPrerencias(preferencia);
    }
    return preferencia.produto;
  }
}
