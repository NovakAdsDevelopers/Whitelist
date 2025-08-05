import { KeenIcon } from '@/components';
import { Options, IOptionsItems } from '../../home/get-started';
import { Card } from './partials/Card';
import { FilterPeriod } from './partials/FilterPeriod';
import { EarningsChart } from './partials/EarningChart';
import { PieChart } from './partials/PieChart';
import { TableRanking } from './partials/table/TableLog';
import { usePanel } from '@/auth/providers/PanelProvider';

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

const DashoboardMetaContent = () => {
  const { gastoTotal, saldo, saldoMeta, contasAtivas, contasInativas } = usePanel();
  const totalContas = contasAtivas + contasInativas;
  const percentualComSaldo =
    totalContas > 0 ? ((contasAtivas / totalContas) * 100).toFixed(2) : '0.00';
  return (
    <>
      <FilterPeriod />
      <div className="grid grid-cols-12 gap-4 mt-4 auto-rows-auto">
        {/* Dois cards lado a lado: 4 + 4 */}
        <Card
          className="col-span-4"
          title="Gasto Total"
          value={formatBRL(gastoTotal)}
          icon={<KeenIcon icon="dollar" className="text-primary" />}
          subtitle={`${contasAtivas} contas em atividade`}
        />
        <Card
          className="col-span-4"
          title="Saldo Total"
          value={formatBRL(saldo)}
          icon={<KeenIcon icon="dollar" className="text-primary" />}
          subtitle={`VERIFICAR inseridos no período`}
        />

        {/* Card da direita ocupando altura das duas linhas */}
        <Card
          className="col-span-4 row-span-2"
          title="Saldo no Meta"
          icon={<KeenIcon icon="bar-chart" className="text-primary" />}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-full flex justify-between text-center">
                <span>
                  <span className="w-3 h-3 bg-opacity-100 bg-primary rounded-full inline-block mr-1"></span>
                  {contasAtivas} Contas Ativas
                </span>
                <span>
                  <span className="w-3 h-3 bg-opacity-100 bg-gray-800 rounded-full inline-block mr-1"></span>
                  {contasInativas} Contas Inativas
                </span>
              </div>
            </div>
            <PieChart />
            <div className="flex justify-between mt-4 text-sm">
              <span>Saldo total no meta:</span>
              <span className="font-semibold">{formatBRL(saldoMeta)}</span>
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <span>Percetual contas ativas:</span>
              <span className="font-semibold">{percentualComSaldo}%</span>
            </div>
          </div>
        </Card>

        {/* Chart abaixo dos dois primeiros cards */}
        <div className="col-span-8">
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

export { DashoboardMetaContent };
