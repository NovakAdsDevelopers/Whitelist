import { useFormik } from 'formik';
import clsx from 'clsx';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useSetIntegracao } from '@/graphql/services/Integracao';

// util: hoje em YYYY-MM-DD (para o atributo max do input)
const todayStr = () => new Date().toISOString().slice(0, 10);

// util: início do dia em UTC a partir de YYYY-MM-DD (evita skew de timezone)
const startOfDayUtcIso = (yyyyMmDd: string) =>
  new Date(`${yyyyMmDd}T00:00:00Z`).toISOString();

const createClientSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .required('Título é obrigatório'),
  client_id: Yup.string().required('client_id é obrigatório'),
  secret_id: Yup.string().required('secret_id é obrigatório'),
  last_token: Yup.string().nullable(),
  spend_date: Yup.string()
    .required('Data dos gastos é obrigatória')
    .test('is-valid-date', 'Data inválida', (v) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v)),
});

const initialValues = {
  title: '',
  client_id: '',
  secret_id: '',
  last_token: '',
  // input date trabalha com string YYYY-MM-DD
  spend_date: '',
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
        const payload = {
          ...values,
          // normaliza para início do dia UTC: do dia selecionado até agora
          spend_date: startOfDayUtcIso(values.spend_date),
        };

        const result = await createIntegracao({ data: payload });

        toast.message('✅ Registro criado com sucesso!', {
          description: `Título: ${result?.SetIntegracao?.id || values.title}`,
        });

        onOpenChange(false);
      } catch (err: any) {
        toast.message('❌ Erro ao criar registro', {
          description: err.message || 'Ocorreu um erro inesperado.',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form className="w-full space-y-4" onSubmit={formik.handleSubmit} noValidate>
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900">Título</label>
        <label className="input">
          <input
            placeholder="Digite o título"
            autoComplete="off"
            {...formik.getFieldProps('title')}
            className={clsx('form-control', {
              'is-invalid': formik.touched.title && formik.errors.title,
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
              'is-invalid': formik.touched.client_id && formik.errors.client_id,
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
              'is-invalid': formik.touched.secret_id && formik.errors.secret_id,
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
            placeholder="Digite o last_token"
            autoComplete="off"
            {...formik.getFieldProps('last_token')}
            className={clsx('form-control', {
              'is-invalid': formik.touched.last_token && formik.errors.last_token,
            })}
          />
        </label>
        {formik.touched.last_token && formik.errors.last_token && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors.last_token}
          </span>
        )}
      </div>

      {/* Data dos Gastos */}
      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900">Data dos gastos</label>
        <label className="input">
          <input
            type="date"
            max={todayStr()}
            // opcional: defina um min se quiser restringir
            // min="2020-01-01"
            {...formik.getFieldProps('spend_date')}
            className={clsx('form-control', {
              'is-invalid': formik.touched.spend_date && formik.errors.spend_date,
            })}
          />
        </label>
        <span className="text-gray-500 text-xs mt-1">
          Essa data será utilizada para buscar os gastos — considerando do início do dia selecionado até o dia atual.
        </span>
        {formik.touched.spend_date && formik.errors.spend_date && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors.spend_date}
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
  );
};

export { FormCreateIntegracao };
