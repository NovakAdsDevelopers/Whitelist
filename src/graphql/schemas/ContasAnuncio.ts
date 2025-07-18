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