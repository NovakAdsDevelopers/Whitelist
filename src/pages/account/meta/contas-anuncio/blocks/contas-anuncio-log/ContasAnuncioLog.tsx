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
import { ContasAnuncioLogData, IContasAnuncioLogData } from './ContasAnuncioLogData'; // Mudança do nome para ClientesLogData
import { Link } from 'react-router-dom';
import { ModalCreateContasAnuncio } from '@/partials/modals/contas-anuncio/create';
import { Button } from '@/components/ui/button';
import { useGetContasAnuncio } from '@/graphql/services/ContasAnuncio';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

// Componente principal ClientesLog
const ContasAnuncioLog = () => {
  const { data } = useGetContasAnuncio({
    variables: {
      pagination: {
        pagina: 0,
        quantidade: 100000
      }
    }
  });

  // Formatando os dados para o DataGrid
  const contasAnunciosData: IContasAnuncioLogData[] = useMemo(() => {
    return (
      data?.GetContasAnuncio?.result?.map((conta) => ({
        id: conta.id,
        nome: conta.nome,
        status: conta.status,
        moeda: conta.moeda,
        fusoHorario: conta.fusoHorario,
        gastoTotal: conta.gastoTotal
        
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

  const columns = useMemo<ColumnDef<IContasAnuncioLogData>[]>(() => [
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
      accessorFn: (row) => row.nome, 
      id: 'cliente',
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Conta"
          filter={<ColumnInputFilter column={column} />}
          column={column}
        />
      ),
      enableSorting: true,
      cell: (info) => info.getValue(),
      meta: {
        headerClassName: 'min-w-[200px]'
      }
    },
    {
      accessorFn: (row) => Number(row.gastoTotal), // Total Gasto
      id: 'totalGasto',
      header: ({ column }) => <DataGridColumnHeader title="Total Gasto" column={column} />,
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue();
        return typeof value === 'number'
          ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(Math.max(0, value / 100)) // 👈 valor tratado como centavos
          : '-';
      },
      meta: {
        headerClassName: 'min-w-[200px]'
      }
    },
    {
      accessorFn: (row) => Number(row.gastoTotal) - 1000, // Saldo Total Disponível
      id: 'saldoDisponivel',
      header: ({ column }) => (
        <DataGridColumnHeader title="Saldo Total Disponível" column={column} />
      ),
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue();
        return typeof value === 'number'
          ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(Math.max(0, value / 100)) // 👈 trata negativos e divide por 100
          : '-';
      },
      meta: {
        headerClassName: 'min-w-[200px]'
      }
    },
    {
      accessorFn: (row) => row.status, // Status
      id: 'status',
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
      enableSorting: true,
      cell: (info) => (
        <span className="badge badge-sm badge-outline">
          {info.row.original.status}
        </span>
      ),
      meta: {
        headerClassName: 'min-w-[130px]'
      }
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
      meta: {
        headerClassName: 'w-[60px]'
      }
    }
  ], []);

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

    const handleOpenModal = () => setShow(true);
    const handleCloseModal = () => setShow(false);

    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">Gestão de Contas</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button size="sm" onClick={handleOpenModal}>
            <KeenIcon icon="plus" />
            Nova Conta
          </Button>

          {/* Modal de criação de cliente */}
          <ModalCreateContasAnuncio open={show} onOpenChange={handleCloseModal} />

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
