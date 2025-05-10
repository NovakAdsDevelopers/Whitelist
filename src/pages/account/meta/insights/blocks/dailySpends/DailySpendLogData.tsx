interface IDailySpendLogData {
  id: number;
  nome: string;
  status: boolean;
  saldo: number;
  moeda: string;
  fusoHorario: string;
  gastoAPI: number;
  depositoTotal: number;
}

export { type IDailySpendLogData };
