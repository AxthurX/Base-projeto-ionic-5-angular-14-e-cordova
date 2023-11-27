export class Produto {
  id: number;
  data: number;
  detalhar: boolean;
  descricao: string;
  ativo: boolean;
  nome: string;
  data_fabricacao: string;
  data_vencimento: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  produto_perecivel: boolean;
  quantidade_original?: number;
  quantidade_cadastrada?: number;
  valor_total_original?: number;
  valor_total_cadastrado?: number;
  valor_unitario_original?: number;
}
