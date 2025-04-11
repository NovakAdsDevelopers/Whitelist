
interface Severity {
  label: string;
  variant: string;
}

interface IClienteLogData {
  id: number;
  nome: string;
  email: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

const ClientesData: IClienteLogData[] = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    criadoEm: new Date('2023-05-15T10:00:00Z'),
    atualizadoEm: new Date('2024-03-20T12:30:00Z'),
  },
  {
    id: 2,
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    criadoEm: new Date('2022-09-10T09:00:00Z'),
    atualizadoEm: new Date('2024-03-19T14:20:00Z'),
  },
  {
    id: 3,
    nome: 'Carlos Pereira',
    email: 'carlos.pereira@example.com',
    criadoEm: new Date('2023-02-22T11:15:00Z'),
    atualizadoEm: new Date('2024-03-18T16:50:00Z'),
  },
  {
    id: 4,
    nome: 'Ana Costa',
    email: 'ana.costa@example.com',
    criadoEm: new Date('2023-11-05T08:45:00Z'),
    atualizadoEm: new Date('2024-03-20T09:00:00Z'),
  },
  {
    id: 5,
    nome: 'Lucas Almeida',
    email: 'lucas.almeida@example.com',
    criadoEm: new Date('2021-06-18T15:30:00Z'),
    atualizadoEm: new Date('2024-03-17T17:40:00Z'),
  },
];

export { type IClienteLogData, ClientesData };
