import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { useLayout } from '@/providers';
import { ContasAnuncioInsightsContent } from './ContasInsightContent';

const ContasInsightPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <PageNavbar />

      <Container>
        <ContasAnuncioInsightsContent />
      </Container>
    </Fragment>
  );
};

export { ContasInsightPage };
