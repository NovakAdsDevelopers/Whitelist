import { useFormik } from 'formik';
import clsx from 'clsx';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useSetCliente } from '@/graphql/services/Cliente';
import CNPJInput from '@/components/ui/InputCNPJ';

const createClientSchema = Yup.object().shape({
  nome: Yup.string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .required('Nome é obrigatório'),

  email: Yup.string()
    .email('Formato de email inválido')
    .required('Email é obrigatório'),

  cnpj: Yup.string()
    .required('Documento é obrigatório')
    .matches(/^\d+$/, 'Documento deve conter apenas números')
    .max(30, 'Documento deve ter no máximo 30 dígitos'),

  fee: Yup.number()
    .typeError('Fee deve ser um número válido')
    .min(0, 'A porcentagem deve ser no mínimo 0%')
    .max(100, 'A porcentagem deve ser no máximo 100%')
    .required('Fee é obrigatório')
});

const initialValues = {
  nome: '',
  email: '',
  cnpj: '',
  fee: 0
};

interface Props {
  onOpenChange: (open: boolean) => void;
  refetch: any;
}

const FormCreateCliente = ({ onOpenChange, refetch }: Props) => {
  const { createCliente, loading } = useSetCliente();

  const formik = useFormik({
    initialValues,
    validationSchema: createClientSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Garantir que o documento seja apenas números
        const cnpj = values.cnpj.replace(/\D/g, '');
        const fee = values.fee.toString();

        const result = await createCliente({
          data: { ...values, cnpj, fee }
        });

        toast.message('✅ Cliente criado com sucesso!', {
          description: `Nome: ${result?.SetCliente?.nome || values.nome}`
        });

        onOpenChange(false);
        refetch()
      } catch (err: any) {
        toast.message('❌ Erro ao criar cliente', {
          description: err.message || 'Ocorreu um erro inesperado.'
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <form className="w-full space-y-4" onSubmit={formik.handleSubmit} noValidate>
      
      {/* Nome */}
      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900">Nome</label>
        <label className="input">
          <input
            placeholder="Digite o nome"
            autoComplete="off"
            {...formik.getFieldProps('nome')}
            className={clsx('form-control', {
              'is-invalid': formik.touched.nome && formik.errors.nome
            })}
          />
        </label>
        {formik.touched.nome && formik.errors.nome && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors.nome}
          </span>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900">Email</label>
        <label className="input">
          <input
            type="email"
            placeholder="Digite o email"
            autoComplete="off"
            {...formik.getFieldProps('email')}
            className={clsx('form-control', {
              'is-invalid': formik.touched.email && formik.errors.email
            })}
          />
        </label>
        {formik.touched.email && formik.errors.email && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors.email}
          </span>
        )}
      </div>

      {/* Documento (CNPJ genérico) */}
      <CNPJInput
        name="cnpj"
        value={formik.values.cnpj || ''}
        onChange={formik.setFieldValue}
        onBlur={() => formik.setFieldTouched('cnpj', true)}
        touched={formik.touched.cnpj}
        error={formik.errors.cnpj}
      />

      {/* Fee como slider */}
      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 flex justify-between">
          <span>Fee (%)</span>
          <span className="text-primary font-medium">
            {Number(formik.values.fee).toFixed(1)}%
          </span>
        </label>

        <input
          type="range"
          min={0}
          max={100}
          step={0.1} // permite valores quebrados: 4.5, 3.7 etc.
          value={formik.values.fee}
          onChange={(e) =>
            formik.setFieldValue('fee', parseFloat(e.target.value))
          }
          className="range range-primary"
        />

        {formik.touched.fee && formik.errors.fee && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors.fee}
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
          {loading || formik.isSubmitting ? 'Aguarde...' : 'Criar Cliente'}
        </button>
      </div>
    </form>
  );
};

export { FormCreateCliente };
