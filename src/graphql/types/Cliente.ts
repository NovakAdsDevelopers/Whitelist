export interface TypesGetClientes {
  GetClientes: {
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    result: {
      id: number;
      nome: string;
      email: string;
      criadoEm: Date;
      atualizadoEm: Date;
    }[];
  };
}

export interface TypesSetCliente {
  SetCliente: {
    id: number;
    nome: number;

  };
}
export type VariablesSetCliente = {
  data: {
    nome: string;
    email: string;
    // cnpj: string;
  };
};
