interface IContasAnuncioLogData {
  id: string;
  nome: string;
  status: boolean; 
  moeda: string;
  fusoHorario: string;
  gastoAPI: number;
  gastoTotal: number;
  depositoTotal: number;
  saldo: number;
}


export { type IContasAnuncioLogData };
