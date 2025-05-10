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

export interface TypesGetClienteByID {
  GetCliente: {
    id: number;
    nome: string;
    email: string;
    cnpj: string;
    fee: string;
    saldo: number;
    depositoTotal: number;
    gastoTotal: number;
    criadoEm: Date;
    atualizadoEm: Date;
  };
}

export interface TypesSetCliente {
  SetCliente: {
    id: number;
    nome: number;
  };
}

export type VariablesSetClienteTransacao = {
  clienteId: number;
  tipo: string;
  usuarioId: number;
  valor: number;
  fee: string | null;
  valorAplicado: number | null;
  dataTransacao: string; // ou Date, conforme a API espera
};

export type VariablesSetCliente = {
  data: {
    nome: string;
    email: string;
    cnpj: string;
    fee: string;
  };
};
