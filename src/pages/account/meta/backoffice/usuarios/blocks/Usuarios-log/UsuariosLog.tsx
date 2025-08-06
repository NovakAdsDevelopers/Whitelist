/* eslint-disable prettier/prettier */
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
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QueryGetUsuarios } from '@/graphql/services/Usuario';
import { TipoUsuario, TypesGetUsuarios } from '@/graphql/types/Usuario';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

// Função auxiliar para exibir o tipo de usuário com texto amigável
function formatTipoUsuario(tipo: TipoUsuario | keyof typeof TipoUsuario | string): string {
  const tipoString = typeof tipo === 'string' ? tipo : TipoUsuario[tipo];

  switch (tipoString) {
    case 'ADMIN':
      return 'Administrador';
    case 'GERENTE':
      return 'Gerente';
    case 'USUARIO':
      return 'Usuário';
    default:
      return 'Desconhecido';
  }
}

const UsuariosLog = () => {
  const { data } = QueryGetUsuarios({
    variables: {
      pagination: {
        pagina: 0,
        quantidade: 100000
      }
    }
  });

  // Lista de usuários formatada com base na resposta da query
  const UsuariosData: TypesGetUsuarios['GetUsuarios']['result'] = useMemo(() => {
    return data?.GetUsuarios.result || [];
  }, [data]);

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

  const columns = useMemo<ColumnDef<TypesGetUsuarios['GetUsuarios']['result'][0]>[]>(
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
        id: 'nome',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Nome"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
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
        cell: (info) => info.getValue(),
        meta: { headerClassName: 'min-w-[250px]' }
      },
      {
        accessorFn: (row) => row.tipo,
        id: 'tipo',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Tipo"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => (
          <span className="badge badge-sm badge-outline">
            {formatTipoUsuario(info.getValue() as TipoUsuario)}
          </span>
        ),
        meta: { headerClassName: 'min-w-[140px]' }
      },
      {
        accessorFn: (row) => row.criadoEm,
        id: 'criado',
        header: ({ column }) => <DataGridColumnHeader title="Criado em" column={column} />,
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
        meta: { headerClassName: 'min-w-[140px]' }
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/meta/${row.original.id}/contas-anuncio`}
            className="btn btn-icon btn-light btn-clear btn-sm"
            title="Ver Contas de Anúncio"
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
    const [show, setShow] = useState(false);

    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">Gestão de Usuários</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button size="sm" onClick={() => setShow(true)}>
            <KeenIcon icon="plus" />
            Novo Usuário
          </Button>
          {/* <ModalCreateUsuarios open={show} onOpenChange={() => setShow(false)} /> */}
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  return (
    <DataGrid
      columns={columns}
      data={UsuariosData}
      rowSelection
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      sorting={[{ id: 'criado', desc: true }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { UsuariosLog };
