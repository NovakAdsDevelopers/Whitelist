import React, { useMemo } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useGetAllContasAnuncio } from '@/graphql/services/ContasAnuncio';

const animatedComponents = makeAnimated();

interface ChosenContasAnuncioProps {
  onChange: (value: { label: string; value: string }[]) => void;
}

const ChosenContasAnuncio = ({ onChange }: ChosenContasAnuncioProps) => {
  const variables = useMemo(
    () => ({
      pagination: {
        pagina: 0,
        quantidade: 100000
      }
    }),
    []
  );

  const { data } = useGetAllContasAnuncio(variables);

  const options = useMemo(() => {
    return (
      data?.GetAllContasAnuncio.result.map((conta) => ({
        label: `${conta.id} - ${conta.nome}`,
        value: conta.id
      })) || []
    );
  }, [data]);

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={options}
      onChange={(selected) => onChange(selected as { label: string; value: string }[])}
    />
  );
};

export default ChosenContasAnuncio;
