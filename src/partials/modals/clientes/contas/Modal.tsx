import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/alert-dialog-confirm';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  useQueryClienteContasAnuncio,
  useSetTransacaoClienteContasAnuncio
} from '@/graphql/services/ClienteContaAnuncio';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { TipoTransacao } from '@/graphql/types/ClienteContaAnuncio';
import { AuthContext } from '@/auth/providers/JWTProvider';
import { useClient } from '@/auth/providers/ClientProvider';
import { useQueryClienteByID } from '@/graphql/services/Cliente';
import { KeenIcon } from '@/components';

interface IModalCreateClienteProps {
  open: boolean;
  onClose: () => void;
}

/* -------- Input de moeda (centavos no estado) ---------- */
const InputCurrency = ({
  value,
  onChange
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    const numeric = Number(cleaned) / 100;
    onChange(numeric);
  };

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);

  return (
    <input
      type="text"
      value={formatted}
      onChange={handleChange}
      className="px-4 py-2 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Insira o valor aqui"
    />
  );
};
/* ------------------------------------------------------- */

const ModalMoneyTransfer = ({ open, onClose }: IModalCreateClienteProps) => {
  /* ---------------------- state ---------------------- */
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<TipoTransacao | null>(null);
  const [loading, setLoading] = useState(false);
  const [saldoContaOrigem, setSaldoContaOrigem] = useState<number | null>(null);

  /* ---------------------- dados ---------------------- */
  const { refetch, refetchAssociadas } = useClient();
  const { id } = useParams<{ id: string }>();
  const clienteId = Number(id);

  const variables = useMemo(
    () => ({
      clienteId,
      pagination: {
        pagina: 0,
        quantidade: 100000
      }
    }),
    [clienteId]
  );

  const { data } = useQueryClienteContasAnuncio(variables);
  const { createTransacaoClienteContasAnuncio } = useSetTransacaoClienteContasAnuncio(clienteId);
  const { data: dataCliente } = useQueryClienteByID(clienteId);
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser;

  /* ------------------- helpers ----------------------- */
  const handleTipoSelect = (value: TipoTransacao) => {
    setTipo(value);
    setStep(2);
  };

  const handleClose = () => {
    setStep(1);
    setTipo(null);
    setSaldoContaOrigem(null);
    onClose();
  };

  const getTitle = () => {
    if (step === 1) return 'Movimentação';
    if (tipo === 'ENTRADA') return 'Movimentação de Entrada';
    if (tipo === 'REALOCACAO') return 'Movimentação de Realocação';
    if (tipo === 'SAIDA') return 'Movimentação de Saída';
    return 'Movimentação';
  };

  /* ------------------- formik ------------------------ */
  const formik = useFormik({
    initialValues: {
      contaOrigemId: 0,
      contaDestinoId: null,
      valor: 0,
      tipoTransacao: ''
    },
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      if (!tipo) return;

      setLoading(true);
      try {
        const payload = {
          clienteId,
          contaOrigemId: values.contaOrigemId,
          contaDestinoId: tipo === 'REALOCACAO' ? values.contaDestinoId : null,
          tipo,
          valor: Math.round(values.valor * 100),
          usuarioId: currentUser!.id
        };

        await createTransacaoClienteContasAnuncio(payload);

        toast.success('✅ Transação realizada com sucesso!');
        refetch();
        refetchAssociadas();
        setStatus(null);
        resetForm();
        handleClose();
      } catch (err: any) {
        toast.message('❌ Erro ao processar a transação', {
          description: err?.graphQLErrors?.[0]?.message || err?.message || 'Erro desconhecido.'
        });
        setStatus(err?.message);
      }

      setLoading(false);
      setSubmitting(false);
    }
  });

  /* ------------ side-effects auxiliares -------------- */
  useEffect(() => {
    if ((tipo === 'SAIDA' || tipo === 'REALOCACAO') && formik.values.contaOrigemId && data) {
      const contaSelecionada = data.GetContasAssociadasPorCliente.result.find(
        (c: any) => c.id === formik.values.contaOrigemId
      );
      setSaldoContaOrigem(contaSelecionada?.saldo ?? null);
    } else {
      setSaldoContaOrigem(null);
    }
  }, [formik.values.contaOrigemId, tipo, data]);

  useEffect(() => {
    if (open) {
      formik.resetForm();
      setStep(1);
      setTipo(null);
      setSaldoContaOrigem(null);
    }
  }, [open]);

  /* ------------ validações de negócio --------------- */
  const isValorMaiorQueSaldoCliente =
    tipo === 'ENTRADA' &&
    formik.values.valor > Number(dataCliente?.GetCliente.saldoCliente || 0) / 100;

  const canConfirm =
    !loading &&
    formik.values.contaOrigemId &&
    formik.values.valor > 0 &&
    !((tipo !== 'ENTRADA' && Number(saldoContaOrigem) < 0) || isValorMaiorQueSaldoCliente);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const descricaoConfirmacao = (
    <p>
      Você realmente deseja&nbsp;
      <strong
        className={
          tipo === 'ENTRADA'
            ? 'text-primary'
            : tipo === 'REALOCACAO'
              ? 'text-yellow-600'
              : 'text-red-600'
        }
      >
        {tipo === 'ENTRADA' ? 'DEPOSITAR' : tipo === 'REALOCACAO' ? 'REALOCAR' : 'SACAR'}
      </strong>
      &nbsp;
      {formatCurrency(formik.values.valor)}?
    </p>
  );

  /* ------------------- JSX step ---------------------- */
  const renderStepContent = () => {
    /* etapa 1 – escolher tipo */
    if (step === 1) {
      return (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground mb-4">Selecione o tipo de transação:</p>
          <div className="flex gap-2">
            <Button
              variant={tipo === 'ENTRADA' ? 'default' : 'outline'}
              onClick={() => handleTipoSelect(TipoTransacao.ENTRADA)}
            >
              Entrada
            </Button>
            <Button
              variant={tipo === 'REALOCACAO' ? 'default' : 'outline'}
              onClick={() => handleTipoSelect(TipoTransacao.REALOCACAO)}
            >
              Realocação
            </Button>
            <Button
              variant={tipo === 'SAIDA' ? 'default' : 'outline'}
              onClick={() => handleTipoSelect(TipoTransacao.SAIDA)}
            >
              Saída
            </Button>
          </div>
        </div>
      );
    }

    /* etapa 2 – formulário */
    return (
      <form onSubmit={formik.handleSubmit} className="w-full">
        <div className="w-full flex flex-col">
          {/* saldo do cliente para entrada */}
          {tipo === 'ENTRADA' && (
            <div className="flex justify-end items-center gap-1">
              <KeenIcon icon="dollar" className="text-primary text-lg" />
              <span className="text-sm">
                Saldo disponível:&nbsp;
                {(Number(dataCliente?.GetCliente.saldoCliente || 0) / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </div>
          )}

          {/* conta origem */}
          <div className="w-full flex flex-col gap-2 mb-4">
            <label htmlFor="contaOrigemId" className="text-sm">
              {tipo === 'REALOCACAO' ? 'Conta de origem:' : 'Conta:'}
            </label>
            <select
              id="contaOrigemId"
              name="contaOrigemId"
              className="w-full rounded-md border px-4 py-2 shadow-sm"
              value={formik.values.contaOrigemId}
              onChange={(e) => formik.setFieldValue('contaOrigemId', Number(e.target.value))}
            >
              <option value="">Selecione</option>
              {data?.GetContasAssociadasPorCliente.result.map((conta: any) => (
                <option key={conta.id} value={Number(conta.id)}>
                  {conta.contaAnuncio.nome}
                </option>
              ))}
            </select>

            {/* saldo da conta origem, se aplicável */}
            {saldoContaOrigem !== null && (
              <p
                className={`text-sm mt-1 ${
                  Number(saldoContaOrigem) < 0 ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                Saldo disponível:&nbsp;
                {(Number(saldoContaOrigem || 0) / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            )}
          </div>

          {/* conta destino em caso de realocação */}
          {tipo === 'REALOCACAO' && (
            <div className="w-full flex flex-col gap-2 mb-4">
              <label htmlFor="contaDestinoId" className="text-sm">
                Conta de destino:
              </label>
              <select
                id="contaDestinoId"
                name="contaDestinoId"
                className="w-full rounded-md border px-4 py-2 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={formik.values.contaDestinoId ?? ''}
                onChange={(e) => formik.setFieldValue('contaDestinoId', Number(e.target.value))}
                disabled={Number(saldoContaOrigem) < 0}
              >
                <option value="">Selecione</option>
                {data?.GetContasAssociadasPorCliente.result.map((conta: any) => (
                  <option key={conta.id} value={Number(conta.id)}>
                    {conta.contaAnuncio.nome}
                  </option>
                ))}
              </select>
              {Number(saldoContaOrigem) < 0 && (
                <p className="text-xs text-red-600 mt-1">
                  Conta de origem sem saldo disponível para realocação.
                </p>
              )}
            </div>
          )}

          {/* valor */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="valor" className="text-sm">
              Valor:
            </label>
            <InputCurrency
              value={formik.values.valor}
              onChange={(newValue) => formik.setFieldValue('valor', newValue)}
            />
          </div>

          {/* mensagens de erro */}
          {formik.status && <div className="text-sm text-red-500 mt-2">{formik.status}</div>}
          {isValorMaiorQueSaldoCliente && (
            <p className="text-xs mt-2 text-red-600">
              O valor inserido é maior que o saldo disponível do cliente.
            </p>
          )}

          <hr className="mt-4" />
        </div>

        {/* botão de confirmação com ConfirmDialog */}
        <div className="flex justify-end mt-4">
          <ConfirmDialog
            title="Confirmar operação?"
            description={descricaoConfirmacao}
            action={() => formik.submitForm()}
            textAction="Sim, confirmar"
            textCancel="Voltar"
            disabled={!canConfirm}
            delayMs={3000}
          >
            <Button type="button" disabled={!canConfirm} className="disabled:opacity-60">
              {loading ? 'Processando...' : 'Confirmar'}
            </Button>
          </ConfirmDialog>
        </div>
      </form>
    );
  };

  /* -------------------- render ----------------------- */
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <DialogBody>{renderStepContent()}</DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export default ModalMoneyTransfer;
