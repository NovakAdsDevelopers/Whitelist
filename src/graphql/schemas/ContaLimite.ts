import { gql } from '@apollo/client';

export const GET_LIMITES_CONTA_ANUNCIO = gql`
  query GetLimitesContaAnuncio($contaAnuncioId: String!) {
    GetLimitesContaAnuncio(contaAnuncioID: $contaAnuncioId) {
      contaAnuncioID
      limiteCritico
      limiteMedio
      limiteInicial
      alertaAtivo
    }
  }
`;

export const SET_LIMITES_CONTA_ANUNCIO = gql`
  mutation SetAjusteLimiteConta($data: ContaLimiteAjusteInput!) {
    SetAjusteLimiteConta(data: $data) {
      contaAnuncioID
    }
  }
`;
