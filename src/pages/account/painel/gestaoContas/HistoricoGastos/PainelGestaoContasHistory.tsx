import { Fragment } from 'react';
import { Container, KeenIcon } from '@/components';
import { FilterPeriod } from './partials/FilterPeriod';
import { EarningsChart } from './partials/EarningChart';
import { PieChart } from './partials/PieChart';
import { TableRanking } from './partials/table/TableLog';
import { PanelProvider, usePanel } from '@/auth/providers/PanelProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useQueryBMs } from '@/graphql/services/BMs';
import BMSelectorRS from './partials/BMSelector';
import { useLayout } from '@/providers';
import { Toolbar, ToolbarDescription, ToolbarHeading } from '@/partials/toolbar';
import { formatRangeLabel } from '../../relatorio/until';
import { Card } from './partials/Card';
import { AdAccountProvider, useAdAccount } from '@/auth/providers/AdAccountProvider';

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

const DashoboardMetaContent = () => {
  const {
    gastoTotal,
    saldo,
    saldoMeta,
    startDate,
    endDate
    // BMs,        // removido: não usado
    // setBMs      // removido: não usado
  } = useAdAccount();


  return (
    <>
      <div className="flex items-center justify-between">
        <FilterPeriod />
        <div className="flex items-center gap-5">
          <div>
            <span className="font-semibold underline whitespace-nowrap">
              {formatRangeLabel(startDate, endDate)}
            </span>
          </div>

          {/* seletor de BMs removido da UI, mas import mantido */}
          {false && <BMSelectorRS className="w-auto" />}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-4 auto-rows-auto">
        <Card
          className="col-span-4"
          title="Gasto Total"
          value={formatBRL(gastoTotal)}
          icon={<KeenIcon icon="dollar" className="text-primary" />}
          subtitle={`2 contas em atividade`}
        />
        <Card
          className="col-span-4"
          title="Saldo Total"
          value={formatBRL(saldo)}
          icon={<KeenIcon icon="dollar" className="text-primary" />}
          subtitle={`VERIFICAR inseridos no período`}
        />

        <Card
          className="col-span-4"
          title="Saldo no Meta"
          icon={<KeenIcon icon="bar-chart" className="text-primary" />}
        >
          <div>
            <div className="w-full text-left">
              <span className="text-2xl font-bold text-gray-800">{formatBRL(saldoMeta)}</span>
            </div>
          </div>
        </Card>

        <div className="col-span-12">
          <Card title="" value="" icon={<KeenIcon icon="activity" />}>
            <EarningsChart />
          </Card>
        </div>
      </div>

      <div className="mt-4">
        <TableRanking />
      </div>
    </>
  );
};

export function PainelGestaoContasHistory() {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <AdAccountProvider>
        {currentLayout?.name === 'demo4-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarDescription>
                  <div className="flex items-center gap-2">
                    <KeenIcon icon="document" className="text-primary text-lg" />
                    <h1 className="text-lg text-gray-700">Historico de Gastos: </h1>
                  </div>
                </ToolbarDescription>
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}

        <Container>
          <PanelProvider>
            <DashoboardMetaContent />
          </PanelProvider>
        </Container>
      </AdAccountProvider>
    </Fragment>
  );
}
