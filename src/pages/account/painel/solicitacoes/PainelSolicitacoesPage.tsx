import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { PainelSolicitacoesContent } from '.';
import { useLayout } from '@/providers';

const PainelSolicitacoesPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <PageNavbar />

      {currentLayout?.name === 'demo4-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-700">Painel de Solicitações</span>
                  <span className="size-0.75 bg-gray-600 rounded-full"></span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}

      <Container>
        <PainelSolicitacoesContent />
      </Container>
    </Fragment>
  );
};

export { PainelSolicitacoesPage };
