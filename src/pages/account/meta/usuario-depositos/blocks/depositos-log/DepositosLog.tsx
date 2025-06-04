import { useEffect, useMemo, useState } from 'react';
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
import { IClienteTransacaoLogData } from './DepositosLogData';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useClient } from '@/auth/providers/ClientProvider';
import { ModalMoneyDeposit } from '@/partials/modals/clientes/deposito';
import { useQueryClienteTransacoes } from '@/graphql/services/ClienteTransacao';
import { format } from 'date-fns';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const DepositosLog = () => {
  const { id } = useParams();
  const { refetch } = useClient();

  const variables = useMemo(
    () => ({
      clienteId: Number(id),
      pagination: {
        pagina: 0,
        quantidade: 100000
      }
    }),
    []
  );

  const { data } = useQueryClienteTransacoes(variables);

  const ClienteTransacaoData = useMemo(() => {
    return (
      data?.GetClienteTransacoes?.map((item) => ({
        clienteId: item.clienteId,
        usuarioId: item.usuarioId,
        dataTransacao: item.dataTransacao,
        valorAplicado: item.valorAplicado,
        fee: item.fee,
        valor: item.valor,
        tipo: item.tipo
      })) || []
    );
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

  const columns = useMemo<ColumnDef<IClienteTransacaoLogData>[]>(
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
        accessorFn: (row) => row.tipo,
        id: 'tipo',
        header: ({ column }) => <DataGridColumnHeader title="Tipo" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const tipo = info.getValue<string>();

          if (tipo === 'ENTRADA') {
            return (
              <span className="px-4 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md">
                Depósito
              </span>
            );
          }

          if (tipo === 'SAIDA') {
            return (
              <span className="px-4 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-md">
                Saque
              </span>
            );
          }

          return '-';
        },
        meta: { headerClassName: 'min-w-[200px] text-center' }
      },
      {
        accessorFn: (row) => row.dataTransacao,
        id: 'dataTransacao',
        header: ({ column }) => <DataGridColumnHeader title="Data" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();

          // Verifica se o valor é uma string
          if (typeof value === 'string') {
            // Converte a string em uma data
            const dateValue = new Date(value);
            // Formata a data para o padrão UTC
            const formattedDate = format(dateValue, 'dd-MM-yyyy');
            return formattedDate;
          }

          // Se não for uma string ou uma data, retorna '-'
          return '-';
        },
        meta: { headerClassName: 'min-w-[200px] text-center' }
      },
      {
        accessorFn: (row) => row.valor,
        id: 'valor',
        header: ({ column }) => <DataGridColumnHeader title="Valor Depositado" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();
          return typeof value === 'number'
            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                value / 100
              )
            : '-';
        },
        meta: { headerClassName: 'min-w-[200px] text-center' }
      },
      {
        accessorFn: (row) => row.valorAplicado,
        id: 'valorAplicado',
        header: ({ column }) => <DataGridColumnHeader title="Valor Aplicado" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();
          const row = info.row.original;
          const fee = row?.fee || '0%';

          const formattedValue =
            typeof value === 'number'
              ? new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value / 100)
              : '-';

          return (
            <div className="truncate" title={`Fee aplicado: ${fee}`}>
              {formattedValue}
            </div>
          );
        },
        meta: { headerClassName: 'min-w-[200px] text-center' }
      },
      {
        id: 'click',
        header: () => '',
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
    const { name, setClientInfo } = useClient();
    const { id } = useParams();

    useEffect(() => {
      if (id) {
        setClientInfo(Number(id)); // Convertendo string para número
      }
    }, [id]);

    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">{name ? 'Cliente: ' + name : ''}</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => setShow(true)}>
            <KeenIcon icon="plus" />
            Movimentações
          </Button>
          <ModalMoneyDeposit
            clienteId={Number(id)}
            usuarioId={1}
            open={show}
            onClose={() => setShow(false)}
          />
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  return (
    <DataGrid
      columns={columns}
      data={ClienteTransacaoData}
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
