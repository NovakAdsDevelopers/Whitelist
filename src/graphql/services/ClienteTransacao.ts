import { TypesGetClienteTransacoes, TypesSetClienteTransacao } from '../types/ClienteTransacao';
import { GET_CLIENTE_TRANSACOES, SET_CLIENTE_TRANSACAO } from '../schemas/ClienteTransacao';
import { useMutation, useQuery } from '@apollo/client';
import { TypesSetClienteContaAnuncio } from '../types/ClienteContaAnuncio';
import { VariablesSetClienteTransacao } from '../types/Cliente';

/**
 * Hook para buscar clientes com variáveis dinâmicas
 */
export function useQueryClienteTransacoes(variables: any) {
  return useQuery<TypesGetClienteTransacoes>(GET_CLIENTE_TRANSACOES, {
    variables
  });
}

/**
 * Hook para associar o cliente a conta de anuncio
 */
export function useSetClienteTransacao(clientID: number) {
  const [mutate, { data, loading, error }] = useMutation<
    TypesSetClienteContaAnuncio,
    { data: VariablesSetClienteTransacao }
  >(SET_CLIENTE_TRANSACAO, {
    fetchPolicy: 'network-only',
    refetchQueries: () => [
      {
        query: GET_CLIENTE_TRANSACOES,
        variables: {
          clienteId: clientID,
          status: 'OPEN'
        }
      }
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      console.log('✅ Cliente e contas associadas com sucesso!', data);
    }
  });

  const createClienteTransacao = async (data: VariablesSetClienteTransacao) => {
    const response = await mutate({
      variables: { data },
      refetchQueries: () => [
        {
          query: GET_CLIENTE_TRANSACOES,
          variables: {
            clienteId: clientID,
            status: 'OPEN'
          }
        }
      ],
      awaitRefetchQueries: true
    });

    return response.data;
  };

  return { createClienteTransacao, data, loading, error };
}
