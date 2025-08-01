'use client';

import { useState } from 'react';
import { KeenIcon } from '@/components';
import {
  isToday,
  isYesterday,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear
} from 'date-fns';

const periods = [
  { label: 'Ontem', check: (date: Date) => isYesterday(date) },
  { label: 'Hoje', check: (date: Date) => isToday(date) },
  {
    label: 'Semana',
    check: (date: Date) =>
      isWithinInterval(date, {
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 })
      })
  },
  {
    label: 'Mês',
    check: (date: Date) =>
      isWithinInterval(date, {
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      })
  },
  {
    label: 'Ano',
    check: (date: Date) =>
      isWithinInterval(date, {
        start: startOfYear(new Date()),
        end: endOfYear(new Date())
      })
  }
];

export function FilterPeriod() {
  const [active, setActive] = useState('Hoje');

  return (
    <div className="inline-flex overflow-hidden">
      {periods.map((period, index) => {
        const isFirst = index === 0;
        const isLast = index === periods.length - 1;
        const isActive = active === period.label;

        return (
          <button
            key={period.label}
            onClick={() => setActive(period.label)}
            className={`
          px-4 py-2 text-sm font-medium border 
          ${isActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
          ${isFirst ? 'rounded-l-md' : ''}
          ${isLast ? '' : ''}
          ${!isFirst && 'border-l-0'}
        `}
          >
            {period.label}
          </button>
        );
      })}

      <button
        onClick={() => setActive('Custom')}
        className={`
      px-4 py-2 flex items-center justify-center text-sm font-medium border 
      ${active === 'Custom' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
      ${periods.length === 0 ? 'rounded-md' : 'rounded-r-md border-l-0'}
    `}
      >
        <KeenIcon icon="calendar" />
      </button>
    </div>
  );
}
