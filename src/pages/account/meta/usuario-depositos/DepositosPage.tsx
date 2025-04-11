import { Fragment } from 'react';

import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';

import { DepositosContent } from './DepositosContent';

const DepositosPage = () => {
  return (
    <Fragment>
      <PageNavbar />

      <Container>
        <DepositosContent />
      </Container>
    </Fragment>
  );
};

export { DepositosPage };
