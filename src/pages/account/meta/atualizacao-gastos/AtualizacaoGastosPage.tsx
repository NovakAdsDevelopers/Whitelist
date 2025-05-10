import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { AtualizacaoGastosContent } from '.';
import { useLayout } from '@/providers';

const AtualizacaoGastosPage = () => {
  const { currentLayout } = useLayout();

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
