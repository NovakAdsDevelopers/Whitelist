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
import { IAtualizaçãoContasAnuncioLogData } from '.';
import { Button } from '@/components/ui/button';
import { useGetContasAnuncio } from '@/graphql/services/ContasAnuncio';
import { metaApi } from '@/services/connection';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const ContasTable = () => {
  const { data, refetch } = useGetContasAnuncio({
    pagination: {
      pagina: 0,
      quantidade: 1000000
    }
  });

  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  console.log(isSyncing);
  async function syncAllAccounts() {
    setIsSyncingAll(true);
    try {
      const metaResponse = await metaApi.get('/sync-ads');
      const metaData = metaResponse.data;

      console.log(metaData);

      if (metaResponse.status === 200) {
        toast.success(metaData.message || 'Sincronização com o Meta concluída com sucesso!');
        await refetch(); // 🔁 Refetch aqui
      } else {
        toast.error(metaData.error || 'Erro durante a sincronização com o Meta.');
      }
    } catch (error) {
      toast.error('Erro inesperado ao tentar sincronizar com o Meta.');
    } finally {
      setIsSyncingAll(false);
    }
  }

  async function syncAccount(conta_anuncio_id: string) {
    setIsSyncing(true);
    try {
      const metaResponse = await metaApi.get(`/sync-ads/${conta_anuncio_id}`);
      const metaData = metaResponse.data;

      console.log(metaData);

      if (metaResponse.status === 200) {
        toast.success(metaData.message || 'Sincronização com o Meta concluída com sucesso!');
        await refetch(); // 🔁 Refetch aqui
      } else {
        toast.error(metaData.error || 'Erro durante a sincronização com o Meta.');
      }
    } catch (error) {
      toast.error('Erro inesperado ao tentar sincronizar com o Meta.');
    } finally {
      setIsSyncing(false);
    }
  }

  console.log(data?.GetContasAnuncio.result.length);

  const contasAnunciosData: IAtualizaçãoContasAnuncioLogData[] = useMemo(() => {
    return (
      data?.GetContasAnuncio?.result?.map((conta) => ({
        id: conta.id,
        nome: conta.nome,
        status: conta.status,
        moeda: conta.moeda,
        fusoHorario: conta.fusoHorario,
        gastoTotal: conta.gastoTotal,
        saldoMeta: conta.saldoMeta,
        limitGasto: conta.limitGasto,
        saldo: conta.saldo,
        depositoTotal: conta.depositoTotal,
        ultimaSincronizacao: conta.ultimaSincronizacao
      })) || []
    );
  }, [data]);
  console.log(contasAnunciosData.length);

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

  const columns = useMemo<ColumnDef<IAtualizaçãoContasAnuncioLogData>[]>(
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
        accessorKey: 'conta_de_anuncio',
        accessorFn: (row) => row.nome,
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Conta"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => info.getValue(),
        meta: { headerClassName: 'min-w-[180px]' }
      },
      {
        accessorFn: (row) => {
          const deposito = Number(row.depositoTotal) || 0;
          const gasto = Number(row.gastoTotal) || 0;
          return deposito - gasto; // centavos
        },
        id: 'saldoDisponivel',
        header: ({ column }) => <DataGridColumnHeader title="Saldo Disponível" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();
          return typeof value === 'number'
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value / 100) // 💰 convertido de centavos para reais
            : '-';
        },
        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        accessorKey: 'saldoMeta',
        accessorFn: (row) => Number(row.saldoMeta) || 0,
        header: ({ column }) => <DataGridColumnHeader title="No Meta" column={column} />,
        cell: (info) => {
          const value = info.getValue();
          return typeof value === 'number'
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value / 100)
            : '-';
        },
        meta: { headerClassName: 'min-w-[130px]' }
      },
      {
        id: 'a_inserir',
        header: ({ column }) => <DataGridColumnHeader title="A Inserir" column={column} />,
        cell: (info) => {
          const row = info.row.original;
          const deposito = Number(row.depositoTotal) || 0;
          const gasto = Number(row.gastoTotal) || 0;
          const saldoDisponivel = deposito - gasto;
          const saldoMeta = Number(row.saldoMeta) || 0;

          const aInserir = Math.max(saldoDisponivel - saldoMeta, 0);

          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(aInserir / 100);
        },
        meta: {
          headerClassName: 'min-w-[120px]'
        }
      },
      {
        accessorKey: 'ultimaSincronizacao',
        header: ({ column }) => (
          <DataGridColumnHeader title="Última Sincronização" column={column} />
        ),
        cell: (info) => {
          const raw = info.getValue() as string;
          const date = new Date(raw);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 1000 / 60);

          let label = '';
          if (diffMins < 1) {
            label = 'há menos de 1m';
          } else if (diffMins < 60) {
            label = `há ${diffMins}m`;
          } else if (diffMins < 480) {
            const hours = Math.floor(diffMins / 60);
            label = `há ${hours}h`;
          } else {
            label = 'há mais de 8h';
          }

          const fullDate = date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge>{label}</Badge>
                </TooltipTrigger>
                <TooltipContent>{format(new Date(raw), 'dd/MM/yyyy HH:mm')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        meta: { headerClassName: 'min-w-[160px]' }
      },
      {
        id: 'actions',
        header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
        cell: ({ row }) => {
          const conta_anuncio_id = row.original.id; // ou outro nome do campo
          return (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => syncAccount(conta_anuncio_id)}
                variant={isSyncing ? 'default' : 'light'}
                size="sm"
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <KeenIcon icon="arrows-circle" />
                )}
              </Button>

              <Button variant="green" size="sm">
                <KeenIcon icon="dollar" />
              </Button>
            </div>
          );
        },
        enableSorting: false,
        meta: { headerClassName: 'min-w-[160px]' }
      }
    ],
    []
  );

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
          <Button variant="default" size="sm" onClick={syncAllAccounts} disabled={isSyncingAll}>
            {isSyncingAll ? (
              <>
                <KeenIcon icon="loader" className="animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <KeenIcon icon="arrows-circle" />
                Sincronizar
              </>
            )}
          </Button>
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
      sorting={[{ id: 'ultimaSincronizacao', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { ContasTable };
