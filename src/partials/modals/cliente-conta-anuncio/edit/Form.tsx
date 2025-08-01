import React, { useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

import {
  usePutClienteContasAnuncio,
  useQueryContasAnuncioAssociada
} from '@/graphql/services/ClienteContaAnuncio';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  onClose: () => void;
  idAssociacao: string;
  idCliente: string;
}

const validationSchema = Yup.object().shape({
  dataInicio: Yup.string()
    .required('Data de início é obrigatória')
    .test('valid-date', 'Data de início inválida', (value) => !value || !isNaN(Date.parse(value!))),
  dataFim: Yup.string()
    .nullable()
    .test('valid-date', 'Data de fim inválida', (value) => !value || !isNaN(Date.parse(value)))
    .test('after-start', 'Data de fim deve ser posterior à data de início', function (value) {
      const { dataInicio } = this.parent;
      return !value || new Date(value) >= new Date(dataInicio);
    })
});

const FormClienteContaAnuncioEdit = ({ onClose, idAssociacao, idCliente }: Props) => {
  const variables = useMemo(() => ({ clienteId: Number(idAssociacao) }), [idAssociacao]);

  const { data, loading: isLoading } = useQueryContasAnuncioAssociada(variables);
  const { updateClienteContaAnuncio, loading: isSaving } = usePutClienteContasAnuncio(
    Number(idCliente)
  );

  const formik = useFormik({
    initialValues: {
      nomeConta: '',
      dataInicio: '',
      dataFim: ''
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const inicioAssociacao = `${values.dataInicio}T21:43:00.000Z`;
        const fimAssociacao = values.dataFim ? `${values.dataFim}T23:59:00.000Z` : null;

        await updateClienteContaAnuncio({
          id: idAssociacao,
          inicioAssociacao,
          fimAssociacao
        });

        toast.success('✅ Associação atualizada com sucesso!');
        onClose();
      } catch (error: any) {
        toast.error('❌ Erro ao salvar alterações', {
          description: error.message || 'Erro inesperado.'
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    const assoc = data?.GetContaAssociadaCliente;
    if (assoc) {
      formik.setValues({
        nomeConta: assoc.contaAnuncio?.nome || '',
        dataInicio: assoc.inicioAssociacao
          ? new Date(assoc.inicioAssociacao).toISOString().substring(0, 10)
          : '',
        dataFim: assoc.fimAssociacao
          ? new Date(assoc.fimAssociacao).toISOString().substring(0, 10)
          : ''
      });
    }
  }, [data]);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
      {isLoading ? (
        <p>Carregando dados da associação...</p>
      ) : (
        <>
          {/* Nome da Conta */}
          <div className="flex flex-col gap-1">
            <label className="form-label">Nome da Conta</label>
            <Input
              className="border-2 border-gray-400 px-4 py-2 rounded-md"
              value={formik.values.nomeConta}
              disabled
            />
          </div>

          {/* Data de Início */}
          <div className="flex flex-col gap-1">
            <label className="form-label">Data de Início</label>
            <input
              type="date"
              {...formik.getFieldProps('dataInicio')}
              className={`border-2 border-gray-400 px-4 py-2 rounded-md ${
                formik.touched.dataInicio && formik.errors.dataInicio ? 'is-invalid' : ''
              }`}
            />
            {formik.touched.dataInicio && formik.errors.dataInicio && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.dataInicio}
              </span>
            )}
          </div>

          {/* Data de Fim */}
          <div className="flex flex-col gap-1">
            <label className="form-label">Data de Fim</label>
            <input
              type="date"
              {...formik.getFieldProps('dataFim')}
              className={`border-2 border-gray-400 px-4 py-2 rounded-md ${
                formik.touched.dataFim && formik.errors.dataFim ? 'is-invalid' : ''
              }`}
            />
            {formik.touched.dataFim && formik.errors.dataFim && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.dataFim}
              </span>
            )}
          </div>

          {/* Botão de Ação */}
          <div className="w-full flex justify-end pt-4">
            <Button type="submit" disabled={isSaving || formik.isSubmitting}>
              {isSaving || formik.isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export { FormClienteContaAnuncioEdit };
