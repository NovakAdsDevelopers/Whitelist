import React, { useMemo } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useGetContasAnuncio } from '@/graphql/services/ContasAnuncio';
import { useQueryBMs } from '@/graphql/services/BMs';

const animatedComponents = makeAnimated();

interface ChosenBMsProps {
  onChange: (value: { label: string; value: string }[]) => void;
  value?: { label: string; value: string }[];
  isMulti?: boolean;
}

const ChosenBMs = ({ onChange, value = [], isMulti = true }: ChosenBMsProps) => {


    const { data, loading } = useQueryBMs();
  

  // monta as opções de BMs
  const options = useMemo(() => {
    const contas = data?.GetBMs ?? [];
    return contas.map((conta: any) => ({
      label: `${conta.nome ?? 'Sem nome'}`,
      value: conta.BMId,
    }));
  }, [data]);

  return (
    <Select
      isLoading={loading}
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti={isMulti}
      options={options}
      placeholder="Selecione as BMs (opcional)"
      value={value}
      onChange={(selected) => onChange(selected as { label: string; value: string }[])}
      classNamePrefix="chosen-bms"
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (base) => ({
          ...base,
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
          boxShadow: 'none',
          '&:hover': { borderColor: 'var(--border-hover)' },
          minHeight: '38px',
        }),
        menu: (base) => ({
          ...base,
          zIndex: 50,
        }),
      }}
    />
  );
};

export default ChosenBMs;
