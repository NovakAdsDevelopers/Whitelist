import { MiscHelp } from '@/partials/misc';

import { ContasAnuncioLog } from './blocks';

const ContasAnuncioContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-info border-none drop-shadow-sm">
          <div className="space-y-1.5 p-6 flex flex-row items-center justify-between gap-x-4">
            <div className="space-y-2">
              <div className="font-light tracking-tight text-2xl line-clamp-1">Entradas</div>
            </div>
            <div className="shrink-0 rounded-md p-3 bg-green-500/20">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 576 512"
                className="size-6 fill-green-500"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z"></path>
              </svg>
            </div>
          </div>
          <div className="p-6 pt-0">
            <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
              <span>$2,142.60</span>
            </h1>
            <p className="text-sm line-clamp-1 text-red-500">-567% from last period</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground   shadow-info border-none drop-shadow-sm">
          <div className="space-y-1.5 p-6 flex flex-row items-center justify-between gap-x-4">
            <div className="space-y-2">
              <div className="font-light  tracking-tight text-2xl line-clamp-1">Gastos</div>
            </div>
            <div className="shrink-0 rounded-md p-3 bg-red-500/20">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 576 512"
                className="size-6 fill-red-500"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 82.7L342.6 137.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352 384 352z"></path>
              </svg>
            </div>
          </div>
          <div className="p-6 pt-0">
            <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
              <span>$2,142.60</span>
            </h1>
            <p className="text-sm line-clamp-1 text-emerald-500">+567% from last period</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-info border-none drop-shadow-sm">
          <div className="space-y-1.5 p-6 flex flex-row items-center justify-between gap-x-4">
            <div className="space-y-2">
              <div className="font-light tracking-tight text-2xl line-clamp-1">Saldo</div>
            </div>
            <div className="shrink-0 rounded-md p-3 bg-blue-500/20">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 576 512"
                className="size-6 fill-blue-500"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M560 224h-29.5c-8.8-20-21.6-37.7-37.4-52.5L512 96h-32c-29.4 0-55.4 13.5-73 34.3-7.6-1.1-15.1-2.3-23-2.3H256c-77.4 0-141.9 55-156.8 128H56c-14.8 0-26.5-13.5-23.5-28.8C34.7 215.8 45.4 208 57 208h1c3.3 0 6-2.7 6-6v-20c0-3.3-2.7-6-6-6-28.5 0-53.9 20.4-57.5 48.6C-3.9 258.8 22.7 288 56 288h40c0 52.2 25.4 98.1 64 127.3V496c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-48h128v48c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-80.7c11.8-8.9 22.3-19.4 31.3-31.3H560c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16zm-128 64c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zM256 96h128c5.4 0 10.7.4 15.9.8 0-.3.1-.5.1-.8 0-53-43-96-96-96s-96 43-96 96c0 2.1.5 4.1.6 6.2 15.2-3.9 31-6.2 47.4-6.2z"></path>
              </svg>
            </div>
          </div>
          <div className="p-6 pt-0">
            <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
              <span>$2,142.60</span>
            </h1>
            <p className="text-sm line-clamp-1 text-emerald-500">+567% from last period</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-info border-none drop-shadow-sm">
          <div className="space-y-1.5 pt-6 px-6 flex flex-row items-center justify-between gap-x-4">
            <div className="space-y-2">
              <div className="font-light tracking-tight text-lg line-clamp-1">
                Depósitos alocados
              </div>
            </div>
          </div>
          <div className="pb-2 px-6 pt-0">
            <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
              <span>$2,142.60</span>
            </h1>
          </div>
          <div className="space-y-1.5 pt-1 px-6 flex flex-row items-center justify-between gap-x-4">
            <div className="space-y-2">
              <div className="font-light tracking-tight text-lg line-clamp-1">
                Depósitos alocados
              </div>
            </div>
          </div>
          <div className="pb-3 px-6 pt-0">
            <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
              <span>$2,142.60</span>
            </h1>
          </div>
        </div>
      </div>

      <ContasAnuncioLog />

      <MiscHelp />
    </div>
  );
};

export { ContasAnuncioContent };
