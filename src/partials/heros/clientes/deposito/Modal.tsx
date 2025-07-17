import React, { useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSetClienteTransacao } from '@/graphql/services/ClienteTransacao';
import { useClient } from '@/auth/providers/ClientProvider';
import { addHours, format } from 'date-fns';
import { ConfirmDialog } from '@/components/ui/alert-dialog-confirm';

// Componente de input para valores em moeda (BRL)
const InputCurrency = ({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/\D/g, '');
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(cleanedValue) / 100);
    onChange(formattedValue);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      className="px-4 py-2 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Insira o valor aqui"
    />
  );
};

interface IModalCreateClienteProps {
  open: boolean;
  onClose: () => void;
  clienteId: number;
  usuarioId: number;
  refetch: any;
}

const ModalMoneyDeposit = ({
  open,
  onClose,
  clienteId,
  usuarioId,
  refetch
}: IModalCreateClienteProps) => {
  const [depositAmount, setDepositAmount] = useState<string>('R$ 0,00');
  const [tipo, setTipo] = useState<string | null>(null);
  // Pega a data atual
  const dataTransacao = new Date(); // Data local no seu fuso horário

  // Ajusta para o fuso horário de São Paulo (UTC -3 horas)
  const saoPauloDate = addHours(dataTransacao, -3);

  // Formata a data para o formato ISO
  const formattedDate = format(saoPauloDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

  console.log(formattedDate); // Exemplo: "2025-04-15T21:20:40.271Z"

  const { createClienteTransacao, loading } = useSetClienteTransacao(usuarioId);
  const { fee } = useClient();

  const handleClose = () => onClose();

  const parseAmount = (amount: string): number => {
    const cleaned = amount.replace(/\D/g, ''); // remove tudo que não for dígito
    return Number(cleaned);
  };

  const feePercent = tipo === 'ENTRADA' ? Number(fee) / 100 || 0 : 0;
  const valorNumerico = parseAmount(depositAmount);
  const feeAmount = tipo === 'ENTRADA' ? Math.round(valorNumerico * feePercent) : 0;
  const totalAmount = tipo === 'ENTRADA' ? valorNumerico - feeAmount : 0;

  /* =========  condição para liberar o botão de CONFIRMAÇÃO ========= */
  const canConfirm = !loading && !!tipo && parseAmount(depositAmount) > 0;

  const handleSubmit = async () => {
    const valorEmCentavos = parseAmount(depositAmount);

    if (
      !clienteId ||
      !usuarioId ||
      !tipo ||
      isNaN(valorEmCentavos) ||
      valorEmCentavos <= 0 ||
      !dataTransacao
    ) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    const feeValue = tipo === 'ENTRADA' ? (fee ? `${fee}%` : '0') : null;
    const valorAplicado =
      tipo === 'ENTRADA' ? valorEmCentavos - Math.round(valorEmCentavos * (feePercent || 0)) : null;

    const payload = {
      clienteId,
      usuarioId,
      tipo: tipo.toUpperCase(),
      valor: valorEmCentavos,
      fee: feeValue,
      valorAplicado,
      dataTransacao: formattedDate
    };

    console.log('Enviando payload:', payload);

    try {
      await createClienteTransacao(payload);
      toast.success('Transação criada com sucesso!');
      refetch(); // atualiza os dados do cliente
      handleClose(); // fecha o modal
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes('network')) {
        toast.error('Não foi possível conectar à API. Verifique sua conexão com a internet.');
      } else if (err?.message) {
        toast.error(`Erro: ${err.message}`);
      } else {
        toast.error('Erro inesperado ao criar transação.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[400px] bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">Movimentações</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col px-6 py-8 space-y-6">
          <div className="w-full flex flex-col gap-4">
            {/* Tipo de Transação */}
            <div className="flex flex-col gap-2">
              <label htmlFor="transaction-type" className="text-sm font-medium text-gray-700">
                Tipo:
              </label>
              <select
                id="transaction-type"
                value={tipo || ''}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              >
                <option value="">Selecione</option>
                <option value="ENTRADA">Depósito</option>
                <option value="SAIDA">Saque</option>
              </select>
            </div>

            {/* Valor do Depósito */}
            <div className="flex flex-col gap-2">
              <label htmlFor="deposit-amount" className="text-sm font-medium text-gray-700">
                Valor
              </label>
              <InputCurrency
                value={depositAmount}
                onChange={(newValue) => setDepositAmount(newValue)}
              />
            </div>

            {tipo === 'ENTRADA' && (
              <>
                <hr className="border-gray-200 my-4" />
                <div className="w-full space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">Resumo da operação</h2>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Fee ({(feePercent * 100).toFixed(0)}%)</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(feeAmount / 100)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Valor Bruto</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(valorNumerico / 100)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Valor Aplicado (descontado)</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(totalAmount / 100)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-between gap-4 mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Fechar
            </Button>

            <ConfirmDialog
              title="Confirmar operação?"
              description={
                tipo ? (
                  <div className="space-y-1 text-left">
                    <p>
                      Você realmente deseja&nbsp;
                      <strong className={tipo === 'ENTRADA' ? 'text-primary' : 'text-red-500'}>
                        {tipo === 'ENTRADA' ? 'DEPOSITAR' : 'SACAR'}
                      </strong>
                      &nbsp;
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(parseAmount(depositAmount) / 100)}
                      ?
                    </p>
                    {tipo === 'ENTRADA' && (
                      <p>
                        Valor líquido após taxa do FEE:{' '}
                        <strong className="text-primary">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(totalAmount / 100)}
                        </strong>
                      </p>
                    )}
                  </div>
                ) : null /* não renderiza se undefined */
              }
              action={handleSubmit}
              textAction="Sim, confirmar"
              textCancel="Voltar"
              disabled={!canConfirm} // só libera quando preenchido
              delayMs={3000}
            >
              {/* O gatilho pode ser qualquer elemento */}
              <Button
                className="w-full py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-60"
                disabled={!canConfirm}
              >
                Finalizar
              </Button>
            </ConfirmDialog>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalMoneyDeposit };
