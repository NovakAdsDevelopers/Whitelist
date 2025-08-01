export enum TipoTransacao {
  ENTRADA = 'ENTRADA',
  REALOCACAO = 'REALOCACAO',
  SAIDA = 'SAIDA'
}

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
      depositoTotal: number;
      saldo: number;
      gastoTotal: number;
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

export interface TypesGetContaAnuncioAssociada {
  GetContaAssociadaCliente: {
    id: number;
    inicioAssociacao: Date;
    fimAssociacao?: Date;
    contaAnuncio: {
      nome: string;
    };
  };
}

export interface TypesSetClienteContaAnuncio {
  SetClienteContaAnuncio: {
    associacoes: {
      id: number;
    }[];
  };
}
export interface TypesPutClienteContaAnuncio {
  PutClienteContaAnuncio: {
    id: number;
  };
}

export interface TypesSetTransacaoContaAnuncio {
  SetTransacaoClienteContaAnuncio: {
    id: number;
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

export type VariablesPutClienteContaAnuncio = {
  id: string;
  inicioAssociacao: string;
  fimAssociacao?: string | null;
};

export type VariablesSetTrasacaoClienteContaAnuncio = {
  clienteId: number;
  usuarioId: number;
  contaOrigemId: number;
  tipo: TipoTransacao;
  valor: number;
  contaDestinoId: number | null;
};
