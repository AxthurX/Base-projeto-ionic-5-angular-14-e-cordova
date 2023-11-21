import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Produto } from '../model/data-base/produto.model';
import { Usuario } from '../model/data-base/usuario.model';
import { ViewProduto } from '../model/data-base/view-produto.model';
import { OperacaoSaidaUtil } from '../model/operacao-saida-util.model';
import { OperacaoSaida } from '../model/operacao-saida.model';
import { Util } from '../util.model';
import { AuthService } from './auth.service';
import { EstoqueLocais } from '../model/data-base/estoque-locais.model';
import { Balanco } from '../model/data-base/balanco.model';
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

  public getProdutos(filtro_pesquisa: string, pesquisa: string) {
    const retorno: ViewProduto[] = [];
    if (!pesquisa) {
      pesquisa = '';
    }
    const id: number = +pesquisa.trim();
    let sql = 'select * from produto';

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
            const newItem = new ViewProduto();
            newItem.descricao = registro.descricao;
            newItem.id = +registro.id;
            newItem.unidade = registro.unidade;
            newItem.codigo_original = registro.codigo_original;
            newItem.gtin = registro.gtin;

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

  public setProdutos(registros: Produto[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into produto (id, data, descricao, gtin, codigo_original, ativo, nome, data_fabricacao, data_vencimento, quantidade, valor_unitario, valor_total, produto_perecivel) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          registro.id,
          registro.data,
          registro.descricao,
          registro.gtin,
          registro.codigo_original,
          registro.ativo,
          registro.nome,
          registro.data_fabricacao,
          registro.data_vencimento,
          registro.quantidade,
          registro.valor_unitario,
          registro.valor_total,
          registro.produto_perecivel,
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

  public setUsuarios(registros: Usuario[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into usuario (id, desconto_porcentagem_maximo_permitido, id_colaborador, bloquear_acesso_aos_custos_produto) values (?, ?, ?, ?)',
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
          //produto
          'CREATE TABLE IF NOT EXISTS produto ([id] [INTEGER] primary key NOT NULL, [data] [INTEGER] NULL, [descricao] [nvarchar](120) NULL, [gtin] [nvarchar](14) NULL, [codigo_original] [nvarchar](25) NULL, [ativo] [bit] NOT NULL, [nome] [text] NOT NULL, [data_fabricacao] [INTEGER] NOT NULL, [data_vencimento] [INTEGER] NOT NULL, [quantidade] [INTEGER] NOT NULL, [valor_unitario] [INTEGER] NOT NULL, [valor_total] [INTEGER] NOT NULL, [produto_perecivel] [bit] NULL)',
        ],
        [
          //estoque_locais
          'CREATE TABLE IF NOT EXISTS estoque_locais ([id] [INTEGER] primary key NOT NULL,	[descricao] [nvarchar](100) NOT NULL)',
        ],
        [
          //operacao saida
          'CREATE TABLE IF NOT EXISTS operacao_saida ([id] [INTEGER] primary key AUTOINCREMENT, [data] [INTEGER] NOT NULL,	[json] [text] NOT NULL, [id_cliente] [INTEGER], [sincronizado_em] [text])',
        ],
        [
          //balanco
          'CREATE TABLE IF NOT EXISTS operacao_balanco ([id] [INTEGER] primary key AUTOINCREMENT, [data] [INTEGER] NOT NULL,	[json] [text] NOT NULL, [estoque_locais] [INTEGER], [sincronizado_em] [text])',
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
        atualizacoes.push({
          numero_versao: 1,
          scripts: [],
        });

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
