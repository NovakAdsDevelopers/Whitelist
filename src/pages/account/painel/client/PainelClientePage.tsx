import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { PainelClienteContent } from '.';
import { useLayout } from '@/providers';
import { KeenIcon } from '@/components';
import { PanelProvider } from '@/auth/providers/PanelProvider';

const PainelClientePage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo4-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center gap-2">
                  <KeenIcon icon="document" className="text-primary text-lg" />
                  <h1 className="text-lg text-gray-700">Painel de Relatórios</h1>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}

      <Container>
        <PanelProvider>
          <PainelClienteContent />
        </PanelProvider>
      </Container>
    </Fragment>
  );
};

export { PainelClientePage };
