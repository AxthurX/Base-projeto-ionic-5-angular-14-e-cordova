export class RetornoAPIModel<TModel> {
  success: boolean;
  message: string;
  status_code: number;
  retorno: TModel;
  metadata: metadata;
}
export class metadata {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RetornoAPIGenerico extends RetornoAPIModel<any> {}
