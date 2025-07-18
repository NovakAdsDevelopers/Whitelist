export interface TypesGetContasAnuncio {
  GetContasAnuncio: {
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    result: {
      id: string;
      nome: string;
      status: number;
      saldo: number;
      depositoTotal: number;
      moeda: string;
      fusoHorario: string;
      gastoTotal: string;
      gastoAPI: string;
      limitGasto: string;
      saldoMeta: string;
      ultimaSincronizacao: string;
    }[]
  }
}

export interface TypesGetAllContasAnuncio {
  GetAllContasAnuncio: {
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    result: {
      id: string;
      nome: string;
      status: number;
      saldo: number;
      depositoTotal: number;
      moeda: string;
      fusoHorario: string;
      gastoTotal: string;
      gastoAPI: string;
      limitGasto: string;
      saldoMeta: string;
      ultimaSincronizacao: string;
    }[]
  }
}
