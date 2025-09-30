import { gql } from '@apollo/client';

export const GET_BMS = gql`
  query GetBMs {
    GetBMs {
      id
      nome
      BMId
    }
  }
`;
