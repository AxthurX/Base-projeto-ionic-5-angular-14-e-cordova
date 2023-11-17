import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Empresa } from '../model/data-base/empresa.model';
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
  teste: ViewProdutoEmpresa[] = [
    {
      mostrar_foto: false,
      imagem: 'assets/icon/favicon.png',
      total_liquido: 0,
      total_bruto: 0,
      valor_unitario: 15,
      quantidade: 0,
      descricao: ' ADAPTADOR SOQUETE 14"X1/2"-2" - WORKER',
      id: 698868,
      id_produto: 841572,
      pcusto: 0,
      pvenda_atacado: 0,
      pcompra: 5.15,
      saldo_total: 1,
      unidade: 'UN ',
      codigo_original: null,
      referencia: null,
      gtin: '7899811603363 ',
      sub_grupo: 'IMPORTACAO DE DADOS',
      grupo: 'IMPORTACAO DE DADOS',
      fabricante: 'IMPORTACAO DE DADOS',
      valor_unitario_original: 15,
      observacao: null,
    },
    {
      mostrar_foto: false,
      imagem: 'assets/icon/favicon.png',
      total_liquido: 0,
      total_bruto: 0,
      valor_unitario: 7.35,
      quantidade: 0,
      descricao: ' BARRA ROSCADA UNC ZB 1/4" 1M - CISER',
      id: 699033,
      id_produto: 841573,
      pcusto: 0,
      pvenda_atacado: 0,
      pcompra: 3.82,
      saldo_total: 1,
      unidade: 'UN ',
      codigo_original: null,
      referencia: null,
      gtin: '00000051017194',
      sub_grupo: 'IMPORTACAO DE DADOS',
      grupo: 'IMPORTACAO DE DADOS',
      fabricante: 'IMPORTACAO DE DADOS',
      valor_unitario_original: 7.35,
      observacao: null,
    },
    {
      mostrar_foto: false,
      imagem: 'assets/icon/favicon.png',
      total_liquido: 0,
      total_bruto: 0,
      valor_unitario: 13.5,
      quantidade: 0,
      descricao: ' BITS 7 PCS C/ ADAP MAG + POZIDRIV',
      id: 698597,
      id_produto: 841035,
      pcusto: 0,
      pvenda_atacado: 0,
      pcompra: 4.2,
      saldo_total: 4,
      unidade: 'UN ',
      codigo_original: null,
      referencia: null,
      gtin: '7899095459069 ',
      sub_grupo: 'IMPORTACAO DE DADOS',
      grupo: 'IMPORTACAO DE DADOS',
      fabricante: 'IMPORTACAO DE DADOS',
      valor_unitario_original: 13.5,
      observacao: null,
    },
    {
      mostrar_foto: false,
      imagem: 'assets/icon/favicon.png',
      total_liquido: 0,
      total_bruto: 0,
      valor_unitario: 15,
      quantidade: 0,
      descricao: ' BITS PHILLIPS 05 PCS CRV - 50 MM',
      id: 698545,
      id_produto: 841022,
      pcusto: 0,
      pvenda_atacado: 0,
      pcompra: 3.36,
      saldo_total: 0,
      unidade: 'UN ',
      codigo_original: null,
      referencia: null,
      gtin: '7899095409606 ',
      sub_grupo: 'IMPORTACAO DE DADOS',
      grupo: 'IMPORTACAO DE DADOS',
      fabricante: 'IMPORTACAO DE DADOS',
      valor_unitario_original: 15,
      observacao: null,
    },
    {
      mostrar_foto: false,
      imagem: 'assets/icon/favicon.png',
      total_liquido: 0,
      total_bruto: 0,
      valor_unitario: 11.3,
      quantidade: 0,
      descricao: ' CABO FLEXSIL 750 V 10,00 PRETO',
      id: 700391,
      id_produto: 842614,
      pcusto: 0,
      pvenda_atacado: 0,
      pcompra: 5.5,
      saldo_total: 306.5,
      unidade: 'M  ',
      codigo_original: null,
      referencia: null,
      gtin: '7897381636248 ',
      sub_grupo: 'IMPORTACAO DE DADOS',
      grupo: 'IMPORTACAO DE DADOS',
      fabricante: 'IMPORTACAO DE DADOS',
      valor_unitario_original: 11.3,
      observacao: null,
    },
    {
      mostrar_foto: false,
      imagem: 'assets/icon/favicon.png',
      total_liquido: 0,
      total_bruto: 0,
      valor_unitario: 178.4,
      quantidade: 0,
      descricao:
        ' DUCHA HIG.2010 C 31  STANDER VEDANTE GATILHO METAL "SACOLINHA"',
      id: 698184,
      id_produto: 840077,
      pcusto: 0,
      pvenda_atacado: 0,
      pcompra: 80.2,
      saldo_total: 3,
      unidade: 'UN ',
      codigo_original: null,
      referencia: null,
      gtin: '7898532095587 ',
      sub_grupo: 'IMPORTACAO DE DADOS',
      grupo: 'IMPORTACAO DE DADOS',
      fabricante: 'IMPORTACAO DE DADOS',
      valor_unitario_original: 178.4,
      observacao: null,
    },
    {
      mostrar_foto: false,
      imagem: 'assets/icon/favicon.png',
      total_liquido: 0,
      total_bruto: 0,
      valor_unitario: 0.69,
      quantidade: 0,
      descricao: ' FIO NYLON 1,8MM 5,0KG',
      id: 698983,
      id_produto: 841298,
      pcusto: 0,
      pvenda_atacado: 0,
      pcompra: 0.28,
      saldo_total: 813.02,
      unidade: 'M  ',
      codigo_original: null,
      referencia: null,
      gtin: '7891117058304 ',
      sub_grupo: 'IMPORTACAO DE DADOS',
      grupo: 'IMPORTACAO DE DADOS',
      fabricante: 'IMPORTACAO DE DADOS',
      valor_unitario_original: 0.69,
      observacao: null,
    },
  ];
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
      'select produto_empresa.id, produto_empresa.id, produto_empresa.id_produto, produto.id, id_produto_grupo, produto_grupo.id, id_produto_sub_grupo, produto_sub_grupo.id, id_produto_fabricante, produto_fabricante.id, produto.descricao, produto.referencia, produto.aplicacao, produto.ativo ativo_produto, produto_empresa.ativo ativo_produto_empresa, produto.codigo_original, produto.gtin, produto.movimenta_fracionado, produto.nao_calcula_saldo_flex, produto.tipo_alteracao_preco, produto.unidade, produto_empresa.pcusto, produto_empresa.pvenda_atacado, produto_empresa.pvenda_super_atacado, produto_empresa.pvenda_varejo, produto_empresa.saldo_total, produto_empresa.id_empresa, produto_sub_grupo.descricao sub_grupo, produto_grupo.descricao grupo, produto_fabricante.descricao fabricante, produto_empresa.desconto_maximo_varejo_prc, produto_empresa.desconto_maximo_atacado_prc, produto_empresa.desconto_maximo_super_atacado_prc, produto_empresa.quantidade_minima_atacado, produto_empresa.quantidade_minima_super_atacado, produto_empresa.desconto_maximo_varejo_vlr, produto_empresa.desconto_maximo_atacado_vlr, produto_empresa.desconto_maximo_super_atacado_vlr, produto_empresa.pcompra, produto_empresa.pfornecedor from produto_empresa join produto on produto.id = produto_empresa.id_produto join produto_sub_grupo on produto_sub_grupo.id = produto.id_produto_sub_grupo join produto_grupo on produto_grupo.id = produto_sub_grupo.id_produto_grupo join produto_fabricante on produto_fabricante.id = produto.id_produto_fabricante';

    //gambis, passando direto os ids dos produtos na consulta
    if (pesquisa.startsWith('produto.id in')) {
      sql += ` where ${pesquisa}`;
    } else if (filtro_pesquisa === 'geral') {
      if (id > 0) {
        sql += ` where produto.id = ${id} or produto.gtin like '${pesquisa}'`;
      } else {
        pesquisa = pesquisa.toUpperCase();
        sql += ` where produto.descricao like '%${pesquisa}%' or produto.gtin like '%${pesquisa}%' or produto.referencia like '%${pesquisa}%' or produto.aplicacao like '%${pesquisa}%' or codigo_original like '%${pesquisa}%' or produto_sub_grupo.descricao like '%${pesquisa}%' or produto_grupo.descricao like '%${pesquisa}%'  or produto_fabricante.descricao like '%${pesquisa}%'`;
      }
    } else if (filtro_pesquisa === 'id') {
      if (id > 0) {
        sql += ' where produto.id = ' + id;
      } else {
        //forço um retorno vazio caso n seja um id valido
        return Promise.resolve(retorno);
      }
    } else if (filtro_pesquisa === 'gtin') {
      sql += ` where TRIM(produto.gtin) like '${pesquisa}'`;
    } else if (filtro_pesquisa === 'ids_produtos') {
      sql += ` where produto.id in (${pesquisa})`;
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
            newItem.id = +registro.id;
            newItem.id_produto = +registro.id_produto;
            newItem.pcusto = registro.pcusto;
            newItem.pvenda_atacado = registro.pvenda_atacado;
            newItem.pcompra = registro.pcompra;
            newItem.saldo_total = registro.saldo_total;
            newItem.unidade = registro.unidade;
            newItem.codigo_original = registro.codigo_original;
            newItem.referencia = registro.referencia;
            newItem.gtin = registro.gtin;
            newItem.sub_grupo = registro.sub_grupo;
            newItem.grupo = registro.grupo;
            newItem.fabricante = registro.fabricante;

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
    const sql = 'select id, descricao from estoque_locais';

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new EstoqueLocais();
            newItem.id = +registro.id;
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

  public getVendas(limit: number, offset: number) {
    const retorno: OperacaoSaida[] = [];
    let sql = `select * from operacao_saida`;
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
            newItem.json = registro.json;
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
            retorno.consultar_apenas_produto_saldo_maior_zero = Util.AnyToBool(
              registro.consultar_apenas_produto_saldo_maior_zero
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

  public async getProdutosComPrecoJaCalculado(
    filtro_pesquisa: string,
    texto_pesquisado: string
  ) {
    try {
      const itensTabelaPreco = null; // await this.getItensTabelaPreco(
      // );

      const registros = await this.getProdutosEmpresa(
        filtro_pesquisa,
        texto_pesquisado
      );

      registros.forEach((r) => {
        r.quantidade = 0;
        let valor_tabela = null;

        const tabelaPreco = itensTabelaPreco.find(
          (c) => c.id_produto_empresa === r.id
        );
        if (tabelaPreco) {
          valor_tabela = tabelaPreco.valor;
        }

        ProdutoUtil.CalcularPrecoETotalBruto(r, null);
      });

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
        'insert into balanco (id, id_colaborador, id_local_estoque, data, data_sincronizacao, observacao) values (?, ?, ?, ?, ?, ?)',
        [
          registro.id,
          registro.id_colaborador,
          registro.id_local_estoque,
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
        'insert into balanco_item (id, id_balanco, saldo_novo, observacao) values (?, ?, ?, ?)',
        [
          registro.id,
          registro.id_balanco,
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
        'insert into produto (id, descricao, gtin, unidade, ativo, referencia, codigo_original, aplicacao, tipo_alteracao_preco, movimenta_fracionado, nao_calcula_saldo_flex) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          registro.id,
          registro.descricao,
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
        'insert into estoque_locais (id, descricao) values (?, ?)',
        [registro.id, registro.descricao],
      ]);
    });

    return this.dados.sqlBatch(sqlStatements);
  }

  public setProdutosEmpresa(registros: ProdutoEmpresa[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into produto_empresa (ativo, id, id_empresa, id_produto, pcompra, pcusto, pvenda_atacado, pvenda_varejo, saldo_total) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          registro.ativo,
          registro.id,
          registro.id_empresa,
          registro.id_produto,
          registro.pcompra,
          registro.pcusto,
          registro.pvenda_atacado,
          registro.pvenda_varejo,
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
        'update operacao_saida set data = ?, id_cliente = ?, json = ? where id = ' +
        venda.id;
    } else {
      comando =
        'insert into operacao_saida (data, id_cliente, json) values (?, ?, ?)';
    }

    sqlStatements.push([comando, [venda.data, venda.id_cliente, venda.json]]);

    return this.dados.sqlBatch(sqlStatements);
  }

  public salvarVendaProduto(venda: OperacaoSaida): Promise<any> {
    const sqlStatements: any[] = [];

    let comando = '';
    if (venda.id > 0) {
      comando =
        'update operacao_saida set data = ?, json = ? where id = ' + venda.id;
    } else {
      comando = 'insert into operacao_saida (data, json) values (?, ?)';
    }

    sqlStatements.push([comando, [venda.data, venda.id_cliente, venda.json]]);

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

  public setEmpresas(registros: Empresa[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into empresa (id, desconto_porcentagem_maximo_permitido, bloquear_acesso_aos_custos_produto, multa_contas_a_receber_em_atraso, bloquear_pedidos_a_prazo_cliente_limite_excedido, mensagem_bloqueio_venda_limite_credito, consultar_apenas_produto_saldo_maior_zero, exibir_preco_atacado_consulta_produto) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          registro.id,
          registro.desconto_porcentagem_maximo_permitido,
          registro.consultar_apenas_produto_saldo_maior_zero,
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
      name: 'computaria.db',
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
          'CREATE TABLE IF NOT EXISTS produto ([id] [INTEGER] primary key NOT NULL,	[descricao] [nvarchar](120) NULL,	[id] [INTEGER] NOT NULL,	[id_produto_sub_grupo] [INTEGER] NOT NULL,	[id_produto_fabricante] [INTEGER] NOT NULL,	[gtin] [nvarchar](14) NULL,	[unidade] [nvarchar](6) NOT NULL,	[ativo] [bit] NOT NULL,	[referencia] [nvarchar](20) NULL,	[codigo_original] [nvarchar](25) NULL,	[aplicacao] [nvarchar](250) NULL,	[tipo_alteracao_preco] [INTEGER] NOT NULL,	[movimenta_fracionado] [bit] NOT NULL,	[nao_calcula_saldo_flex] [bit] NOT NULL)',
        ],
        [
          //produto_empresa
          'CREATE TABLE IF NOT EXISTS produto_empresa ([id] [INTEGER] primary key NOT NULL,	[id] [INTEGER] NOT NULL,	[id_produto] [INTEGER] NOT NULL,	[id_empresa] [INTEGER] NOT NULL,	[pcusto] [float] NOT NULL,	[pvenda_varejo] [float] NOT NULL,	[pvenda_atacado] [float] NOT NULL,	[pvenda_super_atacado] [float] NOT NULL,	[saldo_total] [float] NOT NULL,	[ativo] [bit] NOT NULL,	[desconto_maximo_atacado_prc] [float] NOT NULL,	[desconto_maximo_atacado_vlr] [float] NOT NULL,	[desconto_maximo_super_atacado_prc] [float] NOT NULL,	[desconto_maximo_super_atacado_vlr] [float] NOT NULL,	[desconto_maximo_varejo_prc] [float] NOT NULL,	[desconto_maximo_varejo_vlr] [float] NOT NULL,	[quantidade_minima_atacado] [float] NOT NULL,	[quantidade_minima_super_atacado] [float] NOT NULL,	[pcompra] [float] NOT NULL,	[pfornecedor] [float] NOT NULL)',
        ],
        [
          //produto_fabricante
          'CREATE TABLE IF NOT EXISTS produto_fabricante ([id] [INTEGER] primary key NOT NULL, [descricao] [nvarchar](100) NULL,	[id] [INTEGER] NOT NULL)',
        ],
        [
          //produto_grupo
          'CREATE TABLE IF NOT EXISTS produto_grupo ([id] [INTEGER] primary key NOT NULL,	[descricao] [nvarchar](100) NULL,	[id] [INTEGER] NOT NULL)',
        ],
        [
          //produto_sub_grupo
          'CREATE TABLE IF NOT EXISTS produto_sub_grupo ([id] [INTEGER] [INTEGER] primary key NOT NULL,	[descricao] [nvarchar](100) NULL,	[id] [INTEGER] NOT NULL,	[id_produto_grupo] [INTEGER] NOT NULL)',
        ],
        [
          //estoque_locais
          'CREATE TABLE IF NOT EXISTS estoque_locais ([id] [INTEGER] primary key NOT NULL,	[id] [INTEGER] NOT NULL,	[id_empresa] [INTEGER] NOT NULL,	[descricao] [nvarchar](100) NOT NULL)',
        ],
        [
          //operacao saida
          'CREATE TABLE IF NOT EXISTS operacao_saida ([id] [INTEGER] primary key AUTOINCREMENT, [data] [INTEGER] NOT NULL,	[json] [text] NOT NULL, [id_cliente] [INTEGER], [sincronizado_em] [text])',
        ],
        [
          //operacao balanco
          'CREATE TABLE IF NOT EXISTS operacao_balanco ([id] [INTEGER] primary key AUTOINCREMENT, [data] [INTEGER] NOT NULL,	[json] [text] NOT NULL, [estoque_locais] [INTEGER], [sincronizado_em] [text])',
        ],
        [
          //empresa
          'CREATE TABLE IF NOT EXISTS empresa ([id] [INTEGER] primary key, [desconto_porcentagem_maximo_permitido] [INTEGER] NOT NULL, [bloquear_acesso_aos_custos_produto] [bit], [multa_contas_a_receber_em_atraso] [float])',
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
