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
        nomeContaCliente
        inicioAssociacao
        fimAssociacao
        ativo
        depositoTotal
        saldo
        gastoTotal
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

export const GET_CONTA_ANUNCIO_ASSOCIADA = gql`
  query GetContaAssociadaCliente($clienteId: Float!) {
    GetContaAssociadaCliente(clienteId: $clienteId) {
      id
      inicioAssociacao
      fimAssociacao
      contaAnuncio {
        nome
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

export const PUT_CLIENTE_CONTA_ANUNCIO = gql`
  mutation PutClienteContaAnuncio($data: ClienteContaAnuncioUpdateInput!) {
    PutClienteContaAnuncio(data: $data) {
      id
    }
  }
`;

export const SET_TRANSACAO_CLIENTE_CONTA_ANUNCIO = gql`
  mutation SetTransacaoClienteContaAnuncio($data: TransacaoClienteContaAnuncioInput!) {
    SetTransacaoClienteContaAnuncio(data: $data) {
      id
    }
  }
`;
