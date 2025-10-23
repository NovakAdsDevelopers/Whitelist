import { gql } from "@apollo/client";

export const GET_CONTA_ANUNCIO_PIX = gql`
query GetContaAnuncioFundos($accountId: String!, $pagination: Pagination) {
  GetContaAnuncioFundos(account_id: $accountId, pagination: $pagination) {
    result {
      id
      accountId
      accountName
      bmId
      bmNome
      usuarioId
      usuarioNome
      valor
      codigoCopiaCola
      imageUrl
      tipoRetorno
      codigoSolicitacao
      dataPagamento
      dataOperacao
    }
    pageInfo {
      currentPage
      totalPages
      totalItems
      hasNextPage
      hasPreviousPage
    }
  }
}
`