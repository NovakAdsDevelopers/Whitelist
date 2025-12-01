import { useEffect, useMemo, useState } from 'react';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridColumnVisibility,
  useDataGrid
} from '@/components';
import { toast } from 'sonner';
import axios from 'axios';

// -----------------------------------------------------------------------------
// Tipos
// -----------------------------------------------------------------------------
type Detalhes = {
  nomePagador?: string;
  nomeRecebedor?: string;
  cpfCnpjPagador?: string;
  cpfCnpjRecebedor?: string;
  chavePixRecebedor?: string;
  codigoSolicitacao?: string;
  endToEndId?: string;
  origemMovimentacao?: string;
  txId?: string;
  [k: string]: any;
};

type TransacaoExtrato = {
  idTransacao?: string;
  dataInclusao?: string;
  dataTransacao: string;
  tipoTransacao: string;
  tipoOperacao: 'C' | 'D';
  valor: string | number;
  titulo: string;
  descricao: string;
  numeroDocumento?: string;
  detalhes?: Detalhes;
};

type TableRow = TransacaoExtrato & { valorNum: number };

type TipoPeriodo =
  | 'ultimos7'
  | 'mesAtual'
  | 'mesAnterior'
  | 'total'
  | 'personalizado';

type Periodo = {
  dataInicio: string;
  dataFim: string;
  tipo?: TipoPeriodo;
};

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

const TIPO_TRANSACAO_OPCOES = [
  'PIX',
  'PAGAMENTO',
  'BOLETO_COBRANCA',
  'TRANSFERENCIA',
  'INVESTIMENTO',
  'ESTORNO',
  'CAMBIO',
  'OUTROS'
];

// -----------------------------------------------------------------------------
// Componente principal
// -----------------------------------------------------------------------------
const Table = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<Periodo | null>(null);

  // cards
  const [saldoCreditado, setSaldoCreditado] = useState(0);
  const [saldoDebitado, setSaldoDebitado] = useState(0);
  const [saldoAtual, setSaldoAtual] = useState(0);

  // filtros (UI)
  const [showFilter, setShowFilter] = useState(false);
  const [tipo, setTipo] = useState<'entrada' | 'saida' | 'todos'>('todos');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [tipoTransacao, setTipoTransacao] = useState<string>('');

  // modal detalhes
  const [detalheSelecionado, setDetalheSelecionado] = useState<Detalhes | null>(null);

  // ---------------------------------------------------------------------------
  // Colunas
  // ---------------------------------------------------------------------------
  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: 'dataTransacao',
        header: ({ column }) => <DataGridColumnHeader title="Data" column={column} />,
        cell: ({ row }) => <div className="text-center">{row.original.dataTransacao}</div>,
        meta: { headerClassName: 'min-w-[130px] text-center' }
      },
      {
        accessorKey: 'tipoTransacao',
        header: ({ column }) => <DataGridColumnHeader title="Tipo de Transação" column={column} />,
        cell: ({ row }) => (
          <div className="text-center font-medium">{row.original.tipoTransacao ?? '-'}</div>
        ),
        meta: { headerClassName: 'min-w-[200px] text-center' }
      },
      {
        accessorKey: 'tipoOperacao',
        header: ({ column }) => <DataGridColumnHeader title="Operação" column={column} />,
        cell: ({ row }) => (
          <div
            className={`text-center font-semibold ${
              row.original.tipoOperacao === 'C' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {row.original.tipoOperacao === 'C' ? 'Entrada' : 'Saída'}
          </div>
        ),
        meta: { headerClassName: 'min-w-[120px] text-center' }
      },
      {
        accessorKey: 'valor',
        header: ({ column }) => <DataGridColumnHeader title="Valor" column={column} />,
        cell: ({ row }) => (
          <div
            className={`text-right pr-4 ${
              row.original.tipoOperacao === 'C' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(row.original.valorNum)}
          </div>
        ),
        meta: { headerClassName: 'min-w-[150px] text-center' }
      },
      {
        accessorKey: 'descricao',
        header: ({ column }) => <DataGridColumnHeader title="Descrição" column={column} />,
        cell: ({ row }) => <div className="text-left">{row.original.descricao}</div>,
        meta: { headerClassName: 'min-w-[250px] text-left' }
      },
      {
        id: 'detalhes',
        header: ({ column }) => <DataGridColumnHeader title="Detalhes" column={column} />,
        cell: ({ row }) => (
          <div className="text-center">
            <button
              onClick={() => setDetalheSelecionado(row.original.detalhes ?? null)}
              className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded-md"
            >
              Ver Detalhes
            </button>
          </div>
        ),
        meta: { headerClassName: 'min-w-[140px] text-center' }
      }
    ],
    []
  );

  // ---------------------------------------------------------------------------
  // API
  // ---------------------------------------------------------------------------
  const fetchExtrato = async () => {
  try {
    setLoading(true);

    const params: Record<string, string> = {};
    if (tipo !== 'todos') params.tipo = tipo;
    if (dataInicio) params.dataInicio = dataInicio;
    if (dataFim) params.dataFim = dataFim;
    if (tipoTransacao) params.tipoTransacao = tipoTransacao;

    const baseURL = import.meta.env.VITE_APP_API_META_URL;

    const response = await axios.get(`${baseURL}/consult-extrato`, { params });
    const { transacoes, periodo: p } = response.data;
    setPeriodo(p);

    const formatted: TableRow[] = (transacoes ?? []).map((t: TransacaoExtrato) => ({
      ...t,
      valorNum: Number(t.valor),
    }));

    const totalC = formatted
      .filter((t) => t.tipoOperacao === 'C')
      .reduce((acc, t) => acc + t.valorNum, 0);

    const totalD = formatted
      .filter((t) => t.tipoOperacao === 'D')
      .reduce((acc, t) => acc + t.valorNum, 0);

    setSaldoCreditado(totalC);
    setSaldoDebitado(totalD);
    setSaldoAtual(totalC - totalD);
    setData(formatted);
  } catch (err: any) {
    console.error('Erro ao carregar extrato:', err);
    toast.error('Erro ao carregar extrato', { description: err?.message });
  } finally {
    setLoading(false);
  }
};


  // ---------------------------------------------------------------------------
  // Efeitos iniciais
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const hoje = new Date();
    const inicio = new Date();
    inicio.setDate(hoje.getDate() - 6);
    setPeriodo({
      dataInicio: inicio.toISOString().split('T')[0],
      dataFim: hoje.toISOString().split('T')[0],
      tipo: 'ultimos7'
    });
    setDataInicio(inicio.toISOString().split('T')[0]);
    setDataFim(hoje.toISOString().split('T')[0]);
    fetchExtrato();
  }, []);

  // ---------------------------------------------------------------------------
  // Toolbar
  // ---------------------------------------------------------------------------
  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0 justify-between items-center">
        <h3 className="card-title font-semibold text-lg">Extrato Financeiro</h3>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowFilter(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Filtrar
          </button>
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Verifica se há filtros ativos
  // ---------------------------------------------------------------------------
  const filtrosAtivos =
    tipo !== 'todos' ||
    tipoTransacao !== '' ||
    periodo?.tipo !== 'ultimos7' ||
    (periodo?.dataInicio && periodo?.dataInicio !== dataInicio) ||
    (periodo?.dataFim && periodo?.dataFim !== dataFim);

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl shadow bg-white border text-center">
          <h4 className="text-gray-500 text-sm">Saldo Total Creditado</h4>
          <p className="text-green-600 text-xl font-bold mt-1">
            {formatCurrency(saldoCreditado)}
          </p>
        </div>

        <div className="p-4 rounded-xl shadow bg-white border text-center">
          <h4 className="text-gray-500 text-sm">Saldo Total Debitado</h4>
          <p className="text-red-600 text-xl font-bold mt-1">
            {formatCurrency(saldoDebitado)}
          </p>
        </div>

        <div className="p-4 rounded-xl shadow bg-white border text-center">
          <h4 className="text-gray-500 text-sm">Período de Referência</h4>
          <p className="text-gray-800 text-lg font-bold mt-1">
            {periodo ? `${periodo.dataInicio} → ${periodo.dataFim}` : '—'}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <DataGrid<TableRow>
        columns={columns}
        data={data}
        rowSelection
        pagination={{ size: 10 }}
        toolbar={<Toolbar />}
        layout={{ card: true }}
      />

      {/* Modal filtros */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] sm:w-[460px] shadow-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Filtros do Extrato
            </h3>

            <div className="space-y-3">
              {/* Tipo */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tipo</label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={tipo}
                  onChange={(e) =>
                    setTipo(e.target.value as 'entrada' | 'saida' | 'todos')
                  }
                >
                  <option value="todos">Todos</option>
                  <option value="entrada">Entradas (Crédito)</option>
                  <option value="saida">Saídas (Débito)</option>
                </select>
              </div>

              {/* Tipo de Transação */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Tipo de Transação
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={tipoTransacao}
                  onChange={(e) => setTipoTransacao(e.target.value)}
                >
                  <option value="">Todos</option>
                  {TIPO_TRANSACAO_OPCOES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Período */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Período</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={periodo?.tipo || 'ultimos7'}
                  onChange={(e) => {
                    const tipo = e.target.value as TipoPeriodo;
                    const hoje = new Date();
                    let inicio = '';
                    let fim = hoje.toISOString().split('T')[0];

                    if (tipo === 'ultimos7') {
                      const start = new Date();
                      start.setDate(hoje.getDate() - 6);
                      inicio = start.toISOString().split('T')[0];
                    } else if (tipo === 'mesAtual') {
                      const start = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                      inicio = start.toISOString().split('T')[0];
                    } else if (tipo === 'mesAnterior') {
                      const start = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
                      const end = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
                      inicio = start.toISOString().split('T')[0];
                      fim = end.toISOString().split('T')[0];
                    } else if (tipo === 'total') {
                      inicio = '';
                      fim = '';
                    }

                    setPeriodo({ dataInicio: inicio, dataFim: fim, tipo });
                    setDataInicio(inicio);
                    setDataFim(fim);
                  }}
                >
                  <option value="ultimos7">Últimos 7 dias</option>
                  <option value="mesAtual">Mês atual</option>
                  <option value="mesAnterior">Mês anterior</option>
                  <option value="total">Período total</option>
                  <option value="personalizado">Personalizado</option>
                </select>

                {/* Campos personalizados */}
                {periodo?.tipo === 'personalizado' && (
                  <div className="flex flex-col gap-2 mt-2">
                    <input
                      type="date"
                      className="border rounded-lg px-3 py-2 text-sm"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                    <input
                      type="date"
                      className="border rounded-lg px-3 py-2 text-sm"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-between items-center gap-2 mt-5 border-t pt-4">
              {filtrosAtivos && (
                <button
                  onClick={() => {
                    const hoje = new Date();
                    const inicio = new Date();
                    inicio.setDate(hoje.getDate() - 6);

                    setTipo('todos');
                    setTipoTransacao('');
                    setPeriodo({
                      dataInicio: inicio.toISOString().split('T')[0],
                      dataFim: hoje.toISOString().split('T')[0],
                      tipo: 'ultimos7'
                    });
                    setDataInicio(inicio.toISOString().split('T')[0]);
                    setDataFim(hoje.toISOString().split('T')[0]);

                    toast.info('Filtros limpos. Mostrando últimos 7 dias.');
                    setShowFilter(false);
                    fetchExtrato();
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm"
                >
                  Limpar filtros
                </button>
              )}

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setShowFilter(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowFilter(false);
                    fetchExtrato();
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Table };
