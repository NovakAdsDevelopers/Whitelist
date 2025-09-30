export interface TypesGetIntegracoes {
  GetIntegracoes: {
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    result: {
      token: string;
      client_id: string;
      secret_id: string;
      id: string;
      cor: string | null;
      img: string | null;
      title: string;
      situacao: string;
      totalAdAccounts: number;

      bms: {
        id: string;
        nome: string;
        adaccounts: number;
      }[];
    }[];
  };
}

export interface TypesSetIntegracao {
  SetIntegracao: {
    id: number;
  };
}

export type VariablesSetIntegracao = {
  data: {
    client_id: string;
    secret_id: string;
    last_token: string;
    cor: string | null;
    img: string | null;
    title: string;
  };
};
