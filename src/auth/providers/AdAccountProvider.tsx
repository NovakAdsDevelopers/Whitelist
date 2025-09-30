// AdAccountProvider.tsx
import { useParams } from 'react-router-dom';
import { useGetInsightsAdAccount } from '@/graphql/services/ContasAnuncio';
import { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';

interface AdAccountContextType {
  adAccountId: string | null;
  saldo: number;
  saldoMeta: number;
  gastoTotal: number;
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
}

const AdAccountContext = createContext<AdAccountContextType | undefined>(undefined);

export const AdAccountProvider = ({ children }: { children: ReactNode }) => {
  // URL: /painel/gestao-contas/:id/history
  const { id: adAccountId } = useParams<{ id: string }>();

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // passe o id para o seu hook
  const { data, refetch } = useGetInsightsAdAccount({
    adAccountId: adAccountId,
    endDate: endDate,
    startDate: startDate
  });

  // se não usar `skip`, garanta que só refaça a query quando houver id
  useEffect(() => {
    if (!adAccountId) return;
    refetch({ adAccountId, startDate, endDate });
  }, [adAccountId, startDate, endDate, refetch]);

  const saldo = data?.GetInsightsAdAccount?.saldoTotal ?? 0;
  const saldoMeta = data?.GetInsightsAdAccount?.saldoMeta ?? 0;
  const gastoTotal = data?.GetInsightsAdAccount?.gastoTotal ?? 0;

  const value = useMemo(
    () => ({
      adAccountId: adAccountId ?? null,
      saldo,
      saldoMeta,
      gastoTotal,
      startDate,
      endDate,
      setStartDate,
      setEndDate
    }),
    [adAccountId, saldo, saldoMeta, gastoTotal, startDate, endDate]
  );

  return <AdAccountContext.Provider value={value}>{children}</AdAccountContext.Provider>;
};

export const useAdAccount = () => {
  const context = useContext(AdAccountContext);
  if (!context) throw new Error('useAdAccount must be used within an AdAccountProvider');
  return context;
};
