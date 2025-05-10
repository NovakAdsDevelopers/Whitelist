import React from 'react';

interface Props {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
}

const formatCNPJ = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

const CNPJInput = ({ name, value, onChange, onBlur, error, touched }: Props) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    onChange(name, raw); // só envia números
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="form-label text-gray-900">CNPJ</label>
      <label className="input">
        <input
          type="text"
          placeholder="00.000.000/0000-00"
          value={formatCNPJ(value || '')}
          onChange={handleInputChange}
          onBlur={onBlur}
          className="form-control"
        />
      </label>
      {touched && error && (
        <span role="alert" className="text-danger text-xs mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default CNPJInput;
