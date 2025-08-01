import { KeenIcon } from '@/components';
import { Options, IOptionsItems } from '../../home/get-started';
import { Card } from './partials/Card';
import { FilterPeriod } from './partials/FilterPeriod';
import { EarningsChart } from './partials/EarningChart';
import { PieChart } from './partials/PieChart';
import { TableRanking } from './partials/table/TableLog';

const DashoboardMetaContent = () => {
  return (
    <>
      <FilterPeriod />
      <div className="grid grid-cols-12 gap-4 mt-4 auto-rows-auto">
        {/* Dois cards lado a lado: 4 + 4 */}
        <Card
          className="col-span-4"
          title="Gasto Total"
          value="R$ 819,74"
          icon={<KeenIcon icon="dollar" className="text-primary" />}
          subtitle="4 contas em atividade"
        />
        <Card
          className="col-span-4"
          title="Saldo Total"
          value="R$ 67,890"
          icon={<KeenIcon icon="dollar" className="text-primary" />}
          subtitle="R$ 2.5k Inseridos hoje"
        />

        {/* Card da direita ocupando altura das duas linhas */}
        <Card
          className="col-span-4 row-span-2"
          title="Saldo no Meta"
          icon={<KeenIcon icon="bar-chart" className="text-primary" />}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg">60.00%</span>
              <div className="flex flex-col justify-center text-right">
                <span>
                  <span className="w-3 h-3 bg-opacity-100 bg-primary rounded-full inline-block mr-1"></span>
                  6 contas com saldo
                </span>
                <span>
                  <span className="w-3 h-3 bg-opacity-100 bg-gray-800 rounded-full inline-block mr-1"></span>
                  4 contas sem saldo
                </span>
              </div>
            </div>
            <PieChart />
            <div className="flex justify-between mt-4 text-sm">
              <span>Saldo total no meta:</span>
              <span className="font-semibold">$99,999</span>
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
      <div className='mt-4'>
        <TableRanking />
      </div>
    </>
  );
};

export { DashoboardMetaContent };
