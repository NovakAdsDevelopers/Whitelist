interface IDailySpendLogData {
  id: number;
  nome: string;
  status: boolean; 
  moeda: string;
  fusoHorario: string;
  gastoAPI: number;
}


export { type IDailySpendLogData };
