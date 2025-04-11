interface IDepositoLogData {
  id: string;
  data: string; // Substitui "nome"
  status: boolean;
  moeda: string;
  fusoHorario: string;
  gastoAPI: number;
  ffe: number; // Sempre > 1
}

// Dados mockados
const DepositosLogData: IDepositoLogData[] = [
  {
    id: '1',
    data: '2025-04-10T12:00:00Z',
    status: true,
    moeda: 'BRL',
    fusoHorario: 'America/Sao_Paulo',
    gastoAPI: 1200.50,
    ffe: 1.05
  },
  {
    id: '2',
    data: '2025-04-09T09:00:00Z',
    status: false,
    moeda: 'USD',
    fusoHorario: 'America/New_York',
    gastoAPI: 800.25,
    ffe: 1.15
  },
  {
    id: '3',
    data: '2025-04-08T18:30:00Z',
    status: true,
    moeda: 'EUR',
    fusoHorario: 'Europe/Madrid',
    gastoAPI: 1500,
    ffe: 1.08
  }
];

export { type IDepositoLogData, DepositosLogData };
