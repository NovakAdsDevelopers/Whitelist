import { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useQuery } from '@apollo/client';
import { PainelRelatorioLineChartTypes } from '@/graphql/types/PainelRelatorio';
import { GET_PANEL_INSIGHTS_LINE_CHART } from '@/graphql/schemas/PainelRelatorio';

const EarningsChart = () => {
  const [type, setType] = useState<'week' | 'mounth' | 'tree-mouth' | 'year'>('mounth');
  const { data, refetch } = useQuery<PainelRelatorioLineChartTypes>(GET_PANEL_INSIGHTS_LINE_CHART, {
    variables: { type }
  });

  const [charData, setCharData] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (data?.GetInsightsGastosPeriodos) {
      setCharData(data.GetInsightsGastosPeriodos.data);
      setCategories(data.GetInsightsGastosPeriodos.categories);
    }
  }, [data]);

  const options: ApexOptions = {
    series: [
      {
        name: 'Earnings',
        data: charData
      }
    ],
    chart: {
      height: 250,
      type: 'area',
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: ['#1e3a8a']
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      },
      crosshairs: {
        position: 'front',
        stroke: {
          color: '#1e3a8a',
          width: 1,
          dashArray: 3
        }
      }
    },
    yaxis: {
      min: 0,
      tickAmount: 5,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        },
        formatter: (val) => `$${val}K`
      }
    },
    tooltip: {
      enabled: true,
      custom({ series, seriesIndex, dataPointIndex }) {
        const value = series[seriesIndex][dataPointIndex] * 1000;
        const month = categories[dataPointIndex];
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);

        return `
          <div class="flex flex-col gap-2 p-3.5">
            <div class="font-medium text-2sm text-gray-600">${month}, 2024 Sales</div>
            <div class="flex items-center gap-1.5">
              <div class="font-semibold text-md text-gray-900">${formatted}</div>
              <span class="badge badge-outline badge-success badge-xs">+24%</span>
            </div>
          </div>
        `;
      }
    },
    markers: {
      size: 0,
      colors: ['#bfdbfe'],
      strokeColors: ['#1e3a8a'],
      strokeWidth: 4,
      hover: { size: 8 }
    },
    fill: {
      gradient: {
        opacityFrom: 0.25,
        opacityTo: 0
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 5,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Gastos total por periodo</h3>
        <div className="flex items-center gap-5">
          
          <Select
            defaultValue={type}
            onValueChange={(value) => {
              setType(value as typeof type);
              refetch({ type: value });
            }}
          >
            <SelectTrigger className="w-32" size="sm">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="w-32">
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="mounth">Mês atual</SelectItem>
              <SelectItem value="tree-mouth">Últimos 3 meses</SelectItem>
              <SelectItem value="year">Ano atual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="px-2 pb-1">
        {charData.length > 0 && (
          <ApexChart
            id="earnings_chart"
            options={options}
            series={options.series}
            type="area"
            height={250}
          />
        )}
      </div>
    </div>
  );
};

export { EarningsChart };
