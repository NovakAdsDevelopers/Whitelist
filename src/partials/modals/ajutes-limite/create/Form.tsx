import React, { useEffect, useMemo, useState } from 'react';
import { useQueryLimiteConta } from '@/graphql/services/ContaLimite';
import { useSetContaLimite } from '@/graphql/services/ContaLimite'; // ajuste se necessário
import { toast } from 'sonner';
import { NumericFormat } from 'react-number-format';
import { Switch } from '@/components/ui/switch';

interface Props {
  onOpenChange: (open: boolean) => void;
  contaId: string | null;
}

function desformatarParaInteiro(valor: string): number {
  const limpo = valor.replace(/[^\d,]/g, ''); // mantém apenas dígitos e vírgula
  const [reais] = limpo.split(',');
  return Number(reais || '0');
}

const FormLimitesDinamicos = ({ onOpenChange, contaId }: Props) => {
  const variables = useMemo(() => ({ contaAnuncioId: contaId }), [contaId]);

  const { data, loading: isLoading } = useQueryLimiteConta(variables);
  const { createContaLimite, loading: saving } = useSetContaLimite();

  const [valores, setValores] = useState({
    critico: '',
    medio: '',
    inicial: '',
    alertaAtivo: false
  });

  useEffect(() => {
    if (data?.GetLimitesContaAnuncio) {
      setValores({
        critico: `R$ ${Number(data.GetLimitesContaAnuncio.limiteCritico).toFixed(2).replace('.', ',')}`,
        medio: `R$ ${Number(data.GetLimitesContaAnuncio.limiteMedio).toFixed(2).replace('.', ',')}`,
        inicial: `R$ ${Number(data.GetLimitesContaAnuncio.limiteInicial).toFixed(2).replace('.', ',')}`,
        alertaAtivo: data.GetLimitesContaAnuncio.alertaAtivo
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        data: {
          contaAnuncioID: contaId ?? '',
          limiteCritico: desformatarParaInteiro(valores.critico).toString(),
          limiteMedio: desformatarParaInteiro(valores.medio).toString(),
          limiteInicial: desformatarParaInteiro(valores.inicial).toString(),
          alertaAtivo: valores.alertaAtivo
        }
      };

      console.log('Payload para envio:', payload);

      await createContaLimite(payload);

      toast.message('✅ Limites atualizados com sucesso!');
      onOpenChange(false);
    } catch (error: any) {
      toast.message('❌ Erro ao atualizar limites', {
        description: error.message || 'Erro inesperado.'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isLoading ? (
        <p>Carregando limites...</p>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <label className="form-label">Crítico</label>
            <NumericFormat
              name="critico"
              value={valores.critico}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowNegative={false}
              onValueChange={(values) =>
                setValores((prev) => ({
                  ...prev,
                  critico: values.formattedValue
                }))
              }
              className="form-control bg-slate-100 px-2 py-2 rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="form-label">Médio</label>
            <NumericFormat
              name="medio"
              value={valores.medio}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowNegative={false}
              onValueChange={(values) =>
                setValores((prev) => ({
                  ...prev,
                  medio: values.formattedValue
                }))
              }
              className="form-control bg-slate-100 px-2 py-2 rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="form-label">Inicial</label>
            <NumericFormat
              name="inicial"
              value={valores.inicial}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowNegative={false}
              onValueChange={(values) =>
                setValores((prev) => ({
                  ...prev,
                  inicial: values.formattedValue
                }))
              }
              className="form-control bg-slate-100 px-2 py-2 rounded-md"
            />
          </div>

          {/* Ativar/desativar alertas */}
          <div className="flex items-center gap-3">
            <label className="form-label cursor-pointer select-none">Alertas ativos</label>
            <Switch
              checked={valores.alertaAtivo}
              onCheckedChange={(checked) =>
                setValores((prev) => ({ ...prev, alertaAtivo: checked }))
              }
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300"
            />
          </div>

          <div className="w-full flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Limites'}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export { FormLimitesDinamicos };
