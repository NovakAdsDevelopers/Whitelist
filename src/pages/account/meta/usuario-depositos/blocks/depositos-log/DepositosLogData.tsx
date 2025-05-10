interface IClienteTransacaoLogData {
  tipo: string;
  valor: number;
  clienteId: number;
  usuarioId: number;
  id: number;
  dataTransacao: Date;
  fee: string;
  valorAplicado: number;
}

export { type IClienteTransacaoLogData };
