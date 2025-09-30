import { useMutation, useQuery } from "@apollo/client";
import { GET_INTEGRACOES, SET_INTEGRACAO } from "../schemas/Integracao";
import { TypesGetIntegracoes, TypesSetIntegracao, VariablesSetIntegracao } from "../types/Integracao";

export function useQueryIntegracoes(variables: any) {
  return useQuery<TypesGetIntegracoes>(GET_INTEGRACOES, {
    variables,
    fetchPolicy: 'network-only'
  });
}

export function useSetIntegracao() {
  const [mutate, { data, loading, error }] = useMutation<TypesSetIntegracao, VariablesSetIntegracao>(
    SET_INTEGRACAO,
    {
      fetchPolicy: 'network-only',
      refetchQueries: () => [
        {
          query: GET_INTEGRACOES,
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

  const createIntegracao = async (variables: VariablesSetIntegracao) => {
    const response = await mutate({
      variables,
      refetchQueries: () => [
        {
          query: GET_INTEGRACOES,
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

  return { createIntegracao, data, loading, error };
}
