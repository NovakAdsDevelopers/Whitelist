import { useQuery } from '@apollo/client';
import { TypesGetContasAnuncio } from '../types/ContasAnuncio';
import { GET_CONTA_ANUNCIO } from '../schemas/ContasAnuncio';

interface QueryProps {
  variables: any;
}


export function useGetContasAnuncio(variables: any) {
  return useQuery<TypesGetContasAnuncio>(GET_CONTA_ANUNCIO, {
    variables,
    fetchPolicy: 'network-only'
  });

}
