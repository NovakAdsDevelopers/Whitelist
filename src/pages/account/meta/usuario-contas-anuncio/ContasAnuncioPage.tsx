import { Fragment } from 'react';
import { Container } from '@/components/container';

import { useLayout } from '@/providers';
import ContasAnuncioContent from './ContasAnuncioContent';
import { KeenIcon } from '@/components';
import { Link } from 'react-router-dom';

const AnaliseClientePage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <div className="container-fixed flex justify-start pb-4">
        <Link
          to={`/meta/clientes`} // <-- usa o ID na URL
          className="flex items-center justify-center gap-2"
        >
          <KeenIcon icon="exit-left" className="text-lg" />
          <span className="text-md group-hover:underline">Voltar</span>
        </Link>
      </div>

      <Container>
        <ContasAnuncioContent />
      </Container>
    </Fragment>
  );
};

export { AnaliseClientePage };
