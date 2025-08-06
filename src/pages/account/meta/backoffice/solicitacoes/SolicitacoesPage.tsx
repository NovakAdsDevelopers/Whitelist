import { Fragment } from 'react';

import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';

import { useLayout } from '@/providers';
import { UsuariosContent } from './SolicitacoesContent';

const SolicitacoesPage = () => {
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

export { SolicitacoesPage };
