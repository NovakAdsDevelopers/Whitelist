import {
  GET_PANEL_INSIGHTS,
  GET_PANEL_RELATORIO_INSIGHTS_RANKING
} from '@/graphql/schemas/PainelRelatorio';
import { PainelRelatorioRankingTypes, PainelRelatorioTypes } from '@/graphql/types/PainelRelatorio';
import { useQuery } from '@apollo/client';
import { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';

interface PanelContextType {
  saldo: number;
  saldoMeta: number;
  gastoTotal: number;
  contasAtivas: number;
  contasInativas: number;
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  dataRanking: PainelRelatorioRankingTypes[];
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider = ({ children }: { children: ReactNode }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const { data, refetch } = useQuery<PainelRelatorioTypes>(GET_PANEL_INSIGHTS, {
    variables: { startDate, endDate },
    notifyOnNetworkStatusChange: true
  });

  const { data: dataRankingRaw, refetch: refetchRanking } = useQuery<{
    GetInsightsPanelRelatorioRanking: PainelRelatorioRankingTypes[];
  }>(GET_PANEL_RELATORIO_INSIGHTS_RANKING, {
    variables: { startDate, endDate },
    notifyOnNetworkStatusChange: true
  });

  const saldo = data?.GetInsightsPanel?.contasAtivas?.saldoTotal ?? 0;
  const saldoMeta = data?.GetInsightsPanel?.contasAtivas?.saldoMeta ?? 0;
  const gastoTotal = data?.GetInsightsPanel?.contasAtivas?.gastoTotal ?? 0;
  const contasAtivas = data?.GetInsightsPanel?.contasAtivas?.quantidade ?? 0;
  const contasInativas = data?.GetInsightsPanel?.contasInativas?.quantidade ?? 0;

  useEffect(() => {
    refetch({ startDate, endDate });
    refetchRanking({ startDate, endDate });
  }, [startDate, endDate, refetch, refetchRanking]);

  const value = useMemo(
    () => ({
      saldo,
      saldoMeta,
      gastoTotal,
      contasAtivas,
      contasInativas,
      startDate,
      endDate,
      setStartDate,
      setEndDate,
      dataRanking: dataRankingRaw?.GetInsightsPanelRelatorioRanking ?? []
    }),
    [saldo, saldoMeta, gastoTotal, contasAtivas, contasInativas, startDate, endDate, dataRankingRaw]
  );

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
};

export const usePanel = () => {
  const context = useContext(PanelContext);
  if (!context) throw new Error('usePanel must be used within a PanelProvider');
  return context;
};
