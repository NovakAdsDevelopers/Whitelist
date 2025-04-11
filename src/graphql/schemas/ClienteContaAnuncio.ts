import { gql } from '@apollo/client';

export const GET_CLIENTE_CONTA_ANUNCIO = gql`
  query GetContasAssociadasPorCliente($clienteId: Float!, $pagination: Pagination) {
    GetContasAssociadasPorCliente(clienteId: $clienteId, pagination: $pagination) {
      pageInfo {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
      result {
        id
        clienteId
        contaAnuncioId
        inicioAssociacao
        fimAssociacao
        ativo
        contaAnuncio {
          id
          nome
          status
          moeda
          fusoHorario
          gastoTotal
          gastoAPI
        }
      }
    }
  }
`;

export const SET_CLIENTE_CONTA_ANUNCIO = gql`
  mutation SetClienteContaAnuncio($data: ClienteContaAnuncioCreateManyInput!) {
    SetClienteContaAnuncio(data: $data) {
      associacoes {
        id
      }
    }
  }
`;
