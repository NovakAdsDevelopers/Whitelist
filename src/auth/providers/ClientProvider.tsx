import { useQueryClienteByID } from '@/graphql/services/Cliente';
import { useQueryClienteContasAnuncio } from '@/graphql/services/ClienteContaAnuncio';
import { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';

interface ClientContextType {
  id: number | null;
  name: string | null;
  email: string | null;
  cnpj: string | null;
  fee: string | null;
  saldo: number | null;
  depositoTotal: number | null;
  gastoTotal: number | null;

  alocacaoTotal: number | null;
  saldoCliente: number | null;

  refetch: any;
  refetchAssociadas: any;

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

  const [alocacaoTotal, setAlocacaoTotal] = useState<number | null>(null);
  const [saldoCliente, setSaldoCliente] = useState<number | null>(null);

  const [entries, setEntries] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);

  const balance = entries - expenses;

  // Usa o hook somente se tiver um ID
  const { data, loading, error, refetch } = useQueryClienteByID(id!);

  const variables = useMemo(
    () => ({
      clienteId: id, // Garantindo que o id seja um número
      pagination: {
        pagina: 0,
        quantidade: 100000
      }
    }),
    [id] // Dependência no id para atualizar as variáveis quando ele mudar
  );

  const {
    data: dataAssociadas,
    loading: loadingAssociadas,
    error: errorAssociadas,
    refetch: refetchAssociadas
  } = useQueryClienteContasAnuncio(variables);

  // Atualiza o contexto quando os dados forem carregados
  useEffect(() => {
    if (data?.GetCliente) {
      setName(data.GetCliente.nome);
      setEmail(data.GetCliente.email);
      setCnpj(data.GetCliente.cnpj);
      setFee(data.GetCliente.fee);
      setSaldo(
        (dataAssociadas?.GetContasAssociadasPorCliente.result.reduce(
          (total, conta) => total + (conta.depositoTotal || 0),
          0
        ) || 0) -
          (dataAssociadas?.GetContasAssociadasPorCliente.result.reduce(
            (total, conta) => total + (conta.gastoTotal || 0),
            0
          ) || 0)
      );
      setDepositoTotal(data.GetCliente.depositoTotal);
      setAlocacaoTotal(
        dataAssociadas?.GetContasAssociadasPorCliente.result.reduce(
          (total, conta) => total + (conta.depositoTotal || 0),
          0 // Valor inicial para a soma
        ) || 0 // Caso não haja dados, retorna 0
      );
      setSaldoCliente(data.GetCliente.saldoCliente);

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
        addExpense,

        refetch,
        refetchAssociadas,

        alocacaoTotal,
        saldoCliente
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
