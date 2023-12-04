import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Produto } from '../model/data-base/produto.model';
import { ViewProduto } from '../model/data-base/view-produto.model';
import { OperacaoSaidaUtil } from '../model/operacao-saida-util.model';
import { OperacaoSaida } from '../model/operacao-saida.model';
import { Util } from '../util.model';

@Injectable({
  providedIn: 'root',
})
export class DataBaseProvider {
  dados: SQLiteObject;
  constructor(private sqlite: SQLite) {}

  public dropDB() {
    return this.sqlite.deleteDatabase(this.getConfigDb());
  }

  public createDatabase() {
    return this.sqlite
      .create(this.getConfigDb())
      .then((db: SQLiteObject) => {
        this.dados = db;
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

    if (pesquisa.startsWith('id in')) {
      sql += ` where ${pesquisa}`;
    } else if (filtro_pesquisa === 'geral') {
      if (id > 0) {
        sql += ` where id = ${id}`;
      } else {
        pesquisa = pesquisa.toUpperCase();
        sql += ` where descricao like '%${pesquisa}%'`;
      }
    } else if (filtro_pesquisa === 'id') {
      if (id > 0) {
        sql += ' where id = ' + id;
      } else {
        return Promise.resolve(retorno);
      }
    } else if (filtro_pesquisa === 'ids_produtos') {
      sql += ` where id in (${pesquisa})`;
    }

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new ViewProduto();
            newItem.id = +registro.id;
            newItem.data = registro.data;
            newItem.descricao = registro.descricao;
            newItem.ativo = registro.ativo;
            newItem.nome = registro.nome;
            newItem.data_fabricacao = registro.data_fabricacao;
            newItem.data_vencimento = registro.data_vencimento;
            newItem.quantidade = registro.quantidade;
            newItem.valor_unitario = registro.valor_unitario;
            newItem.valor_total = registro.valor_total;
            newItem.imagem = registro.imagem;
            newItem.descricao = registro.descricao;
            newItem.quantidade_original = registro.quantidade_original;
            newItem.valor_total_original = registro.valor_total_original;
            newItem.valor_unitario_original = registro.valor_unitario_original;
            newItem.quantidade_cadastrada = registro.quantidade_cadastrada;
            newItem.valor_total_cadastrado = registro.valor_total_cadastrado;

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

  public getProduto(id: number) {
    const sql = 'select * from produto where id = ' + id;

    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new ViewProduto();
            newItem.id = +registro.id;
            newItem.data = registro.data;
            newItem.descricao = registro.descricao;
            newItem.ativo = registro.ativo;
            newItem.nome = registro.nome;
            newItem.data_fabricacao = registro.data_fabricacao;
            newItem.data_vencimento = registro.data_vencimento;
            newItem.quantidade = registro.quantidade;
            newItem.valor_unitario = registro.valor_unitario;
            newItem.valor_total = registro.valor_total;
            newItem.imagem = registro.imagem;
            newItem.descricao = registro.descricao;
            newItem.quantidade_original = registro.quantidade_original;
            newItem.valor_total_original = registro.valor_total_original;
            newItem.valor_unitario_original = registro.valor_unitario_original;
            newItem.quantidade_cadastrada = registro.quantidade_cadastrada;
            newItem.valor_total_cadastrado = registro.valor_total_cadastrado;

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

  public getVendas() {
    const retorno: OperacaoSaida[] = [];
    let sql = `select * from operacao_saida`;
    sql += ` order by data desc`;
    return this.dados
      .executeSql(sql, [])
      .then((data: any) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const registro = data.rows.item(i);
            const newItem = new OperacaoSaida();
            newItem.id = +registro.id;
            newItem.data = +registro.data;
            newItem.json = registro.json;

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

  public setProdutos(registros: Produto[]): Promise<any> {
    const sqlStatements: any[] = [];

    registros.forEach((registro) => {
      sqlStatements.push([
        'insert into produto (id, data, descricao, ativo, nome, data_fabricacao, data_vencimento, quantidade, valor_unitario, valor_total, produto_perecivel, quantidade_original, valor_total_original, valor_unitario_original, quantidade_cadastrada, valor_total_cadastrado) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          registro.id,
          registro.data,
          registro.descricao,
          registro.ativo,
          registro.nome,
          registro.data_fabricacao,
          registro.data_vencimento,
          registro.quantidade,
          registro.valor_unitario,
          registro.valor_total,
          registro.produto_perecivel,
          registro.quantidade_original,
          registro.valor_total_original,
          registro.valor_unitario_original,
          registro.quantidade_cadastrada,
          registro.valor_total_cadastrado,
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
        'update operacao_saida set data = ?, json = ? where id = ' + venda.id;
    } else {
      comando = 'insert into operacao_saida (data, json) values (?, ?)';
    }

    sqlStatements.push([comando, [venda.data, venda.json]]);

    return this.dados.sqlBatch(sqlStatements);
  }

  public salvarProduto(produto: ViewProduto): Promise<any> {
    const sqlStatements: any[] = [];

    let comando = '';
    if (produto.id > 0) {
      comando =
        'update produto set data = ?, quantidade_original = ?, valor_total_original = ? where id = ' +
        produto.id;
    } else {
      comando =
        'insert into produto (data, quantidade_original, valor_total_original) values (?, ?, ?)';
    }

    sqlStatements.push([
      comando,
      [produto.data, produto.quantidade_original, produto.valor_total_original],
    ]);

    return this.dados.sqlBatch(sqlStatements);
  }

  public excluirVenda(id: number): Promise<any> {
    const sqlStatements: any[] = [];
    const comando = 'delete from operacao_saida where id = ?';
    sqlStatements.push([comando, [id]]);
    return this.dados.sqlBatch(sqlStatements);
  }

  private getConfigDb() {
    return {
      name: 'computaria.db',
      location: 'default',
    };
  }

  private createTables() {
    this.dados
      .sqlBatch([
        [
          //produto
          'CREATE TABLE IF NOT EXISTS produto ([id] [INTEGER] primary key NOT NULL, [data] [INTEGER] NULL, [descricao] [nvarchar](120) NULL, [ativo] [bit] NOT NULL, [nome] [text] NOT NULL, [data_fabricacao] [INTEGER] NOT NULL, [data_vencimento] [INTEGER] NOT NULL, [quantidade] [INTEGER] NOT NULL, [valor_unitario] [INTEGER] NOT NULL, [valor_total] [INTEGER] NOT NULL, [produto_perecivel] [bit] NULL, [quantidade_original] [INTEGER] [NULL], [valor_total_original] [INTEGER] [NULL], [valor_unitario_original] [INTEGER] [NULL], [quantidade_cadastrada] [INTEGER] [NULL], [valor_total_cadastrado] [INTEGER] [NULL])',
        ],
        [
          //operacao saida
          'CREATE TABLE IF NOT EXISTS operacao_saida ([id] [INTEGER] primary key AUTOINCREMENT, [data] [INTEGER] NOT NULL, [json] [text] NOT NULL)',
        ],
        [
          //versao do banco para controlar o scripts de atualização
          'CREATE TABLE IF NOT EXISTS versao_banco ([id] [INTEGER] primary key AUTOINCREMENT, [numero_versao] [INTEGER] NOT NULL)',
        ],
      ])
      .then(async () => {
        console.log('Tabelas criadas');
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
