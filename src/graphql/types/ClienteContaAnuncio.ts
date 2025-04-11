export interface TypesGetClienteContasAnuncio {
  GetContasAssociadasPorCliente: {
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    result: {
      id: number;
      clienteId: number;
      contaAnuncioId: string;
      inicioAssociacao: Date;
      fimAssociacao?: Date;
      ativo: boolean;
      contaAnuncio: {
        id: number;
        nome: string;
        status: number;
        moeda: string;
        fusoHorario: string;
        gastoTotal: string;
        gastoAPI: string;
      };
    }[];
  };
}

export interface TypesSetClienteContaAnuncio {
  SetClienteContaAnuncio: {
    associacoes: {
      id: number;
    }[]
  };
}

export type VariablesSetClienteContaAnuncio = {
  clienteId: number;
  contas: {
    contaAnuncioId: string;
    inicioAssociacao: string;
    fimAssociacao?: string | null;
  }[];
};
