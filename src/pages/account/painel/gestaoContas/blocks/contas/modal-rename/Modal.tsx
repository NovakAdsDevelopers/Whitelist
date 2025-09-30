import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { metaApi } from '@/services/connection';

interface ModalRenameAdAccountProps {
  open: boolean;
  onClose: () => void;
  adAccountId: string; // id no path param
}

const ModalRenameAdAccount: React.FC<ModalRenameAdAccountProps> = ({
  open,
  onClose,
  adAccountId,
}) => {
  const [name, setName] = useState('');
  const [initialName, setInitialName] = useState(''); // caso queira bloquear salvar se não mudou
  const [submitting, setSubmitting] = useState(false);

  // se quiser pré-carregar o nome atual da conta, faça aqui
  // (comente se não houver endpoint para isso)
  useEffect(() => {
    if (!open) return;
    // Ex.: metaApi.get(`/adaccount/${adAccountId}`)
    // .then(res => setName(res.data?.name ?? ''))
    // .then(() => setInitialName(res.data?.name ?? ''))
    // .catch(() => setName(''));
    // Por enquanto, limpa o campo ao abrir:
    setName('');
    setInitialName('');
  }, [open, adAccountId]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const canConfirm =
    !submitting && name.trim().length > 0 && name.trim() !== initialName.trim();

  const handleSubmit = async () => {
    const newName = name.trim();
    if (!newName) {
      toast.error('Informe um nome válido.');
      return;
    }
    if (newName === initialName.trim()) {
      toast.message('O nome não foi alterado.');
      return;
    }

    try {
      setSubmitting(true);

      // id no params (path), nome no body JSON
      const res = await metaApi.post(`/adaccount/${adAccountId}/rename`, { newName: newName });

      if (res.status !== 200) {
        throw new Error(res.data?.error || 'Erro ao renomear a conta.');
      }

      toast.success(res.data?.message || 'Conta renomeada com sucesso!');

      // avisa globalmente que renomeou (pai pode ouvir e refetch)
      window.dispatchEvent(
        new CustomEvent('adaccount:renamed', {
          detail: { id: adAccountId, newName },
        })
      );

      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao renomear a conta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[420px] bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Renomear conta de anúncio
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col px-6 py-6 space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="adaccount-name" className="text-sm font-medium text-gray-700">
              Novo nome
            </label>
            <input
              id="adaccount-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o novo nome da conta"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              autoFocus
              disabled={submitting}
            />
            <p className="text-xs text-gray-500">
              Dica: use um padrão consistente para facilitar buscas e relatórios.
            </p>
          </div>

          <div className="flex justify-between gap-4 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              disabled={submitting}
            >
              Fechar
            </Button>

            <Button
              onClick={handleSubmit}
              className="w-full py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              disabled={!canConfirm}
            >
              Salvar
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalRenameAdAccount };
