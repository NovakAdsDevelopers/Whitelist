import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { PainelIntegracoesContent } from '.';
import { useLayout } from '@/providers';
import { KeenIcon } from '@/components';

const PainelIntegracoesPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <KeenIcon icon="share" className="text-2xl" />
          <span className="text-lg text-gray-700">Painel de Integrações</span>
        </div>
        <PainelIntegracoesContent />
      </Container>
    </Fragment>
  );
};

export { PainelIntegracoesPage };
