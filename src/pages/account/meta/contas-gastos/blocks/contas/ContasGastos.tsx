/* eslint-disable prettier/prettier */
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
import { IAtualizaçãoContasAnuncioLogData } from '.';
import { Button } from '@/components/ui/button';
import { metaApi } from '@/services/connection';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ModalAjusteLimite } from '@/partials/modals/ajutes-limite/create';
import { useTempoRestante } from '@/lib/utils';
import { useGetContasAnuncioCredito } from '@/graphql/services/ContasAnuncio';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const ContasTable = () => {
  const { data, refetch } = useGetContasAnuncioCredito({
    pagination: { pagina: 0, quantidade: 1000000 }
  });

  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  async function syncAllAccounts() {
    setIsSyncingAll(true);
    try {
      const res = await metaApi.get('/sync-ads');
      if (res.status === 200) {
        toast.success(res.data.message || 'Sincronização com o Meta concluída!');
        await refetch();
      } else {
        toast.error(res.data.error || 'Erro durante a sincronização com o Meta.');
      }
    } catch {
      toast.error('Erro inesperado ao tentar sincronizar com o Meta.');
    } finally {
      setIsSyncingAll(false);
    }
  }

  async function syncAccount(conta_anuncio_id: string) {
    setIsSyncing(true);
    try {
      const res = await metaApi.get(`/sync-ads/${conta_anuncio_id}`);
      if (res.status === 200) {
        toast.success(res.data.message || 'Sincronização com o Meta concluída!');
        await refetch();
      } else {
        toast.error(res.data.error || 'Erro ao sincronizar com o Meta.');
      }
    } catch {
      toast.error('Erro inesperado.');
    } finally {
      setIsSyncing(false);
    }
  }

  const contasAnunciosData: IAtualizaçãoContasAnuncioLogData[] = useMemo(() => {
    return (
      data?.GetAllContasAnuncioSpends?.result?.map((conta) => ({
        id: conta.id,
        nome: conta.nome,
        status: conta.status,
        moeda: conta.moeda,
        fusoHorario: conta.fusoHorario,
        gastoDiario: conta.gastoDiario,
        limiteGasto: conta.limiteGasto,
        saldo: conta.saldo,
        depositoTotal: conta.depositoTotal,
        ultimaSincronizacao: conta.ultimaSincronizacao
      })) || []
    );
  }, [data]);

  const ColumnInputFilter = <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => (
    <Input
      placeholder="Filtrar..."
      value={(column.getFilterValue() as string) ?? ''}
      onChange={(e) => column.setFilterValue(e.target.value)}
      className="h-9 w-full max-w-40"
    />
  );

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
          const gasto = Math.round(Number(row.gastoDiario)) || 0;
          return gasto;
        },
        id: 'saldoDisponivel',
        header: ({ column }) => <DataGridColumnHeader title="Gasto Diário" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();
          return typeof value === 'number'
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value / 100)
            : '-';
        },
        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        id: 'a_inserir',
        header: ({ column }) => <DataGridColumnHeader title="FEE" column={column} />,
        cell: (info) => {
          const row = info.row.original;
          
          const aInserir = 0;

          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(aInserir / 100);
        },
        meta: { headerClassName: 'min-w-[120px]' }
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

          if (diffMins < 1) label = 'há menos de 1m';
          else if (diffMins < 60) label = `há ${diffMins}m`;
          else if (diffMins < 480) label = `há ${Math.floor(diffMins / 60)}h`;
          else label = 'há mais de 8h';

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
          const conta_anuncio_id = row.original.id;
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

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedAccountId(conta_anuncio_id);
                  setOpenModal(true);
                }}
              >
                <KeenIcon icon="setting-4" />
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setSelectedAccountId(conta_anuncio_id);
                  setOpenModal(true);
                }}
              >
                <KeenIcon icon="wallet" />
              </Button>
            </div>
          );
        },
        enableSorting: false,
        meta: { headerClassName: 'min-w-[160px]' }
      }
    ],
    [isSyncing]
  );

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedIds = Object.keys(state);
    if (selectedIds.length > 0) {
      toast(`Total de ${selectedIds.length} selecionadas.`, {
        description: `IDs selecionados: ${selectedIds.join(', ')}`,
        action: { label: 'Desfazer', onClick: () => console.log('Undo') }
      });
    }
  };

  const Toolbar = () => {
    const { minutos, segundos } = useTempoRestante();
    const { table } = useDataGrid();

    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">Gestão Contas de Crédito</h3>

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
    <>
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

      <ModalAjusteLimite
        contaAnuncioID={selectedAccountId ?? ''}
        open={openModal}
        onOpenChange={() => setOpenModal(false)}
      />
    </>
  );
};

export { ContasTable };
