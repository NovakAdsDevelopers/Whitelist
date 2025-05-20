/* eslint-disable react-hooks/exhaustive-deps */
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
import { IContasAnuncioLogData } from './ContasAnuncioLogData'; // Mudança do nome para ClientesLogData
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQueryClienteContasAnuncio } from '@/graphql/services/ClienteContaAnuncio';
import { ModalAssociateAccount } from '@/partials/modals/clientes/associar-conta';
import { useClient } from '@/auth/providers/ClientProvider';
import ModalMoneyTransfer from '@/partials/modals/clientes/contas/Modal';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

// Componente principal ClientesLog
const ContasAnuncioLog = () => {
  const { id } = useParams();
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

  const { data } = useQueryClienteContasAnuncio(variables);

  // Formatando os dados para o DataGrid
  const contasAnunciosData: IContasAnuncioLogData[] = useMemo(() => {
    return (
      data?.GetContasAssociadasPorCliente?.result?.map((item) => ({
        id: item.contaAnuncioId,
        nome: item.contaAnuncio.nome,
        status: item.ativo,
        moeda: item.contaAnuncio.moeda,
        fusoHorario: item.contaAnuncio.fusoHorario,
        gastoAPI: Number(item.contaAnuncio.gastoAPI),
        gastoTotal: item.gastoTotal,
        depositoTotal: item.depositoTotal,
        saldo: item.saldo
      })) || []
    );
  }, [data]);

  // Componente de filtro para a coluna
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

  const columns = useMemo<ColumnDef<IContasAnuncioLogData>[]>(
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
        id: 'conta',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Conta"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        accessorFn: (row) => row.gastoTotal,
        id: 'gastoTotal',
        header: ({ column }) => <DataGridColumnHeader title="Total Gasto" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();

          return typeof value === 'number' && !isNaN(value)
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value)
            : '-';
        },
        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        accessorFn: (row) => row.depositoTotal,
        id: 'depositoTotal',
        header: ({ column }) => <DataGridColumnHeader title="Depósito Total" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();
          const numberValue =
            typeof value === 'string'
              ? parseInt(value, 10)
              : typeof value === 'number'
                ? value
                : null;

          return typeof numberValue === 'number' && !isNaN(numberValue)
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(Math.max(0, numberValue)) // 👈 formatação com divisão por 100
            : '-';
        },
        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        id: 'saldoDisponivel',
        accessorFn: (row) => row.saldo,
        header: ({ column }) => <DataGridColumnHeader title="Saldo Disponível" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();
          return typeof value === 'number'
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value)
            : '-';
        },

        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title="Situação" column={column} />,
        enableSorting: true,
        cell: ({ row }) => {
          const ativo = row.original.status;
          return (
            <span className={`badge badge-sm ${ativo ? 'badge-success' : 'badge-destructive'}`}>
              {ativo ? 'Vinculado' : 'Desvinculado'}
            </span>
          );
        },
        meta: { headerClassName: 'min-w-[130px]' }
      },
      {
        id: 'click',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/meta/${row.original.id}/insights`}
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
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo')
        }
      });
    }
  };

  const Toolbar = () => {
    const { table } = useDataGrid();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
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
          <Link to={`/meta/${id}/depositos`}>
            <Button variant="light" size="sm">
              <KeenIcon icon="dollar" />
              Depósitos
            </Button>
          </Link>

          <Button variant="light" size="sm" onClick={() => setShow(true)}>
            <KeenIcon icon="plus" />
            Movimentação
          </Button>

          <Button variant="secondary" size="sm" onClick={() => setShow2(true)}>
            <KeenIcon icon="plus" />
            Adicionar Conta de Anuncio
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
      data={contasAnunciosData}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 10 }}
      sorting={[{ id: 'timestamp', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { ContasAnuncioLog };
