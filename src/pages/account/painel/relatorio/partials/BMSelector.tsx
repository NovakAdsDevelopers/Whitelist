'use client';
import * as React from 'react';
import ReactSelect, { MultiValue } from 'react-select';
import { useQueryBMs } from '@/graphql/services/BMs';
import { usePanel } from '@/auth/providers/PanelProvider';

type Option = { value: string; label: string };

export default function BMSelectorRS({
  className,
  placeholder = 'Selecione as BMs',
}: {
  className?: string;
  placeholder?: string;
}) {
  const { data, loading } = useQueryBMs();
  const { setBMs } = usePanel();

  // Define as opções
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

  // Define o valor padrão (já seleciona "Todas as BMs")
  const defaultValue = [{ value: 'BMs', label: 'Todas as BMs' }];

  const handleChange = (next: MultiValue<Option>) => {
    const vals = next.map((o) => o.value);
    if (vals.length === 0 || vals.includes('BMs')) {
      setBMs(['BMs']);
      return;
    }
    setBMs(vals);
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
        defaultValue={defaultValue}   // 👈 igual ao exemplo que você mandou
        onChange={handleChange}
        placeholder={placeholder}
        classNamePrefix="rs"
      />
    </div>
  );
}
