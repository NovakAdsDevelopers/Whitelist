import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';

import { useLayout } from '@/providers';

const IntegracaoPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <PageNavbar />
 
      <Container>

      </Container>
    </Fragment>
  );
};

export { IntegracaoPage };
