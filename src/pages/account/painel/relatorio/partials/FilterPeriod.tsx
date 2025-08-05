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
import { usePanel } from '@/auth/providers/PanelProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker'; // necessário

const toUTCISOStringRange = (date: Date): { start: string; end: string } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const start = new Date(Date.UTC(year, month, day, 3, 0, 0)); // 00:00 BRT
  const end = new Date(Date.UTC(year, month, day + 1, 2, 59, 59, 999)); // 23:59:59 BRT

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
  const { setStartDate, setEndDate } = usePanel();

  const handlePeriodChange = (label: string) => {
    setActive(label);
    setOpen(false);
    setCustomRange(undefined); // reseta custom range se voltar a períodos fixos

    const now = new Date();
    let range: { start: string; end: string } | null = null;

    switch (label) {
      case 'Ontem':
        range = toUTCISOStringRange(subDays(now, 1));
        break;
      case 'Hoje':
        range = toUTCISOStringRange(now);
        break;
      case 'Semana':
        range = {
          start: toUTCISOStringRange(startOfWeek(now, { weekStartsOn: 1 })).start,
          end: toUTCISOStringRange(endOfWeek(now, { weekStartsOn: 1 })).end
        };
        break;
      case 'Mês':
        range = {
          start: toUTCISOStringRange(startOfMonth(now)).start,
          end: toUTCISOStringRange(endOfMonth(now)).end
        };
        break;
      case 'Ano':
        range = {
          start: toUTCISOStringRange(startOfYear(now)).start,
          end: toUTCISOStringRange(endOfYear(now)).end
        };
        break;
    }

    if (range) {
      setStartDate(range.start);
      setEndDate(range.end);
    }
  };

  const handleCustomRangeChange = (range: DateRange | undefined) => {
    setCustomRange(range);

    if (range?.from && range?.to) {
      const fromUTC = toUTCISOStringRange(range.from).start;
      const toUTC = toUTCISOStringRange(range.to).end;

      setStartDate(fromUTC);
      setEndDate(toUTC);
      setActive('Custom');
      setOpen(false);
    }
  };

  useEffect(() => {
    handlePeriodChange('Hoje');
  }, []);

  return (
    <div className="inline-flex overflow-hidden">
      {periods.map((period, index) => {
        const isFirst = index === 0;
        const isLast = index === periods.length - 1;
        const isActive = active === period.label;

        return (
          <button
            key={period.label}
            onClick={() => handlePeriodChange(period.label)}
            className={`px-4 py-2 text-sm font-medium border 
              ${isActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
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
              ${active === 'Custom' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
              rounded-r-md border-l-0
            `}
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
            defaultMonth={new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
