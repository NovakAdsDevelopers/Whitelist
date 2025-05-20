import { MiscHelp } from '@/partials/misc';
import { ContasAnuncioLog } from './blocks';
import { useClient } from '@/auth/providers/ClientProvider';

const currencyFormat = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const ContasAnuncioContent = () => {
  const { saldo, depositoTotal, gastoTotal, alocacaoTotal, saldoCliente } = useClient();

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Entradas */}
        <Card
          title="Entradas"
          iconBg="bg-green-500/20"
          iconColor="fill-green-500"
          iconPath="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z"
          value={currencyFormat(depositoTotal!)}
          info="0% from last period"
        />

        {/* Gastos */}
        <Card
          title="Gastos"
          iconBg="bg-red-500/20"
          iconColor="fill-red-500"
          iconPath="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 82.7L342.6 137.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352 384 352z"
          value={currencyFormat(gastoTotal!)}
          info="+567% from last period"
          infoClass="text-emerald-500"
        />

        {/* Saldo */}
        <Card
          title="Saldo"
          iconBg="bg-blue-500/20"
          iconColor="fill-blue-500"
          iconPath="M560 224h-29.5c-8.8-20-21.6-37.7-37.4-52.5L512 96h-32c-29.4 0-55.4 13.5-73 34.3-7.6-1.1-15.1-2.3-23-2.3H256c-77.4 0-141.9 55-156.8 128H56c-14.8 0-26.5-13.5-23.5-28.8C34.7 215.8 45.4 208 57 208h1c3.3 0 6-2.7 6-6v-20c0-3.3-2.7-6-6-6-28.5 0-53.9 20.4-57.5 48.6C-3.9 258.8 22.7 288 56 288h40c0 52.2 25.4 98.1 64 127.3V496c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-48h128v48c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-80.7c11.8-8.9 22.3-19.4 31.3-31.3H560c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16z"
          value={currencyFormat(saldo!)}
          info="+567% from last period"
          infoClass="text-emerald-500"
        />

        {/* Depósitos alocados e não alocados */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-info border-none drop-shadow-sm">
          <div className="space-y-1.5 pt-6 px-6 flex flex-row items-center justify-between gap-x-4">
            <div className="space-y-2">
              <div className="font-light tracking-tight text-lg line-clamp-1">
                Depósitos não alocados
              </div>
            </div>
          </div>
          <div className="px-6">
            <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
              {currencyFormat(saldoCliente!)}
            </h1>
          </div>
          <div className="space-y-1.5 pt-4 px-6 flex flex-row items-center justify-between gap-x-4">
            <div className="space-y-2">
              <div className="font-light tracking-tight text-lg line-clamp-1">
                Depósitos alocados
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">{currencyFormat(alocacaoTotal!)}</h1>
          </div>
        </div>
      </div>

      <ContasAnuncioLog />
    </div>
  );
};

const Card = ({
  title,
  value,
  info,
  iconBg,
  iconColor,
  iconPath,
  infoClass = 'text-gray-500'
}: {
  title: string;
  value: string;
  info: string;
  iconBg: string;
  iconColor: string;
  iconPath: string;
  infoClass?: string;
}) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-info border-none drop-shadow-sm">
    <div className="space-y-1.5 p-6 flex flex-row items-center justify-between gap-x-4">
      <div className="space-y-2">
        <div className="font-light tracking-tight text-2xl line-clamp-1">{title}</div>
      </div>
      <div className={`shrink-0 rounded-md p-3 ${iconBg}`}>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 576 512"
          className={`size-6 ${iconColor}`}
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={iconPath}></path>
        </svg>
      </div>
    </div>
    <div className="p-6 pt-0">
      <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">{value}</h1>
      <p className={`text-sm line-clamp-1 ${infoClass}`}>{info}</p>
    </div>
  </div>
);

export default ContasAnuncioContent;
