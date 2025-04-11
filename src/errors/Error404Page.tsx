import useBodyClasses from '@/hooks/useBodyClasses';
import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

const Error404Page = () => {
  useBodyClasses('dark:bg-coal-500');

  return (
    <Fragment>
      <div className="mb-10">
        <img
          src={toAbsoluteUrl('/media/illustrations/19.svg')}
          className="dark:hidden max-h-[160px]"
          alt="image"
        />
        <img
          src={toAbsoluteUrl('/media/illustrations/19-dark.svg')}
          className="light:hidden max-h-[160px]"
          alt="image"
        />
      </div>

      <span className="badge badge-primary badge-outline mb-3">Erro 404</span>

      <h3 className="text-2.5xl font-semibold text-gray-900 text-center mb-2">
        Perdemos esta página
      </h3>

      <div className="text-md text-center text-gray-700 mb-10">
      A página solicitada está faltando. Verifique a URL ou.&nbsp;
        <Link to="/" className="text-primary font-medium hover:text-primary-active">
          Retorne para Home
        </Link>
        .
      </div>
    </Fragment>
  );
};

export { Error404Page };
