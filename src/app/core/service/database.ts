import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Empresa } from '../model/data-base/empresa.model';
import { ProdutoEmpresaPromocao } from '../model/data-base/produto-empresa-promocao.model';
import { ProdutoEmpresa } from '../model/data-base/produto-empresa.model';
import { Produto } from '../model/data-base/produto.model';
import { Usuario } from '../model/data-base/usuario.model';
import { ViewProdutoEmpresa } from '../model/data-base/view-produto-empresa.model';
import { OperacaoSaidaUtil } from '../model/operacao-saida-util.model';
import { OperacaoSaida } from '../model/operacao-saida.model';
import { ProdutoUtil } from '../model/produto-util.model';
import { Util } from '../util.model';
import { AuthService } from './auth.service';
import { EstoqueLocais } from '../model/data-base/estoque-locais.model';
import { Balanco } from '../model/data-base/balanco.model';
import { BalancoItem } from '../model/data-base/balanco-item.model';
import { OperacaoBalanco } from '../model/operacao-balanco.model';

@Injectable({
  providedIn: 'root',
})
export class DataBaseProvider {
  dados: SQLiteObject;
  limit_consulta_produtos = 100;
  constructor(private sqlite: SQLite, private auth: AuthService) {}

  public dropDB() {
    return this.sqlite.deleteDatabase(this.getConfigDb());
  }

  public LimparTabela(tabela: string, id_empresa?: number): Promise<any> {
    return id_empresa
      ? this.dados.executeSql(
          'delete from ' + tabela + ' where id_empresa = ' + id_empresa,
          []
        )
      : this.dados.executeSql('delete from ' + tabela, []);
  }

  public createDatabase() {
    return this.sqlite
      .create(this.getConfigDb())
      .then((db: SQLiteObject) => {
        this.dados = db;
        // Criando as tabelas
        this.createTables();
      })
      .catch((e) => console.log(e));
  }

  public getProdutosEmpresa(filtro_pesquisa: string, pesquisa: string) {
    const retorno: ViewProdutoEmpresa[] = [];
    if (!pesquisa) {
      pesquisa = '';
    }
    const id: number = +pesquisa.trim();
    let sql =
      'select produto_empresa.id, produto_empresa.id_erp, produto_empresa.id_produto, produto.id_erp id_produto_erp, id_produto_grupo, produto_grupo.id_erp id_produto_grupo_erp, id_produto_sub_grupo, produto_sub_grupo.id_erp id_produto_sub_grupo_erp, id_produto_fabricante, produto_fabricante.id_erp id_produto_fabricante_erp, produto.descricao, produto.referencia, produto.aplicacao, produto.ativo ativo_produto, produto_empresa.ativo ativo_produto_empresa, produto.codigo_original, produto.gtin, produto.movimenta_fracionado, produto.nao_calcula_saldo_flex, produto.tipo_alteracao_preco, produto.unidade, produto_empresa.pcusto, produto_empresa.pvenda_atacado, produto_empresa.pvenda_super_atacado, produto_empresa.pvenda_varejo, produto_empresa.saldo_total, produto_empresa.id_empresa, produto_sub_grupo.descricao sub_grupo, produto_grupo.descricao grupo, produto_fabricante.descricao fabricante, produto_empresa.desconto_maximo_varejo_prc, produto_empresa.desconto_maximo_atacado_prc, produto_empresa.desconto_maximo_super_atacado_prc, produto_empresa.quantidade_minima_atacado, produto_empresa.quantidade_minima_super_atacado, produto_empresa.desconto_maximo_varejo_vlr, produto_empresa.desconto_maximo_atacado_vlr, produto_empresa.desconto_maximo_super_atacado_vlr, produto_empresa.pcompra, produto_empresa.pfornecedor from produto_empresa join produto on produto.id = produto_empresa.id_produto join produto_sub_grupo on produto_sub_grupo.id = produto.id_produto_sub_grupo join produto_grupo on produto_grupo.id = produto_sub_grupo.id_produto_grupo join produto_fabricante on produto_fabricante.id = produto.id_produto_fabricante';

    //gambis, passando direto os ids dos produtos na consulta
    if (pesquisa.startsWith('produto.id_erp in')) {
      sql += ` where ${pesquisa}`;
    } else if (filtro_pesquisa === 'geral') {
      if (id > 0) {
        sql += ` where produto.id_erp = ${id} or produto.gtin like '${pesquisa}'`;
      } else {
        pesquisa = pesquisa.toUpperCase();
        sql += ` where produto.descricao like '%${pesquisa}%' or produto.gtin like '%${pesquisa}%' or produto.referencia like '%${pesquisa}%' or produto.aplicacao like '%${pesquisa}%' or codigo_original like '%${pesquisa}%' or produto_sub_grupo.descricao like '%${pesquisa}%' or produto_grupo.descricao like '%${pesquisa}%'  or produto_fabricante.descricao like '%${pesquisa}%'`;
      }
    } else if (filtro_pesquisa === 'id') {
      if (id > 0) {
        sql += ' where produto.id_erp = ' + id;
      } else {
        //forço um retorno vazio caso n seja um id valido
        return Promise.resolve(retorno);
      }
    } else if (filtro_pesquisa === 'gtin') {
      sql += ` where TRIM(produto.gtin) like '${pesquisa}'`;
    } else if (filtro_pesquisa === 'ids_produtos') {
      sql += ` where produto.id_erp in (${pesquisa})`;
    }
    sql += ' order by produto.descricao limit ' + this.limit_consulta_produtos;

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new ViewProdutoEmpresa();
            newItem.descricao = registro.descricao;
            newItem.aplicacao = registro.aplicacao;
            newItem.id = +registro.id;
            newItem.id_erp = +registro.id_erp;
            newItem.id_produto = +registro.id_produto;
            newItem.id_produto_erp = +registro.id_produto_erp;
            newItem.id_produto_grupo = +registro.id_produto_grupo;
            newItem.id_produto_grupo_erp = +registro.id_produto_grupo_erp;
            newItem.id_produto_sub_grupo = +registro.id_produto_sub_grupo;
            newItem.id_produto_sub_grupo_erp =
              +registro.id_produto_sub_grupo_erp;
            newItem.id_produto_fabricante = +registro.id_produto_fabricante;
            newItem.id_produto_fabricante_erp =
              +registro.id_produto_fabricante_erp;
            newItem.tipo_alteracao_preco = +registro.tipo_alteracao_preco;
            newItem.id_empresa = +registro.id_empresa;
            newItem.pcusto = registro.pcusto;
            newItem.pvenda_atacado = registro.pvenda_atacado;
            newItem.pvenda_super_atacado = registro.pvenda_super_atacado;
            newItem.pcompra = registro.pcompra;
            newItem.pfornecedor = registro.pfornecedor;
            newItem.saldo_total = registro.saldo_total;
            newItem.pvenda_varejo = registro.pvenda_varejo;
            newItem.unidade = registro.unidade;
            newItem.codigo_original = registro.codigo_original;
            newItem.referencia = registro.referencia;
            newItem.gtin = registro.gtin;
            newItem.sub_grupo = registro.sub_grupo;
            newItem.grupo = registro.grupo;
            newItem.fabricante = registro.fabricante;
            newItem.desconto_maximo_varejo_vlr =
              registro.desconto_maximo_varejo_vlr;
            newItem.desconto_maximo_atacado_vlr =
              registro.desconto_maximo_atacado_vlr;
            newItem.desconto_maximo_super_atacado_vlr =
              registro.desconto_maximo_super_atacado_vlr;
            newItem.desconto_maximo_varejo_prc =
              registro.desconto_maximo_varejo_prc;
            newItem.desconto_maximo_atacado_prc =
              registro.desconto_maximo_atacado_prc;
            newItem.desconto_maximo_super_atacado_prc =
              registro.desconto_maximo_super_atacado_prc;
            newItem.quantidade_minima_atacado =
              registro.quantidade_minima_atacado;
            newItem.quantidade_minima_super_atacado =
              registro.quantidade_minima_super_atacado;
            newItem.movimenta_fracionado =
              registro.movimenta_fracionado === 'true';
            newItem.nao_calcula_saldo_flex =
              registro.nao_calcula_saldo_flex === 'true';

            retorno.push(newItem);
          }
          return retorno;
        } else {
          return retorno;
        }
      })
      .catch((e) => {
        Util.TratarErro(e);
        return retorno;
      });
  }

  public getEstoqueLocais(pesquisa: string) {
    const retorno: EstoqueLocais[] = [];
    const id: number = +pesquisa;
    const sql = 'select id, id_erp, descricao from estoque_locais';

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new EstoqueLocais();
            newItem.id = +registro.id;
            newItem.id_erp = +registro.id_erp;
            newItem.id_empresa = +registro.id_empresa;
            newItem.descricao = registro.descricao;

            retorno.push(newItem);
          }
          return retorno;
        } else {
          return retorno;
        }
      })
      .catch((e) => {
        Util.TratarErro(e);
        return retorno;
      });
  }

  public getMenorIdTabela(tabela: string) {
    const retorno = 0;
    const sql = `select min(id) id from ${tabela}`;

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            return +registro.id;
          }
          return retorno;
        } else {
          return retorno;
        }
      })
      .catch((e) => {
        Util.TratarErro(e);

        return retorno;
      });
  }

  public getQuantidadeRegistros(tabela: string) {
    const retorno = 0;
    const sql = `select count(id) quantidade from ${tabela}`;

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            return +registro.quantidade;
          }
          return retorno;
        } else {
          return retorno;
        }
      })
      .catch((e) => {
        Util.TratarErro(e);

        return retorno;
      });
  }

  public getVendas(
    limit: number,
    offset: number,
    apenas_pendentes: boolean,
    apenas_sincronizadas: boolean
  ) {
    const retorno: OperacaoSaida[] = [];
    let sql = `select * from operacao_saida`;
    if (apenas_pendentes || apenas_sincronizadas) {
      sql += ' where ';
      if (apenas_pendentes) {
        sql += ' id_nuvem is null ';
      } else if (apenas_sincronizadas) {
        sql += ' id_nuvem is not null ';
      }
    }
    sql += ` order by data desc limit ${limit} offset ${offset}`;
    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new OperacaoSaida();
            newItem.id = +registro.id;
            newItem.data = +registro.data;
            newItem.id_cliente = registro.id_cliente;
            newItem.id_forma_pagamento = registro.id_forma_pagamento;
            newItem.id_tipo_operacao = registro.id_tipo_operacao;
            newItem.json = registro.json;
            newItem.sincronizado_em = registro.sincronizado_em;
            newItem.id_nuvem = registro.id_nuvem;

            retorno.push(newItem);
          }
          return retorno;
        } else {
          return retorno;
        }
      })
      .catch((e) => {
        Util.TratarErro(e);

        return retorno;
      });
  }

  public getBalancos() {
    const retorno: OperacaoBalanco[] = [];
    const sql = 'select * from operacao_balanco order by data desc limit 300';

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new OperacaoBalanco();
            newItem.id = +registro.id;
            newItem.data = +registro.data;
            newItem.json = registro.json;
            newItem.id_nuvem = registro.id_nuvem;
            newItem.estoque_locais = +registro.estoque_locais;
            newItem.sincronizado_em = registro.sincronizado_em;

            retorno.push(newItem);
          }
          return retorno;
        } else {
          return retorno;
        }
      })
      .catch((e) => {
        Util.TratarErro(e);

        return retorno;
      });
  }

  public getNumeroVersaoBanco() {
    const retorno: number = 0;
    const sql = 'select max(numero_versao) numero_versao from versao_banco';

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          return +data.rows.item(0).numero_versao;
        } else {
          return retorno;
        }
      })
      .catch((e) => {
        Util.TratarErro(e);

        return retorno;
      });
  }

  public getVenda(id: number) {
    const sql = 'select * from operacao_saida where id = ' + id;

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new OperacaoSaida();
            newItem.id = +registro.id;
            newItem.data = +registro.data;
            newItem.id_cliente = registro.id_cliente;
            newItem.id_forma_pagamento = registro.id_forma_pagamento;
            newItem.id_tipo_operacao = registro.id_tipo_operacao;
            newItem.json = registro.json;
            OperacaoSaidaUtil.PreecherDadosJson(newItem);
            return newItem;
          }
          return null;
        } else {
          return null;
        }
      })
      .catch((e) => {
        Util.TratarErro(e);
        return null;
      });
  }

  public getOperacaoBalanco(id: number) {
    const sql = 'select * from operacao_balanco where id = ' + id;

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new OperacaoBalanco();
            newItem.id = +registro.id;
            newItem.data = +registro.data;
            newItem.estoque_locais = +registro.estoque_locais;
            newItem.json = registro.json;
            return newItem;
          }
          return null;
        } else {
          return null;
        }
      })
      .catch((e) => {
        Util.TratarErro(e);
        return null;
      });
  }

  public getEmpresaLogada() {
    return this.getEmpresa(this.auth.getDadosEmpresaLogada().id_empresa_nuvem);
  }

  public getEmpresa(id: number) {
    let retorno: Empresa = null;
    const sql = 'select * from empresa where id = ' + id;
    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            retorno = new Empresa();
            retorno.id = +registro.id;
            retorno.mensagem_bloqueio_venda_limite_credito =
              registro.mensagem_bloqueio_venda_limite_credito;
            retorno.desconto_porcentagem_maximo_permitido =
              +registro.desconto_porcentagem_maximo_permitido;
            retorno.bloquear_acesso_aos_custos_produto =
              registro.bloquear_acesso_aos_custos_produto;
            retorno.dias_tolerancia_cobrar_juros =
              +registro.dias_tolerancia_cobrar_juros;
            retorno.juros_mensal_contas_a_receber_em_atraso =
              +registro.juros_mensal_contas_a_receber_em_atraso;
            retorno.multa_contas_a_receber_em_atraso =
              +registro.multa_contas_a_receber_em_atraso;
            retorno.bloquear_pedidos_a_prazo_cliente_limite_excedido =
              Util.AnyToBool(
                registro.bloquear_pedidos_a_prazo_cliente_limite_excedido
              );
            retorno.consultar_apenas_produto_saldo_maior_zero = Util.AnyToBool(
              registro.consultar_apenas_produto_saldo_maior_zero
            );
            retorno.confirmar_alteracao_preco_tela_vendas_ao_alterar_forma_pagamento =
              Util.AnyToBool(
                registro.confirmar_alteracao_preco_tela_vendas_ao_alterar_forma_pagamento
              );
            retorno.exibir_preco_atacado_consulta_produto = Util.AnyToBool(
              registro.exibir_preco_atacado_consulta_produto
            );
            break;
          }
        }
        return retorno;
      })
      .catch((e) => {
        Util.TratarErro(e);

        return retorno;
      });
  }

  public getUsuario(id_colaborador: number) {
    let retorno: Usuario = null;
    const sql =
      'select * from usuario where id_colaborador = ' + id_colaborador;

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            retorno = new Usuario();
            retorno.id = +registro.id;
            retorno.id_colaborador = +registro.id_colaborador;
            retorno.desconto_porcentagem_maximo_permitido =
              +registro.desconto_porcentagem_maximo_permitido;
            retorno.bloquear_acesso_aos_custos_produto =
              registro.bloquear_acesso_aos_custos_produto;
            break;
          }
        }
        return retorno;
      })
      .catch((e) => {
        Util.TratarErro(e);

        return retorno;
      });
  }

  public getProdutosEmPromocao(id_forma_pagamento: number) {
    const id_empresa = this.auth.getDadosEmpresaLogada().id_empresa_nuvem;
    const data_atual = new Date().getTime();
    const retorno: ProdutoEmpresaPromocao[] = [];
    let sql = `select id_produto_empresa, promocoes.id_erp id_promocao_erp, valor_promocional, sobrepor_tabela_preco from promocoes_itens join promocoes on promocoes.id = promocoes_itens.id_promocoes join promocoes_por_forma_pagamento on promocoes_por_forma_pagamento.id_promocoes = promocoes.id where promocoes.id_empresa = ${id_empresa} and ${data_atual} >= data_inicio_long and ${data_atual} <= data_fim_long `;

    if (id_forma_pagamento) {
      sql += ` and promocoes_por_forma_pagamento.id_forma_pagamento = ${id_forma_pagamento}`;
    }

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new ProdutoEmpresaPromocao();
            newItem.id = +registro.id_produto_empresa;
            newItem.id_promocao_erp = +registro.id_promocao_erp;
            newItem.valor_promocional = Util.GetValorArredondado(
              registro.valor_promocional
            );
            newItem.sobrepor_tabela_preco = Util.AnyToBool(
              registro.sobrepor_tabela_preco
            );

            retorno.push(newItem);
          }
          return retorno;
        } else {
          return retorno;
        }
      })
      .catch((e) => {
        Util.TratarErro(e);
        return retorno;
      });
  }

  public async getProdutosComPrecoJaCalculado(
    filtro_pesquisa: string,
    texto_pesquisado: string,
    tipo_preco_produto?: number,
    id_tabela_preco_erp?: number,
    id_forma_pagamento?: number
  ) {
    try {
      const empresa = await this.getEmpresaLogada();

      //consulto produtos em promocao
      const emPromocao = await this.getProdutosEmPromocao(id_forma_pagamento);

      //consulto tabela de preco se necessario
      const itensTabelaPreco = null; // await this.getItensTabelaPreco(
      //   id_tabela_preco_erp
      // );

      let registros = await this.getProdutosEmpresa(
        filtro_pesquisa,
        texto_pesquisado
      );

      registros.forEach((r) => {
        r.quantidade = 0;
        let id_promocao = null;
        let valor_promocao = null;
        let promocao_sobrepor_tabela = null;
        let id_tabela_usar = id_tabela_preco_erp;
        let valor_tabela = null;

        const promocao = emPromocao.find((c) => c.id === r.id);
        if (promocao) {
          id_promocao = promocao.id_promocao_erp;
          valor_promocao = promocao.valor_promocional;
          promocao_sobrepor_tabela = promocao.sobrepor_tabela_preco;
        }

        const tabelaPreco = itensTabelaPreco.find(
          (c) => c.id_produto_empresa === r.id
        );
        if (tabelaPreco) {
          valor_tabela = tabelaPreco.valor;
        } else {
          id_tabela_usar = null;
        }

        ProdutoUtil.CalcularPrecoETotalBruto(
          r,
          null,
          tipo_preco_produto,
          id_promocao,
          valor_promocao,
          promocao_sobrepor_tabela,
          id_tabela_usar,
          valor_tabela
        );
      });
      //com preco preenchido e saldo maior que zero caso controle
      registros = registros.filter(
        (c) =>
          c.valor_unitario > 0 &&
          (!empresa.consultar_apenas_produto_saldo_maior_zero ||
            c.saldo_total > 0)
      );

      return registros;
    } catch (e) {
      console.error('getProdutosComPrecoJaCalculado', e);
      throw e;
    }
  }

  public setBalanco(registros: Balanco[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into balanco (id, id_colaborador, id_local_estoque, id_nuvem, data, data_sincronizacao, observacao) values (?, ?, ?, ?, ?, ?, ?)',
        [
          registro.id,
          registro.id_colaborador,
          registro.id_local_estoque,
          registro.id_nuvem,
          registro.data,
          registro.data_sincronizacao,
          registro.observacao,
        ],
      ]);
    });

    return this.dados.sqlBatch(sqlStatements);
  }

  public setBalancoItem(registros: BalancoItem[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into balanco_item (id, id_balanco, id_produto_empresa, saldo_novo, observacao) values (?, ?, ?, ?, ?)',
        [
          registro.id,
          registro.id_balanco,
          registro.id_produto_empresa,
          registro.saldo_novo,
          registro.observacao,
        ],
      ]);
    });

    return this.dados.sqlBatch(sqlStatements);
  }

  public setProdutos(registros: Produto[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into produto (id, descricao, id_erp, id_produto_sub_grupo, id_produto_fabricante, gtin, unidade, ativo, referencia, codigo_original, aplicacao, tipo_alteracao_preco, movimenta_fracionado, nao_calcula_saldo_flex) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          registro.id,
          registro.descricao,
          registro.id_erp,
          registro.id_produto_sub_grupo,
          registro.id_produto_fabricante,
          registro.gtin,
          registro.unidade,
          registro.ativo,
          registro.referencia,
          registro.codigo_original,
          registro.aplicacao,
          registro.tipo_alteracao_preco,
          registro.movimenta_fracionado,
          registro.nao_calcula_saldo_flex,
        ],
      ]);
    });

    return this.dados.sqlBatch(sqlStatements);
  }

  public setAtualizacao(registros: AtualizacoesModel[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into versao_banco (numero_versao) values (?)',
        [registro.numero_versao],
      ]);
    });

    return this.dados.sqlBatch(sqlStatements);
  }

  public setEstoqueLocais(registros: EstoqueLocais[]): Promise<any> {
    const sqlStatements: any[] = [];
    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into estoque_locais (id, id_erp, id_empresa, descricao) values (?, ?, ?, ?)',
        [registro.id, registro.id_erp, registro.id_empresa, registro.descricao],
      ]);
    });

    return this.dados.sqlBatch(sqlStatements);
  }

  public setProdutosEmpresa(registros: ProdutoEmpresa[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into produto_empresa (ativo, desconto_maximo_atacado_prc, desconto_maximo_atacado_vlr, desconto_maximo_super_atacado_prc, desconto_maximo_super_atacado_vlr, desconto_maximo_varejo_prc, desconto_maximo_varejo_vlr, id, id_empresa, id_erp, id_produto, pcompra, pcusto, pfornecedor, pvenda_atacado, pvenda_super_atacado, pvenda_varejo, quantidade_minima_atacado, quantidade_minima_super_atacado, saldo_total) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          registro.ativo,
          registro.desconto_maximo_atacado_prc,
          registro.desconto_maximo_atacado_vlr,
          registro.desconto_maximo_super_atacado_prc,
          registro.desconto_maximo_super_atacado_vlr,
          registro.desconto_maximo_varejo_prc,
          registro.desconto_maximo_varejo_vlr,
          registro.id,
          registro.id_empresa,
          registro.id_erp,
          registro.id_produto,
          registro.pcompra,
          registro.pcusto,
          registro.pfornecedor,
          registro.pvenda_atacado,
          registro.pvenda_super_atacado,
          registro.pvenda_varejo,
          registro.quantidade_minima_atacado,
          registro.quantidade_minima_super_atacado,
          registro.saldo_total,
        ],
      ]);
    });

    return this.dados.sqlBatch(sqlStatements);
  }

  public salvarVenda(venda: OperacaoSaida): Promise<any> {
    const sqlStatements: any[] = [];

    let comando = '';
    if (venda.id > 0) {
      comando =
        'update operacao_saida set data = ?, id_cliente = ?, id_forma_pagamento = ?, id_tipo_operacao = ?, json = ? where id = ' +
        venda.id;
    } else {
      comando =
        'insert into operacao_saida (data, id_cliente, id_forma_pagamento, id_tipo_operacao, json) values (?, ?, ?, ?, ?)';
    }

    sqlStatements.push([
      comando,
      [
        venda.data,
        venda.id_cliente,
        venda.id_forma_pagamento,
        venda.id_tipo_operacao,
        venda.json,
      ],
    ]);

    return this.dados.sqlBatch(sqlStatements);
  }

  public salvarBalanco(balanco: OperacaoBalanco): Promise<any> {
    const sqlStatements: any[] = [];

    let comando = '';
    if (balanco.id > 0) {
      comando =
        'update produto set data = ?, json = ? where id = ' + balanco.id;
    } else {
      comando = 'insert into produto (data, json) values (?, ?)';
    }

    sqlStatements.push([comando, [balanco.data, balanco.json]]);

    return this.dados.sqlBatch(sqlStatements);
  }

  public salvarProduto(produto: Produto): Promise<any> {
    const sqlStatements: any[] = [];

    let comando = '';
    if (produto.id > 0) {
      comando = 'update produto set data = ? where id = ' + produto.id;
    } else {
      comando = 'insert into produto (data) values (?, ?)';
    }

    sqlStatements.push([comando, [produto.data]]);

    return this.dados.sqlBatch(sqlStatements);
  }

  public excluirVenda(id: number): Promise<any> {
    const sqlStatements: any[] = [];
    const comando = 'delete from operacao_saida where id = ?';
    sqlStatements.push([comando, [id]]);
    return this.dados.sqlBatch(sqlStatements);
  }

  public excluirBalanco(id: number): Promise<any> {
    const sqlStatements: any[] = [];
    const comando = 'delete from operacao_balanco where id = ?';
    sqlStatements.push([comando, [id]]);
    return this.dados.sqlBatch(sqlStatements);
  }

  public atualizarIdNuvemVenda(
    id_venda: number,
    id_nuvem: number,
    sincronizado_em: string
  ): Promise<any> {
    const sqlStatements: any[] = [];
    sqlStatements.push([
      'update operacao_saida set id_nuvem = ?, sincronizado_em = ? where id = ?',
      [id_nuvem, sincronizado_em, id_venda],
    ]);

    return this.dados.sqlBatch(sqlStatements);
  }

  public atualizarIdNuvemBalanco(
    id_balanco: number,
    id_nuvem: number,
    sincronizado_em: string
  ): Promise<any> {
    const sqlStatements: any[] = [];
    sqlStatements.push([
      'update operacao_balanco set id_nuvem = ?, sincronizado_em = ? where id = ?',
      [id_nuvem, sincronizado_em, id_balanco],
    ]);

    return this.dados.sqlBatch(sqlStatements);
  }

  public setEmpresas(registros: Empresa[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into empresa (id, desconto_porcentagem_maximo_permitido, bloquear_acesso_aos_custos_produto, dias_tolerancia_cobrar_juros, juros_mensal_contas_a_receber_em_atraso, multa_contas_a_receber_em_atraso, bloquear_pedidos_a_prazo_cliente_limite_excedido, mensagem_bloqueio_venda_limite_credito, consultar_apenas_produto_saldo_maior_zero, confirmar_alteracao_preco_tela_vendas_ao_alterar_forma_pagamento, exibir_preco_atacado_consulta_produto) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          registro.id,
          registro.desconto_porcentagem_maximo_permitido,
          registro.bloquear_acesso_aos_custos_produto,
          registro.dias_tolerancia_cobrar_juros,
          registro.juros_mensal_contas_a_receber_em_atraso,
          registro.multa_contas_a_receber_em_atraso,
          registro.bloquear_pedidos_a_prazo_cliente_limite_excedido,
          registro.mensagem_bloqueio_venda_limite_credito,
          registro.consultar_apenas_produto_saldo_maior_zero,
          registro.confirmar_alteracao_preco_tela_vendas_ao_alterar_forma_pagamento,
          registro.exibir_preco_atacado_consulta_produto,
        ],
      ]);
    });

    return this.dados.sqlBatch(sqlStatements);
  }

  public setUsuarios(registros: Usuario[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into usuario (id, desconto_porcentagem_maximo_permitido, bloquear_acesso_aos_custos_produto ,id_colaborador) values (?, ?, ?, ?)',
        [
          registro.id,
          registro.desconto_porcentagem_maximo_permitido,
          registro.id_colaborador,
          registro.bloquear_acesso_aos_custos_produto,
        ],
      ]);
    });

    return this.dados.sqlBatch(sqlStatements);
  }

  private getConfigDb() {
    return {
      name: 'testeNossoERP2.db',
      location: 'default',
    };
  }

  /**
   * Criando as tabelas no banco de dados
   */
  private createTables() {
    // Criando as tabelas
    this.dados
      .sqlBatch([
        [
          //municipio
          'CREATE TABLE IF NOT EXISTS municipio ([id] [INTEGER] primary key NOT NULL, [descricao] [nvarchar](60) NOT NULL,	[codigo] [nvarchar](7) NOT NULL,	[id_uf] [INTEGER] NOT NULL,	[zona_franca] [bit] NOT NULL,	[percentual] [float] NOT NULL,	[dias_feriados_municipais] [INTEGER] NOT NULL)',
        ],
        [
          //produto
          'CREATE TABLE IF NOT EXISTS produto ([id] [INTEGER] primary key NOT NULL,	[descricao] [nvarchar](120) NULL,	[id_erp] [INTEGER] NOT NULL,	[id_produto_sub_grupo] [INTEGER] NOT NULL,	[id_produto_fabricante] [INTEGER] NOT NULL,	[gtin] [nvarchar](14) NULL,	[unidade] [nvarchar](6) NOT NULL,	[ativo] [bit] NOT NULL,	[referencia] [nvarchar](20) NULL,	[codigo_original] [nvarchar](25) NULL,	[aplicacao] [nvarchar](250) NULL,	[tipo_alteracao_preco] [INTEGER] NOT NULL,	[movimenta_fracionado] [bit] NOT NULL,	[nao_calcula_saldo_flex] [bit] NOT NULL)',
        ],
        [
          //produto_empresa
          'CREATE TABLE IF NOT EXISTS produto_empresa ([id] [INTEGER] primary key NOT NULL,	[id_erp] [INTEGER] NOT NULL,	[id_produto] [INTEGER] NOT NULL,	[id_empresa] [INTEGER] NOT NULL,	[pcusto] [float] NOT NULL,	[pvenda_varejo] [float] NOT NULL,	[pvenda_atacado] [float] NOT NULL,	[pvenda_super_atacado] [float] NOT NULL,	[saldo_total] [float] NOT NULL,	[ativo] [bit] NOT NULL,	[desconto_maximo_atacado_prc] [float] NOT NULL,	[desconto_maximo_atacado_vlr] [float] NOT NULL,	[desconto_maximo_super_atacado_prc] [float] NOT NULL,	[desconto_maximo_super_atacado_vlr] [float] NOT NULL,	[desconto_maximo_varejo_prc] [float] NOT NULL,	[desconto_maximo_varejo_vlr] [float] NOT NULL,	[quantidade_minima_atacado] [float] NOT NULL,	[quantidade_minima_super_atacado] [float] NOT NULL,	[pcompra] [float] NOT NULL,	[pfornecedor] [float] NOT NULL)',
        ],
        [
          //produto_fabricante
          'CREATE TABLE IF NOT EXISTS produto_fabricante ([id] [INTEGER] primary key NOT NULL, [descricao] [nvarchar](100) NULL,	[id_erp] [INTEGER] NOT NULL)',
        ],
        [
          //produto_grupo
          'CREATE TABLE IF NOT EXISTS produto_grupo ([id] [INTEGER] primary key NOT NULL,	[descricao] [nvarchar](100) NULL,	[id_erp] [INTEGER] NOT NULL)',
        ],
        [
          //produto_sub_grupo
          'CREATE TABLE IF NOT EXISTS produto_sub_grupo ([id] [INTEGER] [INTEGER] primary key NOT NULL,	[descricao] [nvarchar](100) NULL,	[id_erp] [INTEGER] NOT NULL,	[id_produto_grupo] [INTEGER] NOT NULL)',
        ],
        [
          //estoque_locais
          'CREATE TABLE IF NOT EXISTS estoque_locais ([id] [INTEGER] primary key NOT NULL,	[id_erp] [INTEGER] NOT NULL,	[id_empresa] [INTEGER] NOT NULL,	[descricao] [nvarchar](100) NOT NULL)',
        ],
        [
          //uf
          'CREATE TABLE IF NOT EXISTS uf ([id] [INTEGER] primary key NOT NULL,	[descricao] [nvarchar](60) NOT NULL,	[sigla] [nvarchar](3) NOT NULL,	[codigo] [nvarchar](5) NOT NULL,	[id_pais] [INTEGER] NOT NULL,	[aliquota_icms_interna] [float] NOT NULL,	[aliquota_fcp_interna] [float] NOT NULL,	[dias_feriados_estaduais] [INTEGER] NOT NULL)',
        ],
        [
          //operacao saida
          'CREATE TABLE IF NOT EXISTS operacao_saida ([id] [INTEGER] primary key AUTOINCREMENT, [data] [INTEGER] NOT NULL,	[json] [text] NOT NULL, [id_cliente] [INTEGER], [id_tipo_operacao] [INTEGER], [id_forma_pagamento] [INTEGER], [id_nuvem] [INTEGER], [sincronizado_em] [text])',
        ],
        [
          //operacao balanco
          'CREATE TABLE IF NOT EXISTS operacao_balanco ([id] [INTEGER] primary key AUTOINCREMENT, [data] [INTEGER] NOT NULL,	[json] [text] NOT NULL, [id_nuvem] [INTEGER], [estoque_locais] [INTEGER], [sincronizado_em] [text])',
        ],
        [
          //empresa
          'CREATE TABLE IF NOT EXISTS empresa ([id] [INTEGER] primary key, [desconto_porcentagem_maximo_permitido] [INTEGER] NOT NULL, [bloquear_acesso_aos_custos_produto] [bit], [dias_tolerancia_cobrar_juros] [INTEGER], [juros_mensal_contas_a_receber_em_atraso] [float], [multa_contas_a_receber_em_atraso] [float])',
        ],
        [
          //usuario
          'CREATE TABLE IF NOT EXISTS usuario ([id] [INTEGER] primary key, [desconto_porcentagem_maximo_permitido] [float] NOT NULL, [bloquear_acesso_aos_custos_produto] [bit], [id_colaborador] [INTEGER] NOT NULL)',
        ],
        [
          //versao do banco para controlar o scripts de atualização
          'CREATE TABLE IF NOT EXISTS versao_banco ([id] [INTEGER] primary key AUTOINCREMENT, [numero_versao] [INTEGER] NOT NULL)',
        ],
      ])
      .then(async () => {
        console.log('Tabelas criadas, consultando atualizações');

        const atualizacoes: AtualizacoesModel[] = [];
        atualizacoes.push(
          {
            numero_versao: 1,
            scripts: [
              'ALTER TABLE cliente ADD COLUMN [limite_credito_disponivel] [float] NOT NULL default 0',
              'ALTER TABLE cliente ADD COLUMN [limite_credito] [float] NOT NULL default 0',
              'ALTER TABLE empresa ADD COLUMN [bloquear_pedidos_a_prazo_cliente_limite_excedido] [bit] NOT NULL default 0',
              'ALTER TABLE empresa ADD COLUMN [consultar_apenas_produto_saldo_maior_zero] [bit] NOT NULL default 0',
              'ALTER TABLE empresa ADD COLUMN [mensagem_bloqueio_venda_limite_credito] [nvarchar](500)',
            ],
          },
          {
            numero_versao: 2,
            scripts: [
              'ALTER TABLE empresa ADD COLUMN [confirmar_alteracao_preco_tela_vendas_ao_alterar_forma_pagamento] [bit] NOT NULL default 0',
            ],
          },
          {
            numero_versao: 3,
            scripts: [
              'ALTER TABLE cliente ADD COLUMN [indicador_ie] [INTEGER] NOT NULL default 9',
              'ALTER TABLE cliente ADD COLUMN [inscricao_estadual] [nvarchar](500)',
            ],
          },
          {
            numero_versao: 4,
            scripts: [
              'ALTER TABLE empresa ADD COLUMN [exibir_preco_atacado_consulta_produto] [bit] NOT NULL default 0',
            ],
          },
          {
            numero_versao: 5,
            scripts: [
              'ALTER TABLE cliente_contas_receber ADD COLUMN [data_operacao_long] [INTEGER] NULL',
              'ALTER TABLE cliente_contas_receber ADD COLUMN [valor_operacao] [float] NULL',
              'ALTER TABLE cliente ADD COLUMN [status] [INTEGER] NULL',
            ],
          }
        );

        let versaoAtual = await this.getNumeroVersaoBanco();

        if (!versaoAtual) {
          versaoAtual = 0;
        }

        const atualizacoesExecutar = atualizacoes.filter(
          (c) => c.numero_versao > versaoAtual
        );

        if (atualizacoesExecutar.length > 0) {
          const scripts = [];
          atualizacoesExecutar.forEach((versao) => {
            versao.scripts.forEach((script) => {
              scripts.push([script]);
            });
          });
          this.dados
            .sqlBatch(scripts)
            .then(() => {
              this.setAtualizacao(atualizacoesExecutar)
                .then(() => {
                  console.log('Atualizações realizada com sucesso!');
                })
                .catch((e) => {
                  Util.logarErro(e);
                  Util.Notificacao('Executar registrar numero versao', 'error');
                });
            })
            .catch((e) => {
              Util.logarErro(e);
              Util.Notificacao('Executar atualizações', 'error');
            });
        }
      })
      .catch((e) => {
        Util.logarErro(e);
        Util.Notificacao('Erro ao criar tabelas', 'error');
      });
  }
}

export class AtualizacoesModel {
  numero_versao: number;
  scripts: string[];
}
