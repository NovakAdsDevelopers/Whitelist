import { type MouseEvent, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import { Alert } from '@/components';

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

const FormCreateCliente = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: createClientSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        // Aqui você pode chamar sua API para criar o cliente
        console.log('Cliente criado:', values);

        // Simula o envio e redefinir o estado
        setSubmitting(false);
      } catch (error) {
        setStatus('Erro ao criar o cliente');
        setSubmitting(false);
      }

      setLoading(false);
    }
  });

  return (
    <form className="w-full space-y-4" onSubmit={formik.handleSubmit} noValidate>
      {formik.status && <Alert variant="danger">{formik.status}</Alert>}

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

      <div className='w-full flex justify-end'>
        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Aguarde...' : 'Criar Cliente'}
        </button>
      </div>
    </form>
  );
};

export { FormCreateCliente };
