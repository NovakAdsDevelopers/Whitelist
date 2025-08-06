import { Fragment } from 'react';

import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';

import { useLayout } from '@/providers';
import { UsuariosContent } from './UsuariosContent';

const UsuariosPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <PageNavbar />

      <Container>
        <UsuariosContent />
      </Container>
    </Fragment>
  );
};

export { UsuariosPage };
