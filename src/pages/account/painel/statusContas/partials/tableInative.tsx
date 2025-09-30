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

const TableInative = () => {
  const { id } = useParams();
  
  const data = []

   const columns = useMemo<ColumnDef<any>[]>(
    () => [
    
      {
        accessorKey: 'nome',
        header: ({ column }) => <DataGridColumnHeader title="Conta de Anúncio" column={column} />,
        cell: ({ row }) => row.original.nome,
        meta: { headerClassName: 'min-w-[200px] text-center' }
      },
      {
        accessorKey: 'gastoTotal',
        header: ({ column }) => <DataGridColumnHeader title="Data de Desativação" column={column} />,
        cell: ({ row }) =>
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(row.original.gastoTotal),
        meta: { headerClassName: 'min-w-[160px] text-center' }
      },
      {
        accessorKey: 'moeda',
        header: ({ column }) => <DataGridColumnHeader title="Valor Retido" column={column} />,
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
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        cell: ({ row }) => row.original.fusoHorario ?? '-',
        meta: { headerClassName: 'min-w-[180px] text-center' }
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
        <h3 className="card-title">Contas Desativadas</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  return (
    <DataGrid
      columns={columns}
      data={data}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { TableInative };
