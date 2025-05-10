import { useMutation, useQuery } from '@apollo/client';
import { GET_CLIENTE_BY_ID, GET_CLIENTES, SET_CLIENTE } from '../schemas/Cliente';
import { TypesGetClienteByID, TypesGetClientes, TypesSetCliente, VariablesSetCliente } from '../types/Cliente';

/**
 * Hook para buscar clientes com variáveis dinâmicas
 */
export function useQueryClientes(variables: any) {
  return useQuery<TypesGetClientes>(GET_CLIENTES, {
    variables,
    fetchPolicy: 'network-only'
  });
}

/**
 * Hook para buscar clientes com variáveis dinâmicas
 */
export function useQueryClienteByID(id: number) {
  return useQuery<TypesGetClienteByID>(GET_CLIENTE_BY_ID, {
    variables: {
      getClienteId: id
    },
    fetchPolicy: 'network-only'
  });
}

/**
 * Hook para criar cliente e refazer o fetch da lista de clientes
 */
export function useSetCliente() {
  const [mutate, { data, loading, error }] = useMutation<TypesSetCliente, VariablesSetCliente>(
    SET_CLIENTE,
    {
      fetchPolicy: 'network-only',
      refetchQueries: () => [
        {
          query: GET_CLIENTES,
          variables: {
            pagination: {
              pagina: 0,
              quantidade: 100000
            },
            status: 'OPEN'
          }
        }
      ],
      awaitRefetchQueries: true,
      onCompleted: (data) => {
        console.log('✅ Cliente criado com sucesso!', data);
      }
    }
  );

  const createCliente = async (variables: VariablesSetCliente) => {
    const response = await mutate({
      variables,
      refetchQueries: () => [
        {
          query: GET_CLIENTES,
          variables: {
            pagination: {
              pagina: 0,
              quantidade: 100000
            },
            status: 'OPEN'
          }
        }
      ],
      awaitRefetchQueries: true
    });
    return response.data;
  };

  return { createCliente, data, loading, error };
}
