import { useQuery } from '@apollo/client';
import { TypesGetAllContasAnuncio, TypesGetContasAnuncio } from '../types/ContasAnuncio';
import { GET_ALL_CONTA_ANUNCIO, GET_CONTA_ANUNCIO } from '../schemas/ContasAnuncio';

interface QueryProps {
  variables: any;
}


export function useGetContasAnuncio(variables: any) {
  return useQuery<TypesGetContasAnuncio>(GET_CONTA_ANUNCIO, {
    variables,
    fetchPolicy: 'network-only'
  });
}

export function useGetAllContasAnuncio(variables: any) {
  return useQuery<TypesGetAllContasAnuncio>(GET_ALL_CONTA_ANUNCIO, {
    variables,
    fetchPolicy: 'network-only'
  });
}
