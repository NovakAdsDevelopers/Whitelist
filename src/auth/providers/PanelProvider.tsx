import { useQueryClienteByID } from '@/graphql/services/Cliente';
import { useQueryClienteContasAnuncio } from '@/graphql/services/ClienteContaAnuncio';
import { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';

interface PanelContextType {
  saldo: number;
  depositoTotal: number;
  gastoTotal: number;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider = ({ children }: { children: ReactNode }) => {
  const [saldo, setSaldo] = useState<number>(0);
  const [depositoTotal, setDepositoTotal] = useState<number>(0);
  const [gastoTotal, setGastoTotal] = useState<number>(0);

  return (
    <PanelContext.Provider
      value={{
        saldo,
        depositoTotal,
        gastoTotal
      }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = () => {
  const context = useContext(PanelContext);
  if (!context) throw new Error('usePanel must be used within a PanelProvider');
  return context;
};
