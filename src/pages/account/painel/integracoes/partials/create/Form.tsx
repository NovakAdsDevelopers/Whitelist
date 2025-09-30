import { useFormik } from 'formik';
import clsx from 'clsx';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useSetIntegracao } from '@/graphql/services/Integracao';

const createClientSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .required('Título é obrigatório'),

  client_id: Yup.string().required('client_id é obrigatório'),
  secret_id: Yup.string().required('secret_id é obrigatório'),
  last_token: Yup.string().nullable(),

  cor: Yup.string()
    .matches(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Cor deve ser um HEX válido')
    .nullable()
    .default('#000000'),

  img: Yup.string().url('URL da imagem inválida').nullable()
});

const initialValues = {
  title: '',
  client_id: '',
  secret_id: '',
  last_token: '',
  cor: '#000000',
  img: ''
};

interface Props {
  onOpenChange: (open: boolean) => void;
}

const FormCreateIntegracao = ({ onOpenChange }: Props) => {
  const { createIntegracao, loading } = useSetIntegracao();

  const formik = useFormik({
    initialValues,
    validationSchema: createClientSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await createIntegracao({ data: values });

        toast.message('✅ Registro criado com sucesso!', {
          description: `Título: ${result?.SetIntegracao?.id || values.title}`
        });

        onOpenChange(false);
      } catch (err: any) {
        toast.message('❌ Erro ao criar registro', {
          description: err.message || 'Ocorreu um erro inesperado.'
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <>
      <form className="w-full space-y-4" onSubmit={formik.handleSubmit} noValidate>
         {/* Preview da imagem */}
      {formik.values.img?.trim() && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview da imagem</h4>
          <div className="border rounded-lg p-3 flex items-center justify-center bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formik.values.img}
              alt="Preview"
              className="max-h-48 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Título</label>
          <label className="input">
            <input
              placeholder="Digite o título"
              autoComplete="off"
              {...formik.getFieldProps('title')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.title && formik.errors.title
              })}
            />
          </label>
          {formik.touched.title && formik.errors.title && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.title}
            </span>
          )}
        </div>

        {/* Client ID */}
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Client ID</label>
          <label className="input">
            <input
              placeholder="Digite o client_id"
              autoComplete="off"
              {...formik.getFieldProps('client_id')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.client_id && formik.errors.client_id
              })}
            />
          </label>
          {formik.touched.client_id && formik.errors.client_id && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.client_id}
            </span>
          )}
        </div>

        {/* Secret ID */}
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Secret ID</label>
          <label className="input">
            <input
              placeholder="Digite o secret_id"
              autoComplete="off"
              {...formik.getFieldProps('secret_id')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.secret_id && formik.errors.secret_id
              })}
            />
          </label>
          {formik.touched.secret_id && formik.errors.secret_id && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.secret_id}
            </span>
          )}
        </div>

        {/* Last Token (opcional) */}
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Last Token</label>
          <label className="input">
            <input
              placeholder="Digite o last_token (opcional)"
              autoComplete="off"
              {...formik.getFieldProps('last_token')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.last_token && formik.errors.last_token
              })}
            />
          </label>
          {formik.touched.last_token && formik.errors.last_token && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.last_token}
            </span>
          )}
        </div>

        {/* Cor */}
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900 flex items-center justify-between">
            <span>Cor</span>
            <span className="font-mono text-xs">{formik.values.cor}</span>
          </label>
          <input
            type="color"
            value={formik.values.cor || '#000000'}
            onChange={(e) => formik.setFieldValue('cor', e.target.value)}
            className={clsx('h-10 w-16 rounded border', {
              'ring-1 ring-red-500': formik.touched.cor && formik.errors.cor
            })}
            onBlur={() => formik.setFieldTouched('cor', true)}
          />
          {formik.touched.cor && formik.errors.cor && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.cor as string}
            </span>
          )}
        </div>

        {/* URL da Imagem */}
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">URL da Imagem</label>
          <label className="input">
            <input
              placeholder="https://exemplo.com/sua-imagem.png"
              autoComplete="off"
              {...formik.getFieldProps('img')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.img && formik.errors.img
              })}
            />
          </label>
          {formik.touched.img && formik.errors.img && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.img as string}
            </span>
          )}
        </div>

        {/* Botão */}
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="btn btn-primary flex justify-center grow"
            disabled={loading || formik.isSubmitting}
          >
            {loading || formik.isSubmitting ? 'Aguarde...' : 'Criar Registro'}
          </button>
        </div>
      </form>

     
    </>
  );
};

export { FormCreateIntegracao };
