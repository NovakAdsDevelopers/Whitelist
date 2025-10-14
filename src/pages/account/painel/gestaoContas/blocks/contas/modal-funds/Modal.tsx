import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { metaApi } from '@/services/connection';
import { ConfirmDialog } from '@/components/ui/alert-dialog-confirm';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { toAbsoluteUrl } from '@/utils';

interface ModalInsertFundsProps {
  open: boolean;
  onClose: () => void;
  businessId: string;
  accountId: string;
  name: string;
}

// máscara BRL
const formatBRL = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const number = Number(digits) / 100;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
};

export const ModalInsertFunds: React.FC<ModalInsertFundsProps> = ({
  open,
  onClose,
  businessId,
  accountId,
  name
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // ✅ controle dos passos
  const [amountInput, setAmountInput] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // --- MOCK / PIX ESTÁTICO ---
  const [pixData, setPixData] = useState<{ image: string; code: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    setAmountInput('');
    setNote('');
    setStep(1);
    setPixData(null);
  }, [open, businessId, accountId]);

  // pega só dígitos do input mascarado e converte pra número
  const amountNumber = useMemo(() => {
    const digits = amountInput.replace(/\D/g, '');
    if (!digits) return NaN;
    const value = Number(digits) / 100;
    return Number.isFinite(value) ? value : NaN;
  }, [amountInput]);

  const formattedBRL = useMemo(() => {
    if (!Number.isFinite(amountNumber)) return '';
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2
      }).format(amountNumber);
    } catch {
      return '';
    }
  }, [amountNumber]);

  const canConfirm = !submitting && Number.isFinite(amountNumber) && amountNumber > 0.0;

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      toast.error('Informe um valor válido maior que zero.');
      return;
    }

    try {
      setSubmitting(true);
      toast.info('Gerando cobrança PIX...');
      setStep(2); // vai direto para a tela "Gerando PIX..."

      // 🔹 Envia os dados reais
      const payload = {
        business_id: businessId,
        asset_id: accountId,
        account_id: accountId,
        valor: amountNumber, // valor numérico do input
        retornar_base64: false
      };

      const res = await metaApi.post('/payment-meta', payload);

      if (!res?.data?.success || !res.data?.pix) {
        throw new Error(res.data?.error || 'Erro ao gerar PIX.');
      }

      // ✅ Extrai do nó correto
      const { codigo, image_url } = res.data.pix;

      if (!codigo || !image_url) {
        throw new Error('Resposta sem código ou imagem do PIX.');
      }

      // ✅ Atualiza estado com a imagem e o código
      setPixData({
        image: image_url,
        code: codigo
      });

      // 🔹 Passa para a tela final
      setTimeout(() => setStep(3), 1500);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao gerar PIX.');
      setStep(1); // volta ao formulário em caso de falha
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[480px] bg-white rounded-lg shadow-xl overflow-hidden">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-800">Inserir fundos</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col px-6 py-6 space-y-5 text-center">
          {/* =====================================================
            PASSO 1 — Formulário + Confirmação
          ===================================================== */}
          {step === 1 && (
            <>
              <div className="flex flex-col items-center">
                <h2>Você está adicionando fundos na conta:</h2>
                <p className="text-md font-medium text-green-600">{name}</p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="funds-amount" className="text-sm font-medium text-gray-700">
                  Valor a adicionar (BRL)
                </label>
                <input
                  id="funds-amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex.: 1.250,00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(formatBRL(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  disabled={submitting}
                />
                {formattedBRL && <p className="text-xs text-gray-500">Valor: {formattedBRL}</p>}
              </div>

              <div className="flex flex-col gap-2 text-center">
                <label htmlFor="funds-note" className="text-sm font-medium text-gray-700">
                  Observação (opcional)
                </label>
                <textarea
                  id="funds-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex.: Reforço de campanha"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 min-h-[88px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  disabled={submitting}
                />
              </div>

              <div className="flex justify-between gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="w-full"
                  disabled={submitting}
                >
                  Fechar
                </Button>

                <ConfirmDialog
                  title="Confirmar operação?"
                  description={
                    <div className="space-y-1 text-center">
                      <p>
                        Depositar <strong className="text-primary">{formattedBRL}</strong> em{' '}
                        <strong className="text-green-600">{name}</strong>?
                      </p>
                      {note?.trim() && <p className="text-gray-600 italic">“{note.trim()}”</p>}
                    </div>
                  }
                  action={handleSubmit}
                  textAction="Sim, confirmar"
                  textCancel="Cancelar"
                  disabled={!canConfirm}
                >
                  <Button
                    className="w-full py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60"
                    disabled={!canConfirm}
                  >
                    Confirmar
                  </Button>
                </ConfirmDialog>
              </div>
            </>
          )}

          {/* =====================================================
            PASSO 2 — Tela “Gerando PIX...”
          ===================================================== */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 py-8"
            >
              <img
                className="h-[60px] w-[60px] max-w-none animate-spin [transform-origin:50%_50%]"
                src={toAbsoluteUrl('/media/images/new/logo.png')}
                alt="Carregando…"
              />
              <TypeAnimation
                sequence={['Gerando PIX...', 1500, 'Gerando PIX ...', 1500]}
                repeat={Infinity}
                className="text-lg font-semibold text-gray-700"
              />
            </motion.div>
          )}

          {/* =====================================================
            PASSO 3 — PIX Gerado
          ===================================================== */}
          {step === 3 && pixData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <h3 className="text-lg font-semibold text-gray-800">PIX Gerado!</h3>
              <img
                src={pixData.image}
                alt="QR Code PIX"
                className="w-48 h-48 border border-gray-200 rounded-lg shadow-sm"
              />
              <div className="flex flex-col w-full gap-2 mt-4">
                <label className="text-sm text-gray-600">Copia e Cola</label>
                <textarea
                  readOnly
                  value={pixData.code}
                  className="w-full text-xs p-2 border rounded-md bg-gray-50 select-all"
                  rows={3}
                />
              </div>
              <Button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={handleClose}
              >
                Fechar
              </Button>
            </motion.div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
