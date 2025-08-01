import { ApolloError, useMutation, useQuery } from '@apollo/client';
import {
  GET_CLIENTE_CONTA_ANUNCIO,
  GET_CONTA_ANUNCIO_ASSOCIADA,
  PUT_CLIENTE_CONTA_ANUNCIO,
  SET_CLIENTE_CONTA_ANUNCIO,
  SET_TRANSACAO_CLIENTE_CONTA_ANUNCIO
} from '../schemas/ClienteContaAnuncio';
import {
  TypesGetClienteContasAnuncio,
  TypesGetContaAnuncioAssociada,
  TypesPutClienteContaAnuncio,
  TypesSetClienteContaAnuncio,
  VariablesSetClienteContaAnuncio,
  VariablesSetTrasacaoClienteContaAnuncio
} from '../types/ClienteContaAnuncio';

export function useQueryClienteContasAnuncio(variables: any) {
  return useQuery<TypesGetClienteContasAnuncio>(GET_CLIENTE_CONTA_ANUNCIO, {
    variables,
    fetchPolicy: 'network-only'
  });
}

export function useQueryContasAnuncioAssociada(variables: any) {
  return useQuery<TypesGetContaAnuncioAssociada>(GET_CONTA_ANUNCIO_ASSOCIADA, {
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

export function usePutClienteContasAnuncio(clientID: number) {
  const [mutate, { data, loading, error }] = useMutation<
    TypesPutClienteContaAnuncio,
    { data: VariablesSetClienteContaAnuncio }
  >(PUT_CLIENTE_CONTA_ANUNCIO, {
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

export function useSetTransacaoClienteContasAnuncio(clientID: number) {
  let errorMessage = '';
  const [mutate, { data, loading, error }] = useMutation<
    TypesSetClienteContaAnuncio,
    { data: VariablesSetTrasacaoClienteContaAnuncio }
  >(SET_TRANSACAO_CLIENTE_CONTA_ANUNCIO, {
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
    errorPolicy: 'none',
    onCompleted: (data) => {
      console.log('✅ Cliente e contas associadas com sucesso!', data);
    }
  });

  const createTransacaoClienteContasAnuncio = async (
    variables: VariablesSetTrasacaoClienteContaAnuncio
  ) => {
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

  return { createTransacaoClienteContasAnuncio, data, loading, error };
}
