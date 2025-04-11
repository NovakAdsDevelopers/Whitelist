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
      moeda: string;
      fusoHorario: string;
      gastoTotal: string;
    }[]
  }
}
