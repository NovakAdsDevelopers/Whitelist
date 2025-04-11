/* eslint-disable prettier/prettier */
import { useMemo } from 'react';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
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
import { Input } from '@/components/ui/input';
import { ContasData, IContaData } from '.';
import { Button } from '@/components/ui/button';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const ContasTable = () => {
  const ColumnInputFilter = <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
    return (
      <Input
        placeholder="Filtrar..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className="h-9 w-full max-w-40"
      />
    );
  };

  const columns = useMemo<ColumnDef<IContaData>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorKey: 'conta_de_anuncio',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Conta"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => info.getValue(),
        meta: {
          headerClassName: 'min-w-[180px]'
        }
      },
      {
        accessorKey: 'saldo',
        header: ({ column }) => <DataGridColumnHeader title="Saldo Atual" column={column} />,
        cell: (info) => `R$ ${info.getValue()}`,
        meta: {
          headerClassName: 'min-w-[130px]'
        }
      },
      {
        accessorKey: 'meta',
        header: ({ column }) => <DataGridColumnHeader title="No Meta" column={column} />,
        cell: (info) => `R$ ${info.getValue()}`,
        meta: {
          headerClassName: 'min-w-[130px]'
        }
      },
      {
        accessorKey: 'a_inserir',
        header: ({ column }) => <DataGridColumnHeader title="A Inserir" column={column} />,
        cell: (info) => `R$ ${info.getValue()}`,
        meta: {
          headerClassName: 'min-w-[120px]'
        }
      },
      {
        accessorKey: 'data',
        header: ({ column }) => <DataGridColumnHeader title="Ultima Sincronização" column={column} />,
        cell: (info) => {
          const raw = info.getValue() as string;
          const date = new Date(raw);
          return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        },
        meta: {
          headerClassName: 'min-w-[160px]'
        }
      },
      {
        id: 'actions',
        header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
        cell: () => (
          <div className="flex items-center gap-2">
            <Button variant="light" size="sm">
              <KeenIcon icon="arrows-circle" />
            </Button>
            <Button variant="green" size="sm">
              <KeenIcon icon="dollar" />
            </Button>
          </div>
        ),
        enableSorting: false,
        meta: {
          headerClassName: 'min-w-[160px]'
        }
      }
    ],
    []
  );

  const data: IContaData[] = useMemo(() => ContasData, []);

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);

    if (selectedRowIds.length > 0) {
      toast(`Total de ${selectedRowIds.length} selecionadas.`, {
        description: `IDs selecionados: ${selectedRowIds.join(', ')}`,
        action: {
          label: 'Desfazer',
          onClick: () => console.log('Undo')
        }
      });
    }
  };

  const Toolbar = () => {
    const { table } = useDataGrid();

    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">Atualização de Gastos</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="default" size="sm">
            <KeenIcon icon="arrows-circle" />
            Sincronizar
          </Button>
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
      sorting={[{ id: 'data', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { ContasTable };
