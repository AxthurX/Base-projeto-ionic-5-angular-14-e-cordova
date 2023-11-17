export class ViewCliente {
  id: number;
  razao: string;
  cep: string;
  fantasia: string;
  cpf_cnpj: string;
  logradouro: string;
  numero: string;
  telefone_principal: string;
  telefone_whatsapp: string;
  complemento: string;
  bairro: string;
  municipio: string;
  codigo_municipio: string;
  sigla_uf: string;
  atividade: string;
  limite_credito_disponivel: number;
  limite_credito: number;
  status?: number;
  inscricao_estadual?: number;
  indicador_ie?: number;
}
