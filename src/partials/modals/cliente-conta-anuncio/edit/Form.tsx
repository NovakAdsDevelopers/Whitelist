import React, { useEffect, useMemo, useState } from 'react';
import { usePutClienteContasAnuncio, useQueryContasAnuncioAssociada } from '@/graphql/services/ClienteContaAnuncio';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  onClose: () => void;
  contaId: string;
}

const FormClienteContaAnuncioEdit = ({ onClose, contaId }: Props) => {
  const variables = useMemo(() => ({ id: contaId }), [contaId]);

  const { data, loading: isLoading } = useQueryContasAnuncioAssociada(variables);
  const { updateClienteContaAnuncio, loading: isSaving } = usePutClienteContasAnuncio();

  const [form, setForm] = useState({
    nomeConta: '',
    dataInicio: '',
    dataFim: ''
  });

  useEffect(() => {
    const assoc = data?.GetClienteContaAnuncioById;
    if (assoc) {
      setForm({
        nomeConta: assoc.contaAnuncio.nome || '',
        dataInicio: assoc.dataInicio?.substring(0, 10) || '',
        dataFim: assoc.dataFim?.substring(0, 10) || ''
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateClienteContaAnuncio({
        where: { id: contaId },
        data: {
          dataInicio: form.dataInicio,
          dataFim: form.dataFim || null
        }
      });

      toast.success('Associação atualizada com sucesso!');
      onClose();
    } catch (error: any) {
      toast.error('Erro ao salvar alterações.', {
        description: error.message || 'Erro inesperado.'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {isLoading ? (
        <p>Carregando dados da associação...</p>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <label className="form-label">Nome da Conta</label>
            <Input value={form.nomeConta} disabled />
          </div>

          <div className="flex flex-col gap-1">
            <label className="form-label">Data de Início</label>
            <input
              type="date"
              value={form.dataInicio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dataInicio: e.target.value }))
              }
              className="form-control"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="form-label">Data de Fim</label>
            <input
              type="date"
              value={form.dataFim}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dataFim: e.target.value }))
              }
              className="form-control"
            />
          </div>

          <div className="w-full flex justify-end pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export { FormClienteContaAnuncioEdit };
