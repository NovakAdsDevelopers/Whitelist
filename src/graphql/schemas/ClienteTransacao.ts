import { gql } from '@apollo/client';

export const GET_CLIENTE_TRANSACOES = gql`
query GetClienteTransacoes($clienteId: Float!) {
  GetClienteTransacoes(cliente_id: $clienteId) {
    id
    tipo
    valor
    dataTransacao
    clienteId
    usuarioId
    fee
    valorAplicado
  }
}
`;

export const SET_CLIENTE_TRANSACAO = gql`
  mutation SetClienteTransacao($data: TransacaoClienteInput!) {
    SetClienteTransacao(data: $data) {
      id
    }
  }
`;
