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

export const GET_CLIENTE_BY_ID = gql`
  query GetCliente($getClienteId: Float!) {
    GetCliente(id: $getClienteId) {
      id
      nome
      email
      cnpj
      fee
      saldo
      alocacao
      saldoCliente
      depositoTotal
      gastoTotal
      criadoEm
      atualizadoEm
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

export const DELETE_CLIENTE = gql`
  mutation DeleteCliente($deleteClienteId: Int!) {
    DeleteCliente(id: $deleteClienteId) {
      id
    }
  }
`;
