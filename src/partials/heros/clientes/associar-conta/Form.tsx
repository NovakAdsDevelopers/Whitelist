import { useState } from 'react';
import { useFormik } from 'formik';
import clsx from 'clsx';
import { Alert } from '@/components';
import ChosenContasAnuncio from './SelectAccount';
import { useSetClienteContasAnuncio } from '@/graphql/services/ClienteContaAnuncio';
import { useParams } from 'react-router';
import { toBrazilISODate } from '@/utils';
import { toast } from 'sonner';

interface IFormCreateClienteProps {
  onOpenChange: () => void;
}
const FormCreateCliente = ({ onOpenChange }: IFormCreateClienteProps) => {
  const { id } = useParams();
  const clienteId = Number(id);

  const { createClienteContasAnuncio } = useSetClienteContasAnuncio(clienteId);
  const [loading, setLoading] = useState(false);

  const [selectedContas, setSelectedContas] = useState<
    {
      label: string;
      value: string;
      dataInicio: string;
      dataFim: string | null;
      hasDataFim: boolean;
    }[]
  >([]);

  const formik = useFormik({
    initialValues: {},
    onSubmit: async (_, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        const contasParaAssociar = selectedContas.map((conta) => ({
          contaAnuncioId: conta.value,
          inicioAssociacao: toBrazilISODate(conta.dataInicio),
          fimAssociacao: conta.hasDataFim ? toBrazilISODate(conta.dataFim!) : null
        }));

        await createClienteContasAnuncio({
          clienteId,
          contas: contasParaAssociar
        });

        // Toast individual para cada conta associada
        selectedContas.forEach((conta) => {
          toast.message('✅ Conta associada com sucesso!', {
            description: `Conta: ${conta.label}`
          });
        });

        setStatus(null);
        resetForm();
        setSelectedContas([]);
        onOpenChange(); // fecha o modal
      } catch (error: any) {
        console.error(error);
        toast.message('❌ Erro ao associar contas', {
          description: error?.message || 'Ocorreu um erro inesperado.'
        });
        setStatus('Erro ao associar contas ao cliente');
      }

      setLoading(false);
      setSubmitting(false);
    }
  });

  return (
    <form className="w-full space-y-4" onSubmit={formik.handleSubmit} noValidate>
      {formik.status && <Alert variant="danger">{formik.status}</Alert>}

      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900">Contas</label>
        <ChosenContasAnuncio
          onChange={(selected) => {
            setSelectedContas((prev) =>
              selected.map((item) => {
                const existing = prev.find((p) => p.value === item.value);
                return {
                  ...item,
                  dataInicio: existing?.dataInicio || '',
                  dataFim: existing?.dataFim || '',
                  hasDataFim: existing?.hasDataFim || false
                };
              })
            );
          }}
        />
      </div>

      {selectedContas.map((conta, index) => (
        <div key={conta.value} className="p-4 border bg-gray-100 rounded-md mt-2">
          <div className="flex border-b items-center pb-2 mb-3 gap-2">
            <span className="text-md">Conta:</span>
            <p className="font-medium text-sm">{conta.label}</p>
          </div>

          <div className="flex items-center justify-end gap-2 mb-2">
            <span className="text-sm">Final previsto?</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={conta.hasDataFim}
                onChange={() => {
                  const updated = [...selectedContas];
                  updated[index].hasDataFim = !updated[index].hasDataFim;
                  if (!updated[index].hasDataFim) {
                    updated[index].dataFim = '';
                  }
                  setSelectedContas(updated);
                }}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200 relative">
                <span
                  className={clsx(
                    'absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200',
                    conta.hasDataFim && 'translate-x-5'
                  )}
                />
              </div>
            </label>
          </div>

          <div
            className={`grid gap-4 ${
              conta.hasDataFim ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            <div>
              <label className="text-xs text-gray-700 mb-1 block">Data Início</label>
              <input
                type="date"
                className="w-full py-2 px-3 rounded-md border form-control"
                value={conta.dataInicio}
                onChange={(e) => {
                  const updated = [...selectedContas];
                  updated[index].dataInicio = e.target.value;
                  setSelectedContas(updated);
                }}
              />
            </div>

            {conta.hasDataFim && (
              <div>
                <label className="text-xs text-gray-700 mb-1 block">Data Fim</label>
                <input
                  type="date"
                  className="w-full py-2 px-3 rounded-md border form-control"
                  value={conta.dataFim || ''}
                  onChange={(e) => {
                    const updated = [...selectedContas];
                    updated[index].dataFim = e.target.value;
                    setSelectedContas(updated);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="w-full flex justify-end">
        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Aguarde...' : 'Associar'}
        </button>
      </div>
    </form>
  );
};

export { FormCreateCliente };
