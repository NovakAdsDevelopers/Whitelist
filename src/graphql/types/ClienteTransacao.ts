export interface TypesGetClienteTransacoes {
  GetClienteTransacoes: {
    tipo: string;
    valor: number;
    clienteId: number;
    usuarioId: number;
    id: number;
    dataTransacao: Date;
    fee: string;
    valorAplicado: number;
  }[];
}

export interface TypesSetClienteTransacao {
  SetClienteTransacao: {
    id: number;
  };
}
