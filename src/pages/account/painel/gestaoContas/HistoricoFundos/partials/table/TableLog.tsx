import { useMemo, useState } from 'react';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
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
import { useParams } from 'react-router-dom';
import { useGetContaAnuncioPix } from '@/graphql/services/ContaAnuncioPix';
import { Button } from '@/components/ui/button';
import { FaPix } from 'react-icons/fa6';

// 🧱 Novo componente: Modal simples
const PixDetailsModal = ({ pix, onClose }: { pix: any; onClose: () => void }) => {
  const [isApproving, setIsApproving] = useState(false);

  if (!pix) return null;

  const copyCode = async () => {
    await navigator.clipboard.writeText(pix.codigoCopiaCola);
    toast.success('Código PIX copiado!');
  };

  const handleApprovePix = async () => {
    try {
      setIsApproving(true);
      // 🔧 Simulação da requisição (substitua pela mutation real)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Solicitação de aprovação enviada com sucesso!');
    } catch (err) {
      toast.error('Erro ao solicitar aprovação.');
    } finally {
      setIsApproving(false);
    }
  };

  // Fecha se clicar fora, mas só se não estiver em requisição
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isApproving) return;
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative animate-fade-in">
        {/* X de Fechar */}
        <button
          onClick={() => !isApproving && onClose()}
          disabled={isApproving}
          className={`absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition ${
            isApproving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <KeenIcon icon="close" />
        </button>

        {/* Título */}
        <h2 className="text-lg font-semibold text-center mb-4 flex items-center justify-center gap-2">
          <KeenIcon icon="money" style="duotone" className="text-primary-600" />
          Detalhes do PIX
        </h2>

        {/* Conteúdo */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={pix.imageUrl}
            alt="QR Code PIX"
            className="w-48 h-48 border rounded-xl shadow-sm"
          />

          <div className="relative bg-gray-100 p-3 rounded-lg text-xs font-mono break-all w-full">
            {pix.codigoCopiaCola}
            <button
              onClick={copyCode}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              title="Copiar código"
            >
              <KeenIcon icon="copy" />
            </button>
          </div>

          {/* Ações */}
          <div className="flex flex-col w-full gap-2">
            <Button
              className="w-full"
              variant="secondary"
              onClick={copyCode}
              disabled={isApproving}
            >
              <KeenIcon icon="copy" />
              Copiar Código PIX
            </Button>
            <Button
              className="w-full"
              variant="default"
              onClick={handleApprovePix}
              disabled={isApproving}
            >
              {isApproving ? (
                <>
                  <KeenIcon icon="spinner" className="animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <FaPix /> Solicitar Aprovação
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableHistoryMetaPix = () => {
  const { id } = useParams();
  const { data } = useGetContaAnuncioPix({
    accountId: id,
    pagination: { pagina: null, quantidade: null }
  });

  console.log('Dados PIX recebidos:', data?.GetContaAnuncioFundos.result);

  // 📦 Estado para modal de detalhes
  const [selectedPix, setSelectedPix] = useState<any | null>(null);

  // 🧩 Colunas personalizadas (sem imagem/código direto)
  const columns = useMemo<ColumnDef<any>[]>(
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
        accessorKey: 'accountName',
        header: ({ column }) => <DataGridColumnHeader title="Conta" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <KeenIcon icon="briefcase" className="text-primary-600" />
            <span>{row.original.accountName}</span>
          </div>
        ),
        meta: { headerClassName: 'min-w-[200px] text-center' }
      },
      {
        accessorKey: 'valor',
        header: ({ column }) => <DataGridColumnHeader title="Valor (R$)" column={column} />,
        cell: ({ row }) => (
          <span className="font-semibold text-success-600">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(row.original.valor)}
          </span>
        ),
        meta: { headerClassName: 'min-w-[150px] text-center' }
      },
      {
        accessorKey: 'tipoRetorno',
        header: ({ column }) => <DataGridColumnHeader title="Tipo Retorno" column={column} />,
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.tipoRetorno === 'APROVACAO'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {row.original.tipoRetorno ?? '—'}
          </span>
        ),
        meta: { headerClassName: 'min-w-[140px] text-center' }
      },
      {
        accessorKey: 'dataPagamento',
        header: ({ column }) => <DataGridColumnHeader title="Data Pagamento" column={column} />,
        cell: ({ row }) =>
          row.original.dataPagamento
            ? new Date(row.original.dataPagamento).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
            : '—',
        meta: { headerClassName: 'min-w-[140px] text-center' }
      },
      {
        accessorKey: 'bmNome',
        header: ({ column }) => <DataGridColumnHeader title="Business Manager" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <KeenIcon icon="briefcase" className="text-primary-600" />
            <span>{row.original.bmNome}</span>
          </div>
        ),
        meta: { headerClassName: 'min-w-[200px] text-center' }
      },
      {
        accessorKey: 'usuarioNome',
        header: ({ column }) => <DataGridColumnHeader title="Operador" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <KeenIcon icon="user" className="text-gray-500" />
            <span>{row.original.usuarioNome}</span>
          </div>
        ),
        meta: { headerClassName: 'min-w-[180px] text-center' }
      },

      {
        id: 'details',
        header: () => 'Ações',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedPix(row.original)}
            title="Ver Detalhes PIX"
            className="btn btn-icon btn-light btn-clear btn-sm hover:bg-primary-50"
          >
            <KeenIcon icon="eye" style="duotone" />
          </button>
        ),
        meta: { headerClassName: 'w-[80px] text-center' }
      }
    ],
    []
  );

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} selecionado(s).`, {
        description: `IDs: ${selectedRowIds.join(', ')}`,
        action: { label: 'Desfazer', onClick: () => console.log('Desfazer') }
      });
    }
  };

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header flex-wrap px-5 py-4 border-b-0 bg-gray-50">
        <h3 className="card-title text-lg font-semibold text-gray-800 flex items-center gap-2">
          <KeenIcon icon="money" style="duotone" className="text-primary-600" />
          Histórico de Fundos (PIX)
        </h3>
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
        data={data?.GetContaAnuncioFundos.result}
        rowSelection={true}
        onRowSelectionChange={handleRowSelection}
        pagination={{ size: 10 }}
        sorting={[{ id: 'valor', desc: true }]}
        toolbar={<Toolbar />}
        layout={{ card: true }}
      />

      {/* Modal PIX */}
      {selectedPix && <PixDetailsModal pix={selectedPix} onClose={() => setSelectedPix(null)} />}
    </>
  );
};

export { TableHistoryMetaPix };
