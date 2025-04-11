import { useState, useMemo } from 'react';
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
import { IClienteLogData } from './ClientesLogData';
import { Button } from '@/components/ui/button';
import { ModalCreateCliente } from '@/partials/modals/clientes/create';
import { Link } from 'react-router-dom';
import { useQueryClientes } from '@/graphql/services/Cliente';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const ClientesLog = () => {
  const variables = useMemo(
    () => ({
      pagination: {
        pagina: 0,
        quantidade: 100000
      }
    }),
    []
  );

  const { data } = useQueryClientes(variables);

  // 🔥 Removido o useMemo para garantir atualização dos dados
  const clientesData: IClienteLogData[] =
    data?.GetClientes?.result?.map((cliente) => ({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      criadoEm: new Date(cliente.criadoEm),
      atualizadoEm: new Date(cliente.atualizadoEm)
    })) || [];

  const ColumnInputFilter = <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => (
    <Input
      placeholder="Filtrar..."
      value={(column.getFilterValue() as string) ?? ''}
      onChange={(event) => column.setFilterValue(event.target.value)}
      className="h-9 w-full max-w-40"
    />
  );

  const columns = useMemo<ColumnDef<IClienteLogData>[]>(
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
        accessorFn: (row) => row.nome,
        id: 'cliente',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Cliente"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        accessorFn: (row) => row.email,
        id: 'email',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Email"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        id: 'click',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/meta/${row.original.id}/contas-anuncio`}
            title="Contas de Anúncio"
            className="btn btn-icon btn-light btn-clear btn-sm"
          >
            <KeenIcon icon="data" />
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
      toast(`Total ${selectedRowIds.length} selecionado(s).`, {
        description: `IDs: ${selectedRowIds.join(', ')}`,
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
        <h3 className="card-title">Gestão de Clientes</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button size="sm" onClick={() => setShow(true)}>
            <KeenIcon icon="plus" />
            Novo Cliente
          </Button>
          <ModalCreateCliente open={show} onOpenChange={() => setShow(false)} />
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  console.log(clientesData);

  return (
    <DataGrid
      columns={columns}
      data={clientesData}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      sorting={[{ id: 'timestamp', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { ClientesLog };
