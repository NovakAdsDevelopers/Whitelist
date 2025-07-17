import { Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';
import { DepositosContent } from './DepositosContent';
import { KeenIcon } from '@/components';

const DepositosPage = () => {
  const { id } = useParams(); // <-- captura o ID da URL

  return (
    <Fragment>
      <div className="container-fixed flex justify-start pb-4">
        <Link
          to={`/meta/${id}/contas-anuncio`} // <-- usa o ID na URL
          className="flex items-center justify-center gap-2 px-2 py-1
          rounded-md hover:bg-gray-200 dropdown-open:bg-gray-200 hover:text-primary text-gray-600"
        >
          <KeenIcon icon="exit-left" className="text-lg" />
          <span className="text-md group-hover:underline">Voltar</span>
        </Link>
      </div>

      <Container>
        <DepositosContent />
      </Container>
    </Fragment>
  );
};

export { DepositosPage };
