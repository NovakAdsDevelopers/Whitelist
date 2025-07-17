import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { PainelResumoContasContent } from '.';
import { useLayout } from '@/providers';

const PainelResumoContasPage = () => {
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
                  <h1 className="text-lg text-gray-700">Painel de Resumo de Contas</h1>
                  <span className="size-0.75 bg-gray-600 rounded-full"></span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}

      <Container>
        <PainelResumoContasContent />
      </Container>
    </Fragment>
  );
};

export { PainelResumoContasPage };
