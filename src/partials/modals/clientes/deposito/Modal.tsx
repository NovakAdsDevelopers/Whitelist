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
}

const ModalMoneyDeposit = ({ open, onClose, clienteId, usuarioId }: IModalCreateClienteProps) => {
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
  const { fee, refetch } = useClient();

  const handleClose = () => onClose();

  const parseAmount = (amount: string): number => {
    const cleaned = amount.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    const floatValue = parseFloat(cleaned);
    return parseFloat(floatValue.toFixed(2)); // sempre retorna um number com 2 casas decimais (se existirem)
  };

  const feePercent = tipo === 'ENTRADA' ? Number(fee) / 100 || 0 : 0;
  const valorNumerico = parseAmount(depositAmount);
  const feeAmount = tipo === 'ENTRADA' ? Math.round(valorNumerico * feePercent) : 0;
  const totalAmount = tipo === 'ENTRADA' ? valorNumerico - feeAmount : 0;

  const handleSubmit = async () => {
    if (
      !clienteId ||
      !usuarioId ||
      !tipo ||
      isNaN(valorNumerico) ||
      valorNumerico <= 0 ||
      !dataTransacao
    ) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    try {
      await createClienteTransacao({
        clienteId,
        usuarioId,
        tipo: tipo.toUpperCase(),
        valor: valorNumerico,
        fee: tipo === 'ENTRADA' ? (fee ? `${fee}%` : '0') : null,
        valorAplicado: tipo === 'ENTRADA' ? totalAmount : null,
        dataTransacao: formattedDate
      });

      toast.success('✅ Movimentação realizada com sucesso!');
      refetch();
      handleClose();
    } catch (err: any) {
      toast.error('❌ Erro ao realizar movimentação', {
        description: err.message || 'Ocorreu um erro inesperado.'
      });
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
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Finalizar
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalMoneyDeposit };
