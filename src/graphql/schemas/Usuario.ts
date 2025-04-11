import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($senha: String!, $email: String!) {
    Login(senha: $senha, email: $email) {
      token
    }
  }
`;

export const GET_USUARIOS = gql`
  query GetUsuarios($pagination: Pagination) {
    GetUsuarios(pagination: $pagination) {
      result {
        id
        nome
        email
        tipo
        criadoEm
        atualizadoEm
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

// export const GET_USUARIO_BY_ID = gql`
// `

// export const PUT_USUARIO = gql`
// `

// export const DELETE_USUARIO = gql`
// `
