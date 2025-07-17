import { Fragment } from 'react';
import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';

import { AtualizacaoGastosContent } from '.';
import { useLayout } from '@/providers';

const AtualizacaoGastosPage = () => {

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <AtualizacaoGastosContent />
      </Container>
    </Fragment>
  );
};

export { AtualizacaoGastosPage };
