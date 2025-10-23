import { gql } from '@apollo/client';

export const GET_INTEGRACOES = gql`
  query GetIntegracoes($type: String, $pagination: Pagination) {
    GetIntegracoes(type: $type, pagination: $pagination) {
      result {
        token
        client_id
        title
        secret_id
        id
        situacao
        totalAdAccounts
        bms {
          id
          nome
          adaccounts
        }
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
`;

export const SET_INTEGRACAO = gql`
  mutation SetIntegracao($data: IntegracaoCreateInput!) {
    SetIntegracao(data: $data) {
      id
    }
  }
`;
