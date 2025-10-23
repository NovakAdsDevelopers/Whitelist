export interface TypesGetContaAnuncioPix {
  GetContaAnuncioFundos: {
    result: {
      id: number;
      accountId: string;
      accountName: string;
      bmId: string;
      bmNome: string;
      usuarioId: string;
      usuarioNome: string;
      valor: number;
      codigoCopiaCola: string;
      imageUrl: string;
      tipoRetorno: string;
      codigoSolicitacao: string;
      dataPagamento: string;
      dataOperacao: string;
    }[]
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  }
}