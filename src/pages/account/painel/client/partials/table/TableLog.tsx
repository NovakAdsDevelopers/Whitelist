import { useEffect, useMemo, useState } from 'react';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridColumnVisibility,
  DataGridRowSelect,
  DataGridRowSelectAll,
  KeenIcon,
  useDataGrid
} from '@/components';
import { toast } from 'sonner';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePanel } from '@/auth/providers/PanelProvider';
import { CreditCard } from 'lucide-react';

const TableRanking = () => {
  const { id } = useParams();
  const { dataRanking } = usePanel();

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
        accessorKey: 'nome',
        header: ({ column }) => <DataGridColumnHeader title="Nome da Conta" column={column} />,
        cell: ({ row }) => row.original.nome,
        meta: { headerClassName: 'min-w-[200px] text-center' }
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
        accessorKey: 'saldoMeta',
        header: ({ column }) => <DataGridColumnHeader title="Saldo Meta (R$)" column={column} />,
        cell: ({ row }) => {
          const raw = row.original.saldoMeta;
          const valor = Number(raw ?? 0);

          if (Number.isFinite(valor) && valor < 0) {
            // 🔻 Negativo: mostra apenas ícone + texto
            return (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <CreditCard className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">BM de Crédito</span>
              </div>
            );
          }

          // ✅ Zero ou positivo: mostra o valor formatado (como antes)
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(valor || 0);
        },
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
      },
      {
        accessorKey: 'fusoHorario',
        header: ({ column }) => <DataGridColumnHeader title="Fuso Horário" column={column} />,
        cell: ({ row }) => row.original.fusoHorario ?? '-',
        meta: { headerClassName: 'min-w-[180px] text-center' }
      },
      {
        id: 'click',
        header: () => 'Alerta',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/depositos/detalhes`}
            title="Detalhes do Depósito"
            className="btn btn-icon btn-light btn-clear btn-sm"
          >
            <KeenIcon icon="cheque" style="duotone" />
          </Link>
        ),
        meta: { headerClassName: 'w-[60px] text-center' }
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
    const [show, setShow] = useState(false);

    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">Ranking</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* <Button variant="secondary" size="sm" onClick={() => setShow(true)}>
            <KeenIcon icon="plus" />
            Movimentações
          </Button> */}
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  return (
    <DataGrid
      columns={columns}
      data={dataRanking}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      sorting={[{ id: 'gastoTotal', desc: true }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { TableRanking };
