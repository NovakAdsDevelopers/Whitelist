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
  placeholder = 'Seleciones as BMs',
}: {
  className?: string;
  placeholder?: string;
}) {
  const { data, loading } = useQueryBMs();
  const { BMs, setBMs } = usePanel();

  // Todos os IDs das BMs retornadas (como string)
  const allIds = React.useMemo<string[]>(
    () => (data?.GetBMs ?? []).map((bm: any) => String(bm.BMId)),
    [data]
  );

  // Opções do select (inclui atalho "Todas as BMs")
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

  // Valor padrão: quando não há nada selecionado, selecionar TODAS as BMs
  React.useEffect(() => {
    if ((!BMs || BMs.length === 0) && allIds.length > 0) {
      setBMs(allIds);
    }
  }, [BMs, allIds, setBMs]);

  // Valor controlado do select: se vazio, mostra todas
  const value = React.useMemo<Option[]>(() => {
    const current = (BMs && BMs.length > 0 ? BMs : allIds).map(String);
    return options.filter((o) => current.includes(o.value));
  }, [BMs, allIds, options]);

  const handleChange = (next: MultiValue<Option>, meta: ActionMeta<Option>) => {
    const vals = next.map((o) => o.value);

    // Se limpou tudo -> volta para TODAS as BMs
    if (vals.length === 0) {
      setBMs(allIds);
      return;
    }

    if (meta.action === 'select-option' && meta.option) {
      // Se escolheu "Todas as BMs", seleciona todas as IDs
      if (meta.option.value === 'BMs') {
        setBMs(allIds);
        return;
      }
      // Caso contrário, mantém as selecionadas (sem "BMs")
      setBMs(vals.filter((v) => v !== 'BMs'));
      return;
    }

    // Remoções / clears
    if (
      meta.action === 'remove-value' ||
      meta.action === 'pop-value' ||
      meta.action === 'clear'
    ) {
      // Se após remoção ficar vazio, volta para TODAS
      setBMs(vals.length ? vals.filter((v) => v !== 'BMs') : allIds);
      return;
    }

    // Fallback geral
    const cleaned = vals.filter((v) => v !== 'BMs');
    setBMs(cleaned.length ? cleaned : allIds);
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
