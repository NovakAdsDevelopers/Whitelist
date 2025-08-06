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
import { IContasAnuncioLogData } from './ContasAnuncioLogData';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQueryClienteContasAnuncio } from '@/graphql/services/ClienteContaAnuncio';
import { ModalAssociateAccount } from '@/partials/modals/clientes/associar-conta';
import { useClient } from '@/auth/providers/ClientProvider';
import ModalMoneyTransfer from '@/partials/modals/clientes/contas/Modal';
import { Database, Loader2 } from 'lucide-react';
import { metaApi } from '@/services/connection';
import { ModalClienteContaAnuncioEdit } from '@/partials/modals/cliente-conta-anuncio/edit';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

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

  const [isSyncing, setIsSyncing] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleEditClick = (id: string) => {
    setSelectedId(id);
    setOpenModalEdit(true);
  };

  const { data, loading, refetch } = useQueryClienteContasAnuncio(variables);

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
        saldo: item.saldo,
        idAssociacao: item.id.toString()
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

  const columns = useMemo<ColumnDef<IContasAnuncioLogData>[]>(() => {
    const formatCurrency = (value: number) =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);

    return [
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
          return typeof value === 'number' && !isNaN(value) ? formatCurrency(value) : '-';
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
          return typeof value === 'number' && !isNaN(value) ? formatCurrency(value) : '-';
        },
        meta: { headerClassName: 'min-w-[200px]' }
      },
      {
        accessorFn: (row) => row.saldo,
        id: 'saldoDisponivel',
        header: ({ column }) => <DataGridColumnHeader title="Saldo Disponível" column={column} />,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();
          return typeof value === 'number' && !isNaN(value) ? formatCurrency(value) : '-';
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
        cell: ({ row }) => {
          const conta_anuncio_id = row.original.id;
          const idAssociacao = row.original.idAssociacao;

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

              <Button onClick={() => handleEditClick(idAssociacao)} variant="light" size="sm">
                <KeenIcon icon="setting-4" />
              </Button>

              <Link
                to={`/meta/${conta_anuncio_id}/insights`}
                title="Contas de Anúncio"
                className="btn btn-icon btn-light btn-clear btn-sm"
              >
                <Button variant="light" size="sm">
                  <KeenIcon icon="data" />
                </Button>
              </Link>
            </div>
          );
        },
        meta: { headerClassName: 'w-[60px]' }
      }
    ];
  }, []);

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

  const Toolbar = ({ contas }: { contas: IContasAnuncioLogData[] }) => {
    const { table } = useDataGrid();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [syncingAll, setSyncingAll] = useState(false);
    const { name, setClientInfo } = useClient();
    const { id } = useParams();

    useEffect(() => {
      if (id) setClientInfo(Number(id));
    }, [id]);

    const handleSyncAll = async () => {
      const ids = contas.map((c) => c.id);
      if (ids.length === 0) {
        toast.warning('Nenhuma conta para sincronizar.');
        return;
      }

      setSyncingAll(true);
      try {
        const res = await metaApi.post('/sync-ads-by-ids', {
          account_ids: ids
        });

        if (res.status === 200) {
          toast.success(res.data.message || 'Contas sincronizadas com sucesso!');
        } else {
          toast.error(res.data.error || 'Erro ao sincronizar contas.');
        }
      } catch (err) {
        toast.error('Erro inesperado ao sincronizar contas.');
      } finally {
        setSyncingAll(false);
      }
    };

    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">{name ? 'Cliente: ' + name : ''}</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="light" size="sm" onClick={handleSyncAll} disabled={syncingAll}>
            {syncingAll ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <KeenIcon icon="arrows-circle" />
                Sincronizar
              </>
            )}
          </Button>
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
    <>
      <DataGrid
        columns={columns}
        data={contasAnunciosData}
        rowSelection={true}
        onRowSelectionChange={handleRowSelection}
        pagination={{ size: 10 }}
        sorting={[{ id: 'timestamp', desc: false }]}
        toolbar={<Toolbar contas={contasAnunciosData} />}
        layout={{ card: true }}
        messages={{
          loading: true,
          empty: loading ? (
            <div className="text-center flex justify-center items-center flex-col w-full text-muted-foreground text-sm">
              <Loader2 className="animate-spin text-muted-foreground" />
              Carregando contas de anúncio...
            </div>
          ) : (
            <div className="text-center flex justify-center items-center flex-col w-full text-muted-foreground text-sm">
              <Database className="text-muted-foreground pb-2" />
              Nenhuma conta associada ao cliente
            </div>
          )
        }}
      />

      {/* Modal de edição de conta de anúncio */}
      <ModalClienteContaAnuncioEdit
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
        id={selectedId}
        idCliente={id!}
      />
    </>
  );
};

export { ContasAnuncioLog };
