import { useFormik } from 'formik';
import clsx from 'clsx';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useSetCliente } from '@/graphql/services/Cliente';

const createClientSchema = Yup.object().shape({
  nome: Yup.string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .required('Nome é obrigatório'),
  email: Yup.string().email('Formato de email inválido').required('Email é obrigatório')
});

const initialValues = {
  nome: '',
  email: ''
};

interface Props {
  onOpenChange: (open: boolean) => void;
}

const FormCreateCliente = ({ onOpenChange }: Props) => {
  const { createCliente, loading } = useSetCliente();

  const formik = useFormik({
    initialValues,
    validationSchema: createClientSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await createCliente({ data: values });

        toast.message('✅ Cliente criado com sucesso!', {
          description: `Nome: ${result?.SetCliente?.nome || values.nome}`
        });

        onOpenChange(false); // fecha o modal
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
      {/* Campo Nome */}
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

      {/* Campo Email */}
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
