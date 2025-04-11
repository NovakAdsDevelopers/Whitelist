import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CLIENTE_CONTA_ANUNCIO,
  SET_CLIENTE_CONTA_ANUNCIO
} from '../schemas/ClienteContaAnuncio';
import {
  TypesGetClienteContasAnuncio,
  TypesSetClienteContaAnuncio,
  VariablesSetClienteContaAnuncio
} from '../types/ClienteContaAnuncio';

export function useQueryClienteContasAnuncio(variables: any) {
  return useQuery<TypesGetClienteContasAnuncio>(GET_CLIENTE_CONTA_ANUNCIO, {
    variables,
    fetchPolicy: 'network-only'
  });
}

/**
 * Hook para associar o cliente a conta de anuncio
 */
export function useSetClienteContasAnuncio(clientID: number) {
  const [mutate, { data, loading, error }] = useMutation<
    TypesSetClienteContaAnuncio,
    { data: VariablesSetClienteContaAnuncio }
  >(SET_CLIENTE_CONTA_ANUNCIO, {
    fetchPolicy: 'network-only',
    refetchQueries: () => [
      {
        query: GET_CLIENTE_CONTA_ANUNCIO,
        variables: {
          clienteId: clientID,
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
      console.log('✅ Cliente e contas associadas com sucesso!', data);
    }
  });

  const createClienteContasAnuncio = async (variables: VariablesSetClienteContaAnuncio) => {
    const response = await mutate({
      variables: { data: variables },
      refetchQueries: () => [
        {
          query: GET_CLIENTE_CONTA_ANUNCIO,
          variables: {
            clienteId: clientID,
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

  return { createClienteContasAnuncio, data, loading, error };
}
