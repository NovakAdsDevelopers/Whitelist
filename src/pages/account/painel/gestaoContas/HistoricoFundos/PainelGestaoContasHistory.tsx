import { Fragment } from 'react';
import { Container, KeenIcon } from '@/components';
import { TableHistoryMetaPix } from './partials/table/TableLog';
import { PanelProvider } from '@/auth/providers/PanelProvider';

import { useLayout } from '@/providers';
import { Toolbar, ToolbarDescription, ToolbarHeading } from '@/partials/toolbar';
import { AdAccountProvider, useAdAccount } from '@/auth/providers/AdAccountProvider';

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

const HistoricoFundosContent = () => {

  return (
    <>
      <div className="">
        <TableHistoryMetaPix />
      </div>
    </>
  );
};

export function PainelGestaoContasHistoryFunds() {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <AdAccountProvider>
        {currentLayout?.name === 'demo4-layout' && (
          <Container className='mt-6'>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarDescription>
                  <div className="flex items-center gap-2">
                    <KeenIcon icon="document" className="text-primary text-lg" />
                    <h1 className="text-lg text-gray-700">Historico de Fundos: </h1>
                  </div>
                </ToolbarDescription>
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}

        <Container>
          <PanelProvider>
            <HistoricoFundosContent />
          </PanelProvider>
        </Container>
      </AdAccountProvider>
    </Fragment>
  );
}
