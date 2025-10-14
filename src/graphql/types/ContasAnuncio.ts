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
      BMId: string;
      BM: {
        nome: string;
        BMId: string;
      }
    }[];
  };
}

export interface TypesGetContasAnuncioCredito {
  GetAllContasAnuncioSpends: {
    result: {
      id: string;
      nome: string;
      status: number;
      moeda: string;
      fusoHorario: string;
      gastoDiario: string;
      limiteGasto: string;
      saldo: string;
      depositoTotal: string;
      ultimaSincronizacao: string;
    }[];
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
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
    }[];
  };
}

export interface TypesGetInsightsAdAccount {
  GetInsightsAdAccount: {
    adAccountId: string;
    periodoUTC: {
      lt: string;
      gte: string;
    };
    diasNoPeriodo: number;
    saldoMeta: number;
    gastoTotal: number;
    mediaDiaria: number;
    saldoTotal: number;
    nome: string;
  };
}
