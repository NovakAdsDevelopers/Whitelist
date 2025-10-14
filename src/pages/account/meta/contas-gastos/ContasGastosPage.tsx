import { Fragment } from 'react';
import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';

import { ContasGastosContent } from '.';
import { useLayout } from '@/providers';

const ContasGastosPage = () => {

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <ContasGastosContent />
      </Container>
    </Fragment>
  );
};

export { ContasGastosPage };
