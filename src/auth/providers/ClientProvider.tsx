import { useQueryClienteByID } from '@/graphql/services/Cliente';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface ClientContextType {
  id: number | null;
  name: string | null;
  email: string | null;
  cnpj: string | null;
  fee: string | null;
  saldo: number | null;
  depositoTotal: number | null;
  gastoTotal: number | null;

  entries: number;
  expenses: number;
  balance: number;
  setClientInfo: (id: number) => void;
  addEntry: (amount: number) => void;
  addExpense: (amount: number) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [cnpj, setCnpj] = useState<string | null>(null);
  const [fee, setFee] = useState<string | null>(null);
  const [saldo, setSaldo] = useState<number | null>(null);
  const [depositoTotal, setDepositoTotal] = useState<number | null>(null);
  const [gastoTotal, setGastoTotal] = useState<number | null>(null);

  const [entries, setEntries] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);

  const balance = entries - expenses;

  // Usa o hook somente se tiver um ID
  const { data, loading, error } = useQueryClienteByID(id!);

  // Atualiza o contexto quando os dados forem carregados
  useEffect(() => {
    if (data?.GetCliente) {
      setName(data.GetCliente.nome);
      setEmail(data.GetCliente.email);
      setCnpj(data.GetCliente.cnpj);
      setFee(data.GetCliente.fee);
      setSaldo(data.GetCliente.saldo);
      setDepositoTotal(data.GetCliente.depositoTotal);
      setGastoTotal(data.GetCliente.gastoTotal);
    }
  }, [data]);

  const setClientInfo = (clientId: number) => {
    console.log(clientId + ':ID RECEBIDO');
    setId(clientId); // só atualiza o ID — o efeito cuidará do resto
  };

  const addEntry = (amount: number) => setEntries((prev) => prev + amount);
  const addExpense = (amount: number) => setExpenses((prev) => prev + amount);

  return (
    <ClientContext.Provider
      value={{
        id,
        name,
        email,
        cnpj,
        fee,
        saldo,
        depositoTotal,
        gastoTotal,
        entries,
        expenses,
        balance,
        setClientInfo,
        addEntry,
        addExpense
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) throw new Error('useClient must be used within a ClientProvider');
  return context;
};
