'use client';

import * as React from 'react';
import ReactSelect, {
  ActionMeta,
  MultiValue,
  StylesConfig,
} from 'react-select';
import { useQueryBMs } from '@/graphql/services/BMs';
import { usePanel } from '@/auth/providers/PanelProvider';

type Option = { value: string; label: string };

const styles: StylesConfig<Option, true> = {
  container: (base) => ({ ...base, minWidth: 260, width: 'auto' }),
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: 8,
    borderColor: state.isFocused ? 'var(--color-primary, #6366f1)' : '#e5e7eb',
    boxShadow: 'none',
    ':hover': { borderColor: '#9ca3af' },
  }),
  multiValue: (base) => ({ ...base, borderRadius: 6 }),
  valueContainer: (base) => ({ ...base, paddingTop: 4, paddingBottom: 4 }),
  menu: (base) => ({ ...base, zIndex: 50 }),
};

export default function BMSelectorRS({
  className,
  placeholder = 'Selecione as BMs',
}: {
  className?: string;
  placeholder?: string;
}) {
  const { data, loading } = useQueryBMs();
  const { BMs, setBMs } = usePanel();
  console.log('BMs selecionadas:', BMs);
  // Valor padrão: quando vazio, considera "todas"
  React.useEffect(() => {
    if (!BMs || BMs.length === 0) setBMs(['BMs']);
  }, [BMs, setBMs]);

  const options = React.useMemo<Option[]>(
    () => [
      { value: 'BMs', label: 'Todas as BMs' },
      ...(data?.GetBMs ?? []).map((bm: any) => ({
        value: String(bm.BMId),
        label: bm.nome as string,
      })),
    ],
    [data]
  );

  // Valor controlado do select
  const value = React.useMemo<Option[]>(
    () => {
      const current = (BMs && BMs.length > 0 ? BMs : ['BMs']).map(String);
      return options.filter((o) => current.includes(o.value));
    },
    [BMs, options]
  );

  const handleChange = (next: MultiValue<Option>, meta: ActionMeta<Option>) => {
    const vals = next.map((o) => o.value);

    // Se limpou tudo -> volta para "Todas"
    if (vals.length === 0) {
      setBMs(['BMs']);
      return;
    }

    if (meta.action === 'select-option' && meta.option) {
      // Se escolheu "Todas", fica só ela
      if (meta.option.value === 'BMs') {
        setBMs(['BMs']);
        return;
      }
      // Se escolheu específica e tinha "Todas", remove "Todas"
      setBMs(vals.filter((v) => v !== 'BMs'));
      return;
    }

    // Remoções / clears
    if (meta.action === 'remove-value' || meta.action === 'pop-value' || meta.action === 'clear') {
      if (vals.includes('BMs')) {
        setBMs(['BMs']);
        return;
      }
      setBMs(vals.length ? vals : ['BMs']);
      return;
    }

    // Fallback geral
    setBMs(vals.includes('BMs') && vals.length > 1 ? ['BMs'] : vals);
  };

  return (
    <div className={className}>
      <ReactSelect<Option, true>
        isMulti
        isClearable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        isDisabled={loading}
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        styles={styles}
        classNamePrefix="rs"
      />
    </div>
  );
}
