interface IContasAnuncioLogData {
  id: string;
  nome: string;
  status: number;
  moeda: string;
  fusoHorario: string;
  gastoTotal: string;
}


const ContasAnuncioLogData: IContasAnuncioLogData[] = [
  {
    id: '11',
    nome: 'Conta A',
    status: 1, // 1 para Ativo
    moeda: 'BRL',
    fusoHorario: 'GMT-3',
    gastoTotal: '5000'
  },
  {
    id: '12',
    nome: 'Conta B',
    status: 0, // 0 para Inativo
    moeda: 'BRL',
    fusoHorario: 'GMT-3',
    gastoTotal: '12000'
  },
  {
    id: '13',
    nome: 'Conta C',
    status: 1, // 1 para Ativo
    moeda: 'USD',
    fusoHorario: 'GMT-5',
    gastoTotal: '8000'
  },
  {
    id: '14',
    nome: 'Conta D',
    status: 2, // 2 para Suspenso
    moeda: 'BRL',
    fusoHorario: 'GMT-3',
    gastoTotal: '7000'
  },
  {
    id: '15',
    nome: 'Conta E',
    status: 0, // 0 para Inativo
    moeda: 'EUR',
    fusoHorario: 'GMT+1',
    gastoTotal: '2000'
  },
  {
    id: '16',
    nome: 'Conta F',
    status: 1, // 1 para Ativo
    moeda: 'BRL',
    fusoHorario: 'GMT-3',
    gastoTotal: '9500'
  },
  {
    id: '17',
    nome: 'Conta G',
    status: 2, // 2 para Suspenso
    moeda: 'USD',
    fusoHorario: 'GMT-5',
    gastoTotal: '6500'
  },
  {
    id: '18',
    nome: 'Conta H',
    status: 1, // 1 para Ativo
    moeda: 'BRL',
    fusoHorario: 'GMT-3',
    gastoTotal: '11000'
  },
  {
    id: '19',
    nome: 'Conta I',
    status: 0, // 0 para Inativo
    moeda: 'EUR',
    fusoHorario: 'GMT+1',
    gastoTotal: '15000'
  },
  {
    id: '20',
    nome: 'Conta J',
    status: 2, // 2 para Suspenso
    moeda: 'BRL',
    fusoHorario: 'GMT-3',
    gastoTotal: '5000'
  }
];

export { ContasAnuncioLogData, type IContasAnuncioLogData };
