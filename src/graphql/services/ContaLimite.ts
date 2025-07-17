import { useMutation, useQuery } from '@apollo/client';
import { GET_LIMITES_CONTA_ANUNCIO, SET_LIMITES_CONTA_ANUNCIO } from '../schemas/ContaLimite';
import {
  TypesGetContaLimite,
  TypesSetContaLimite,
  VariablesSetContaLimite
} from '../types/ContaLimite';

export function useQueryLimiteConta(variables: any) {
  return useQuery<TypesGetContaLimite>(GET_LIMITES_CONTA_ANUNCIO, {
    variables,
    fetchPolicy: 'network-only'
  });
}

export function useSetContaLimite() {
  const [mutate, { data, loading, error }] = useMutation<
    TypesSetContaLimite,
    VariablesSetContaLimite
  >(SET_LIMITES_CONTA_ANUNCIO, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('✅ Cliente criado com sucesso!', data);
    }
  });

  const createContaLimite = async (variables: VariablesSetContaLimite) => {
    const response = await mutate({
      variables
    });
    return response.data;
  };

  return { createContaLimite, data, loading, error };
}
