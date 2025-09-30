import React, { useState, useMemo } from 'react';
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
import { useDeleteCliente, useQueryClientes } from '@/graphql/services/Cliente';
import { useClient } from '@/auth/providers/ClientProvider';
import { Loader2, Database } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/alert-dialog-confirm';
import { useAuthContext } from '@/auth';

// ✅ Componente separado para evitar hook em render dinâmica
const ClienteLinkCell: React.FC<{ id: number }> = ({ id }) => {
  const { setClientInfo } = useClient();

  const handleClick = () => {
    setClientInfo(id);
  };

  return (
    <Link
      to={`/meta/${id}/contas-anuncio`}
      onClick={handleClick}
      title="Contas de Anúncios"
      className="btn btn-icon btn-sm bg-gray-200 hover:bg-green-300 hover:text-green-700 transition-colors"
    >
      <KeenIcon icon="data" />
    </Link>
  );
};

const ClienteDeleteCell: React.FC<{ id: number, refetch: any }> = ({ id, refetch }) => {
  const { deleteCliente } = useDeleteCliente();

  // mutation/service real
  const excluirCliente = async () => {
    try {
      await deleteCliente(id);
      toast.success('Cliente removido com sucesso!');

      await refetch();
    } catch {
      toast.error('Erro ao remover cliente.');
    }
  };

  return (
    <ConfirmDialog
      title="Confirmar operação?"
      description="Você realmente deseja EXCLUIR este cliente?"
      action={excluirCliente}
      textAction="Sim, excluir"
      textCancel="Cancelar"
      delayMs={3000}
    >
      {/* Trigger do ConfirmDialog */}
      <button
        title="Excluir"
        className="btn btn-icon btn-sm bg-gray-200 hover:bg-red-300 hover:text-red-700 transition-colors"
      >
        <KeenIcon icon="trash" />
      </button>
    </ConfirmDialog>
  );
};

const ClientesLog = () => {
  const { currentUser } = useAuthContext();

  const variables = useMemo(
    () => ({
      pagination: {
        pagina: 0,
        quantidade: 100000
      }
    }),
    []
  );

  const { data, loading, refetch } = useQueryClientes(variables);

  const clientesData: IClienteLogData[] =
    data?.GetClientes?.result?.map((cliente) => ({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      criadoEm: new Date(cliente.criadoEm),
      atualizadoEm: new Date(cliente.atualizadoEm)
    })) || [];

  const ColumnInputFilter = ({ column }: any) => (
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
        id: 'actions',
        header: () => <div className="flex justify-center w-full">Ações</div>,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <ClienteLinkCell id={row.original.id} />
            {currentUser?.tipo === 'ADMIN' ? <ClienteDeleteCell refetch={refetch} id={row.original.id} /> : null}
          </div>
        ),
        meta: { headerClassName: 'w-[120px]' }
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
          <ModalCreateCliente refetch={refetch} open={show} onOpenChange={() => setShow(false)} />
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <DataGrid
          columns={columns}
          data={clientesData}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'timestamp', desc: false }]}
          toolbar={<Toolbar />}
          layout={{ card: true }}
          messages={{
            loading: true,
            empty: (
              <div className="text-center flex justify-center items-center flex-col w-full text-muted-foreground text-sm">
                <Loader2 className="animate-spin text-muted-foreground" />
                Carregando clientes...
              </div>
            )
          }}
        />
      ) : (
        <DataGrid
          columns={columns}
          data={clientesData}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'timestamp', desc: false }]}
          toolbar={<Toolbar />}
          layout={{ card: true }}
          messages={{
            loading: true,
            empty: (
              <div className="text-center flex justify-center items-center flex-col w-full text-muted-foreground text-sm">
                <Database className="text-muted-foreground pb-2" />
                Nenhum cliente encontrado
              </div>
            )
          }}
        />
      )}
    </>
  );
};

export { ClientesLog };
