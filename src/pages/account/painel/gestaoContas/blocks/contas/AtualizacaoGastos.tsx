/* eslint-disable prettier/prettier */
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Column, ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridColumnVisibility,
  DataGridRowSelect,
  DataGridRowSelectAll,
  useDataGrid
} from '@/components';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { IAtualizaçãoContasAnuncioLogData } from '.';
import { Button } from '@/components/ui/button';
import { useGetContasAnuncio } from '@/graphql/services/ContasAnuncio';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useClient } from '@/auth/providers/ClientProvider';
import { ModalRenameAdAccount } from './modal-rename';
import { FaReceipt } from 'react-icons/fa6';
import { ModalInsertFunds } from './modal-funds';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const GestaoContaLinkCell: React.FC<{ id: number }> = ({ id }) => {
  const { setClientInfo } = useClient();
  return (
    <Link
      to={`/painel/gestao-contas/${id}`}
      onClick={() => setClientInfo(id)}
      title="Contas de Anúncios"
    >
      <Button variant="light" size="sm">
        Abrir
      </Button>
    </Link>
  );
};

const ContasTable = () => {
  const { data, refetch } = useGetContasAnuncio({
    pagination: { pagina: 0, quantidade: 1000000 }
  });

  // ---- estado do modal (props mínimas) ----
  const [openModal, setOpenModal] = useState(false);
  const [openModalInsert, setOpenModalInsert] = useState(false);

  const [selectedAccountId, setSelectedAccountId] = useState<string>(''); // string p/ casar com o modal
  type SelectedAccount = { id: string; name: string, BMId: string };

  const [selectedAccount, setSelectedAccount] = useState<SelectedAccount>({
    id: '',
    name: '',
    BMId: ''
  });

  useEffect(() => {
    const onRenamed = () => {
      refetch?.();
    };
    window.addEventListener('adaccount:renamed', onRenamed as EventListener);
    return () => window.removeEventListener('adaccount:renamed', onRenamed as EventListener);
  }, [refetch]);

  const contasAnunciosData: IAtualizaçãoContasAnuncioLogData[] = useMemo(() => {
    return (
      data?.GetContasAnuncio?.result?.map((conta) => ({
        id: conta.id,
        nome: conta.nome,
        status: conta.status,
        moeda: conta.moeda,
        fusoHorario: conta.fusoHorario,
        gastoTotal: conta.gastoTotal,
        gastoAPI: Number(conta.gastoAPI),
        saldoMeta: conta.saldoMeta,
        limitGasto: conta.limitGasto,
        saldo: conta.saldo,
        depositoTotal: conta.depositoTotal,
        ultimaSincronizacao: conta.ultimaSincronizacao,
        BMId: conta.BMId,
        BM: conta.BM
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

  const openRenameModal = useCallback((id: string) => {
    setSelectedAccountId(String(id)); // garante string
    setOpenModal(true);
  }, []);

  const openInsertFundsModal = useCallback(
    (id: string, nome: string, BMId: string) => {
      setSelectedAccount({ id: String(id), name: String(nome), BMId: String(BMId) }); // garante string
      setOpenModalInsert(true);
    },
    [setSelectedAccount, setOpenModalInsert]
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
        accessorKey: 'bm',
        accessorFn: (row) => row.BM?.nome || 'N/A',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="BM"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => info.getValue(),
        meta: { headerClassName: 'min-w-[180px]' }
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataGridColumnHeader title="Actions" column={column} className="justify-center" />
        ),
        cell: ({ row }) => {
          const contaId = row.original.id;
          const contaName = row.original.nome;
          const contaBM = row.original.BMId;



          return (
            <div className="flex items-center justify-center gap-2">
              <button
                className="bg-gray-800 text-white text-center px-4 py-2 font-semibold rounded-md text-xs"
                onClick={() => openRenameModal(contaId)}
              >
                Renomear
              </button>

              {/* seus outros botões permanecem iguais */}
              <button className="bg-gray-800 text-white text-center px-4 py-2 font-semibold rounded-md text-xs">
                Compartilhar
              </button>
              <button
                className="bg-green-500 text-white text-center px-4 py-2 font-semibold rounded-md text-xs"
                onClick={() => openInsertFundsModal(contaId, contaName,contaBM)}
              >
                Inserir Fundos
              </button>
              <button className="bg-green-500 text-white text-center px-4 py-2 font-semibold rounded-md text-xs">
                Historicos de Fundos
              </button>
              <Link
                to={`/painel/gestao-contas/${contaId}/history`}
                className="bg-green-500 text-white text-center px-4 py-2 font-semibold rounded-md text-xs flex justify-center items-center gap-1"
              >
                <FaReceipt />
                Histórico de Gastos
              </Link>
            </div>
          );
        },
        enableSorting: false
      }
    ],
    [openRenameModal]
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
    const { table } = useDataGrid();
    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">Gestão de Contas</h3>
        <div className="flex flex-wrap items-center gap-2.5">
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

      {/* Modal com props mínimas */}
      <ModalRenameAdAccount
        open={openModal}
        onClose={() => setOpenModal(false)}
        adAccountId={selectedAccountId}
      />

      <ModalInsertFunds
        accountId={selectedAccount.id}
        name={selectedAccount.name}
        businessId={selectedAccount.BMId}
        open={openModalInsert}
        onClose={() => setOpenModalInsert(false)}
      />
    </>
  );
};

export { ContasTable };