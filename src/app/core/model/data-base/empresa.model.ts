export class Empresa {
  id: number;
  desconto_porcentagem_maximo_permitido: number;
  dias_tolerancia_cobrar_juros?: number;
  juros_mensal_contas_a_receber_em_atraso?: number;
  multa_contas_a_receber_em_atraso?: number;
  bloquear_pedidos_a_prazo_cliente_limite_excedido: boolean;
  consultar_apenas_produto_saldo_maior_zero: boolean;
  confirmar_alteracao_preco_tela_vendas_ao_alterar_forma_pagamento: boolean;
  exibir_preco_atacado_consulta_produto: boolean;
  mensagem_bloqueio_venda_limite_credito: string;
  bloquear_acesso_aos_custos_produto: boolean;
}
