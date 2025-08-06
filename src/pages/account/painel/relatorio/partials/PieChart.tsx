import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { usePanel } from '@/auth/providers/PanelProvider';

const PieChart = () => {
  const { contasAtivas, contasInativas } = usePanel();

  // Garantir que os dados existem antes de renderizar
  if (contasAtivas === undefined || contasInativas === undefined) {
    return <div>Carregando gráfico...</div>;
  }

  const series = [contasAtivas, contasInativas];
  const labels = ['Ativos', 'Inativos'];

  const options: ApexOptions = {
    chart: {
      type: 'pie'
    },
    labels: labels,
    legend: {
      position: 'bottom',
      fontSize: '14px'
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`
      }
    },
    colors: ['var(--tw-primary)', 'var(--tw-warning)'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 280
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  return (
    <div className="flex justify-center w-full max-w-sm">
      <ApexChart
        options={options}
        series={series}
        type="pie"
        width="100%"
        height={300}
      />
    </div>
  );
};

export { PieChart };
