import { gql } from '@apollo/client';

export const GET_CLIENTES = gql`
  query GetClientes($pagination: Pagination) {
    GetClientes(pagination: $pagination) {
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
        email
        criadoEm
        atualizadoEm
      }
    }
  }
`;

export const SET_CLIENTE = gql`
  mutation SetCliente($data: ClienteCreateInput!) {
    SetCliente(data: $data) {
      id
      nome
    }
  }
`;
