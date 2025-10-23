import { TypesGetContaAnuncioPix } from "../types/ContaAnuncioPix";
import { GET_CONTA_ANUNCIO_PIX } from "../schemas/ContaAnuncioPix";
import { useQuery } from "@apollo/client";

export function useGetContaAnuncioPix(variables: any) {
  return useQuery<TypesGetContaAnuncioPix>(GET_CONTA_ANUNCIO_PIX, {
    variables,
    fetchPolicy: 'network-only'
  });
}
