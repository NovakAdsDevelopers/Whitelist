import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { DashoboardMetaContent } from '.';
import { useLayout } from '@/providers';

const DashboardMetaPage = () => {
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
                <div className="flex text-lg items-center gap-2">
                  <h1>Grade de Horários</h1>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('http://localhost:4005/meta/test-error-sync', {
                          method: 'GET',
                          credentials: 'include' // envia cookies
                        });
                        const data = await res.json().catch(() => ({}));
                        console.log('OK:', res.status, data);
                      } catch (e) {
                        console.error('Falha na requisição:', e);
                      }
                    }}
                  >
                    teste
                  </button>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}

      <Container>
        <DashoboardMetaContent />
      </Container>
    </Fragment>
  );
};

export { DashboardMetaPage };
