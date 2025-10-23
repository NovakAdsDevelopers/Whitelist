'use client';

import { useState, useEffect } from 'react';
import { KeenIcon } from '@/components';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays
} from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { useAdAccount } from '@/auth/providers/AdAccountProvider';

const toUTCISOStringRange = (date: Date): { start: string; end: string } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // 00:00 e 23:59:59 no fuso BRT (UTC-3)
  const start = new Date(Date.UTC(year, month, day, 3, 0, 0)); // 00:00 BRT
  const end = new Date(Date.UTC(year, month, day + 1, 2, 59, 59, 999)); // 23:59:59.999 BRT

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
};

const periods = [
  { label: 'Ontem' },
  { label: 'Hoje' },
  { label: 'Semana' },
  { label: 'Mês' },
  { label: 'Ano' }
];

export function FilterPeriod() {
  const [active, setActive] = useState('Hoje');
  const [open, setOpen] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const { setStartDate, setEndDate } = useAdAccount();

  const applyRange = (startISO: string, endISO: string, activeLabel: string) => {
    setStartDate(startISO);
    setEndDate(endISO);
    setActive(activeLabel);
  };

  const handlePeriodChange = (label: string) => {
    setOpen(false);
    setCustomRange(undefined); // limpa seleção visual do calendário

    const now = new Date();
    let range: { start: string; end: string } | null = null;

    switch (label) {
      case 'Ontem': {
        const d = subDays(now, 1);
        range = toUTCISOStringRange(d);
        // opcional: refletir no calendário como range de um dia
        setCustomRange({ from: d, to: d });
        break;
      }
      case 'Hoje': {
        range = toUTCISOStringRange(now);
        setCustomRange({ from: now, to: now });
        break;
      }
      case 'Semana': {
        const from = startOfWeek(now, { weekStartsOn: 1 });
        const to = endOfWeek(now, { weekStartsOn: 1 });
        range = { start: toUTCISOStringRange(from).start, end: toUTCISOStringRange(to).end };
        setCustomRange({ from, to });
        break;
      }
      case 'Mês': {
        const from = startOfMonth(now);
        const to = endOfMonth(now);
        range = { start: toUTCISOStringRange(from).start, end: toUTCISOStringRange(to).end };
        setCustomRange({ from, to });
        break;
      }
      case 'Ano': {
        const from = startOfYear(now);
        const to = endOfYear(now);
        range = { start: toUTCISOStringRange(from).start, end: toUTCISOStringRange(to).end };
        setCustomRange({ from, to });
        break;
      }
    }

    if (range) {
      applyRange(range.start, range.end, label);
    }
  };

  // Últimos X dias (inclui hoje): de (hoje - (X-1)) até hoje
  const handleLastDays = (days: number) => {
    const now = new Date();
    const from = subDays(now, days - 1);
    const to = now;

    const startISO = toUTCISOStringRange(from).start;
    const endISO = toUTCISOStringRange(to).end;

    // Atualiza a seleção visual do calendário
    setCustomRange({ from, to });

    // Atualiza o período aplicado e o rótulo ativo
    applyRange(startISO, endISO, `Últimos ${days} dias`);
    setOpen(false);
  };

  const handleCustomRangeChange = (range: DateRange | undefined) => {
    setCustomRange(range);

    if (range?.from && range?.to) {
      const fromUTC = toUTCISOStringRange(range.from).start;
      const toUTC = toUTCISOStringRange(range.to).end;

      applyRange(fromUTC, toUTC, 'Custom');
      setOpen(false);
    }
  };

  useEffect(() => {
    handlePeriodChange('Hoje');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = (label: string) => active === label;
  const isLastXActive = (days: number) => active === `Últimos ${days} dias`;

  // Considera o botão do calendário "ativo" quando for Custom OU Últimos X dias
  const calendarButtonIsActive =
    active === 'Custom' || active.startsWith('Últimos ');

  return (
    <div className="inline-flex overflow-hidden">
      {periods.map((period, index) => {
        const isFirst = index === 0;
        const isLast = index === periods.length - 1;

        return (
          <button
            key={period.label}
            onClick={() => handlePeriodChange(period.label)}
            className={`px-4 py-2 text-sm font-medium border 
              ${isActive(period.label) ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
              ${isFirst ? 'rounded-l-md' : ''}
              ${!isFirst ? 'border-l-0' : ''}
              ${isLast ? '' : ''}
            `}
          >
            {period.label}
          </button>
        );
      })}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={() => setActive('Custom')}
            className={`
              px-4 py-2 flex items-center justify-center text-sm font-medium border 
              ${calendarButtonIsActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
              rounded-r-md border-l-0
            `}
            aria-pressed={calendarButtonIsActive}
          >
            <KeenIcon icon="calendar" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={customRange}
            onSelect={handleCustomRangeChange}
            numberOfMonths={2}
            // mostra o mês do "to" ou do "from" quando existir seleção
            defaultMonth={customRange?.to ?? customRange?.from ?? new Date()}
          />

          <div className="w-full flex gap-2 justify-between p-2 bg-gray-100 border-t border-gray-300">
            <button
              onClick={() => handleLastDays(90)}
              className={`px-4 py-2 rounded-md text-sm font-medium
                ${isLastXActive(90) ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'}
              `}
            >
              Últimos 90 dias
            </button>

            <button
              onClick={() => handleLastDays(30)}
              className={`px-4 py-2 rounded-md text-sm font-medium
                ${isLastXActive(30) ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'}
              `}
            >
              Últimos 30 dias
            </button>

            <button
              onClick={() => handleLastDays(7)}
              className={`px-4 py-2 rounded-md text-sm font-medium
                ${isLastXActive(7) ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-200'}
              `}
            >
              Últimos 7 dias
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
