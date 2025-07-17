export interface TypesGetContaLimite {
  GetLimitesContaAnuncio: {
    contaAnuncioID: string;
    limiteCritico: string;
    limiteMedio: string;
    limiteInicial: string;
    alertaAtivo: boolean;
  };
}

export interface TypesSetContaLimite {
  SetAjusteLimiteConta: {
    contaAnuncioID: string;
  };
}

export type VariablesSetContaLimite = {
  data: {
    contaAnuncioID: string,
    limiteCritico: string,
    limiteInicial: string,
    limiteMedio: string
  };
};
