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
      <div className="relative w-full bg-white py-2">
        <Link
          to={'/meta/clientes'}
          className="group absolute left-10 top-[-50px] flex items-center justify-center gap-1"
        >
          <KeenIcon icon="exit-left" className="text-xl" />
          <span className="text-lg group-hover:underline">Voltar</span>
        </Link>
      </div>

      <Container>
        <ContasAnuncioContent />
      </Container>
    </Fragment>
  );
};

export { AnaliseClientePage };
