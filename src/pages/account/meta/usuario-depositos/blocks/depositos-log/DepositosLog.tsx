import { useMemo, useState } from 'react';
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
import { IDepositoLogData, DepositosLogData } from './DepositosLogData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModalMoneyTransfer } from '@/partials/modals/clientes/contas';
import { ModalAssociateAccount } from '@/partials/modals/clientes/associar-conta';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const DepositosLog = () => {
  const depositosData: IDepositoLogData[] = useMemo(() => DepositosLogData, []);

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

  const columns = useMemo<ColumnDef<IDepositoLogData>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: { headerClassName: 'w-0' }
      },
      {
        accessorFn: (row) =>
          new Date(row.data).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: row.fusoHorario
          }),
        id: 'data',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Data do Depósito"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        accessorFn: (row) => row.gastoAPI,
        id: 'gastoAPI',
        header: ({ column }) => <DataGridColumnHeader title="Total Gasto" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();
          return typeof value === 'number'
            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
            : '-';
        },
        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        accessorFn: (row) => row.ffe,
        id: 'ffe',
        header: ({ column }) => <DataGridColumnHeader title="FFE" column={column} />,
        enableSorting: true,
        cell: ({ row }) => {
          const ffe = row.original.ffe;
          const gasto = row.original.gastoAPI;
          const lucro = gasto * (ffe / 100);

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help underline decoration-dotted">
                    {typeof ffe === 'number' ? `${ffe.toFixed(2)}%` : '-'}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-sm">
                    Lucro: {lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        meta: { headerClassName: 'min-w-[100px]' }
      },
      {
        id: 'click',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/depositos/${row.original.id}/detalhes`}
            title="Detalhes do Depósito"
            className="btn btn-icon btn-light btn-clear btn-sm"
          >
            <KeenIcon icon="cheque" style="duotone" />
          </Link>
        ),
        meta: { headerClassName: 'w-[60px]' }
      }
    ],
    []
  );

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} selecionados.`, {
        description: `IDs selecionados: ${selectedRowIds}`,
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
    const [show2, setShow2] = useState(false);

    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">Cliente: João da Silva</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => setShow2(true)}>
            <KeenIcon icon="plus" />
            Adicionar Saldo
          </Button>
          <ModalAssociateAccount open={show2} onOpenChange={() => setShow2(false)} />
          <ModalMoneyTransfer open={show} onClose={() => setShow(false)} />
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  return (
    <DataGrid
      columns={columns}
      data={depositosData}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      sorting={[{ id: 'timestamp', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { DepositosLog };
