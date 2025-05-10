import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toAbsoluteUrl } from '@/utils';
import { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  useQueryClienteContasAnuncio,
  useSetTransacaoClienteContasAnuncio
} from '@/graphql/services/ClienteContaAnuncio';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { TipoTransacao } from '@/graphql/types/ClienteContaAnuncio';
import { AuthContext } from '@/auth/providers/JWTProvider';

interface IModalCreateClienteProps {
  open: boolean;
  onClose: () => void;
}

const ModalMoneyTransfer = ({ open, onClose }: IModalCreateClienteProps) => {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<TipoTransacao | null>(null);
  const [loading, setLoading] = useState(false);

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
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser;

  const handleTipoSelect = (value: TipoTransacao) => {
    setTipo(value);
  };

  const handleClose = () => {
    setStep(1);
    setTipo(null);
    onClose();
  };

  const getTitle = () => {
    if (step === 1) return 'Movimentação';
    if (tipo === 'ENTRADA') return 'Movimentação de Entrada';
    if (tipo === 'REALOCACAO') return 'Movimentação de Realocação';
    if (tipo === 'SAIDA') return 'Movimentação de Saída';
    return 'Movimentação';
  };

  const formik = useFormik({
    initialValues: {
      contaOrigemId: 0,
      contaDestinoId: null,
      valor: '',
      tipoTransacao: ''
    },
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      if (!tipo) return;

      setLoading(true);
      try {
        await createTransacaoClienteContasAnuncio({
          clienteId,
          contaOrigemId: values.contaOrigemId,
          contaDestinoId: tipo === 'REALOCACAO' ? values.contaDestinoId : null, // 👈 sempre passa null para não realocação
          tipo,
          valor: values.valor,
          usuarioId: currentUser!.id
        });

        toast.success('✅ Transação realizada com sucesso!');
        setStatus(null);
        resetForm();
        handleClose();
      } catch (error: any) {
        console.error(error);
        toast.message('❌ Erro ao realizar movimentação', {
          description: error?.message || 'Ocorreu um erro inesperado.'
        });
        setStatus('Erro ao realizar movimentação');
      }
      setLoading(false);
      setSubmitting(false);
    }
  });

  const renderStepContent = () => {
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

    return (
      <form onSubmit={formik.handleSubmit} className="w-full">
        {tipo === 'ENTRADA' && (
          <div className="w-full flex flex-col">
            <div className="w-full flex flex-col gap-2 mb-4">
              <label htmlFor="contaOrigemId">Conta:</label>
              <select
                id="contaOrigemId" // Certifique-se de que o id e name estão corretos
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
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="valor">Valor do depósito:</label>
              <input
                id="valor"
                name="valor"
                type="text"
                className="px-4 py-1 border-b-2"
                placeholder="Insira seu valor aqui"
                value={formik.values.valor}
                onChange={formik.handleChange}
              />
            </div>

            <hr className="mt-4" />
          </div>
        )}
        {tipo === 'REALOCACAO' && (
          <div className="w-full flex flex-col">
            <div className="w-full flex flex-col gap-2 mb-4">
              <label htmlFor="contaOrigemId">Conta de origem:</label>
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
            </div>

            <div className="w-full flex flex-col gap-2 mb-4">
              <label htmlFor="contaDestinoId">Conta de destino:</label>
              <select
                id="contaDestinoId"
                name="contaDestinoId"
                className="w-full rounded-md border px-4 py-2 shadow-sm"
                value={formik.values.contaDestinoId !== null ? formik.values.contaDestinoId : ''}
                onChange={(e) => formik.setFieldValue('contaDestinoId', Number(e.target.value))}
              >
                <option value="">Selecione</option>
                {data?.GetContasAssociadasPorCliente.result.map((conta: any) => (
                  <option key={conta.id} value={Number(conta.id)}>
                    {conta.contaAnuncio.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="valor">Valor da realocação:</label>
              <input
                id="valor"
                name="valor"
                type="text"
                className="px-4 py-1 border-b-2"
                placeholder="Insira seu valor aqui"
                value={formik.values.valor}
                onChange={formik.handleChange}
              />
            </div>

            <hr className="mt-4" />
          </div>
        )}
        {tipo === 'SAIDA' && (
          <div className="w-full flex flex-col">
            <div className="w-full flex flex-col gap-2 mb-4">
              <label htmlFor="contaOrigemId">Conta:</label>
              <select
                id="contaOrigemId" // Certifique-se de que o id e name estão corretos
                name="contaOrigemId"
                className="w-full rounded-md border px-4 py-2 shadow-sm"
                value={formik.values.contaOrigemId}
                onChange={(e) => formik.setFieldValue('contaOrigemId', Number(e.target.value))}
              >
                <option value="">Selecione</option>
                {data?.GetContasAssociadasPorCliente.result
                  .filter((conta) => conta.contaAnuncio.status === 101)
                  .map((conta: any) => (
                    <option key={conta.id} value={Number(conta.id)}>
                      {conta.contaAnuncio.nome}
                    </option>
                  ))}
              </select>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="valor">Valor do saque:</label>
              <input
                id="valor"
                name="valor"
                type="text"
                className="px-4 py-1 border-b-2"
                placeholder="Insira seu valor aqui"
                value={formik.values.valor}
                onChange={formik.handleChange}
              />
            </div>

            <hr className="mt-4" />
          </div>
        )}
      </form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col items-center pt-6 pb-10">
          {step === 1 && (
            <img
              src={toAbsoluteUrl('/media/illustrations/22.svg')}
              className="dark:hidden max-h-[120px] mb-6"
              alt=""
            />
          )}

          {renderStepContent()}

          {/* Botões de ação */}
          <div className="flex justify-between mt-10 w-full">
            {step === 1 ? (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Fechar
                </Button>
                <Button onClick={() => tipo && setStep(2)} disabled={!tipo}>
                  Avançar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button onClick={formik.submitForm} disabled={loading || formik.isSubmitting}>
                  {loading ? 'Finalizando...' : 'Finalizar'}
                </Button>
              </>
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalMoneyTransfer };
