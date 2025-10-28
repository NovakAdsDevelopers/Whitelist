import { useEffect, useMemo, useState } from 'react';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridColumnVisibility,
  DataGridRowSelect,
  DataGridRowSelectAll,
  useDataGrid
} from '@/components';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGetInsightsAdAccountPeriod } from '@/graphql/services/ContasAnuncio';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const TableSpendDaily = () => {
  const { id: adAccountId } = useParams<{ id: string }>();
  const [type, setType] = useState<'week' | 'mounth' | 'tree-mouth' | 'year'>('mounth');

  const { data, refetch } = useGetInsightsAdAccountPeriod({ type, adAccountId });

  // 🚀 Mapeando o retorno do GraphQL em linhas para o DataGrid
  const dataSpendDaily = useMemo(() => {
    const gastos = data?.GetInsightsGastosPeriodos;
    if (!gastos) return [];

    // monta as linhas com o índice original (idx) p/ desempate por data mais recente
    const rows = gastos.categories.map((dia: string, index: number) => ({
      id: index + 1,
      idx: index, // índice original: maior = mais recente
      dia,
      gastoTotal: gastos.data[index],
      moeda: 'BRL'
    }));

    // ordena: maior gasto primeiro; empate -> mais recente (idx maior) primeiro
    rows.sort((a, b) => {
      if (b.gastoTotal !== a.gastoTotal) return b.gastoTotal - a.gastoTotal;
      return b.idx - a.idx;
    });

    return rows;
  }, [data]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: { headerClassName: 'w-0 text-center' }
      },
      {
        accessorKey: 'dia',
        header: ({ column }) => <DataGridColumnHeader title="Dia" column={column} />,
        cell: ({ row }) => row.original.dia,
        meta: { headerClassName: 'min-w-[120px] text-center' }
      },
      {
        accessorKey: 'gastoTotal',
        header: ({ column }) => <DataGridColumnHeader title="Gasto Total (R$)" column={column} />,
        cell: ({ row }) =>
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(row.original.gastoTotal),
        meta: { headerClassName: 'min-w-[160px] text-center' }
      },
      {
        accessorKey: 'moeda',
        header: ({ column }) => <DataGridColumnHeader title="Moeda" column={column} />,
        cell: ({ row }) => {
          const moeda = row.original.moeda;
          if (moeda === 'BRL') return '🟢 BRL';
          if (moeda === 'USD') return '🔵 USD';
          return '-';
        },
        meta: { headerClassName: 'min-w-[120px] text-center' }
      }
    ],
    []
  );

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} selecionados.`, {
        description: `IDs selecionados: ${selectedRowIds.join(', ')}`,
        action: {
          label: 'Desfazer',
          onClick: () => console.log('Desfazer')
        }
      });
    }
  };

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">Gasto Diário</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-5">
            <Select
              defaultValue={type}
              onValueChange={(value) => {
                setType(value as typeof type);
                refetch({ type: value });
              }}
            >
              <SelectTrigger className="w-40" size="sm">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="w-40">
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="mounth">Mês atual</SelectItem>
                <SelectItem value="tree-mouth">Últimos 3 meses</SelectItem>
                <SelectItem value="year">Ano atual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  return (
    <DataGrid
      columns={columns}
      data={dataSpendDaily}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      sorting={[{ id: 'dia', desc: true }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { TableSpendDaily };
