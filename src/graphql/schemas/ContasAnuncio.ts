import { gql } from '@apollo/client';

export const GET_CONTA_ANUNCIO = gql`
  query GetContasAnuncio($pagination: Pagination) {
    GetContasAnuncio(pagination: $pagination) {
      pageInfo {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
      result {
        id
        nome
        status
        moeda
        fusoHorario
        gastoTotal
        gastoAPI
        ultimaSincronizacao
        limiteGasto
        saldoMeta
        saldo
        depositoTotal
      }
    }
  }
`;

export const GET_ALL_CONTA_ANUNCIO = gql`
  query GetAllContasAnuncio($pagination: Pagination) {
    GetAllContasAnuncio(pagination: $pagination) {
      pageInfo {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
      result {
        id
        nome
        status
        moeda
        fusoHorario
        gastoTotal
        gastoAPI
        ultimaSincronizacao
        limiteGasto
        saldoMeta
        saldo
        depositoTotal
      }
    }
  }
`;

export const GET_INSIGHT_AD_ACCOUNT = gql`
query GetInsightsAdAccount($adAccountId: String, $startDate: String!, $endDate: String) {
  GetInsightsAdAccount(adAccountId: $adAccountId, startDate: $startDate, endDate: $endDate) {
    adAccountId
    periodoUTC {
      lt
      gte
    }
    diasNoPeriodo
    saldoMeta
    gastoTotal
    mediaDiaria
    saldoTotal
    nome
  }
}
`