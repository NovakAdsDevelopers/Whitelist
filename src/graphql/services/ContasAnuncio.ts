import { useQuery } from '@apollo/client';
import {
  TypesGetAllContasAnuncio,
  TypesGetContasAnuncio,
  TypesGetContasAnuncioCredito,
  TypesGetInsightsAdAccount
} from '../types/ContasAnuncio';
import {
  GET_ALL_CONTA_ANUNCIO,
  GET_CONTA_ANUNCIO,
  GET_CONTAS_ANUNCIOS_CREDITO,
  GET_INSIGHT_AD_ACCOUNT
} from '../schemas/ContasAnuncio';
import { PainelRelatorioLineChartTypes } from '../types/PainelRelatorio';
import { GET_PANEL_INSIGHTS_LINE_CHART } from '../schemas/PainelRelatorio';

interface QueryProps {
  variables: any;
}

export function useGetContasAnuncio(variables: any) {
  return useQuery<TypesGetContasAnuncio>(GET_CONTA_ANUNCIO, {
    variables,
    fetchPolicy: 'network-only'
  });
}

export function useGetContasAnuncioCredito(variables: any) {
  return useQuery<TypesGetContasAnuncioCredito>(GET_CONTAS_ANUNCIOS_CREDITO, {
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

export function useGetInsightsAdAccount(variables: any) {
  return useQuery<TypesGetInsightsAdAccount>(GET_INSIGHT_AD_ACCOUNT, {
    variables: variables,
    fetchPolicy: 'network-only'
  });
}

export function useGetInsightsAdAccountPeriod(variables: any) {
  return useQuery<PainelRelatorioLineChartTypes>(GET_PANEL_INSIGHTS_LINE_CHART, {
    variables: variables,
    fetchPolicy: 'network-only'
  });
}
