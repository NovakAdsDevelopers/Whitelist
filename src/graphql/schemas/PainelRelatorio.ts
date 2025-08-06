import { gql } from '@apollo/client';

export const GET_PANEL_INSIGHTS = gql`
  query GetInsightsPanel($startDate: String!, $endDate: String) {
    GetInsightsPanel(startDate: $startDate, endDate: $endDate) {
      contasAtivas {
        quantidade
        gastoTotal
        saldoTotal
        saldoMeta
      }
      contasInativas {
        quantidade
        gastoTotal
        saldoTotal
        saldoMeta
      }
    }
  }
`;

export const GET_PANEL_RELATORIO_INSIGHTS_RANKING = gql`
  query GetInsightsPanelRelatorioRanking($endDate: String, $startDate: String!) {
    GetInsightsPanelRelatorioRanking(endDate: $endDate, startDate: $startDate) {
      id
      nome
      gastoTotal
      moeda
      fusoHorario
      status
    }
  }
`;

export const GET_PANEL_INSIGHTS_LINE_CHART = gql`
  query GetInsightsGastosPeriodos($type: String!) {
    GetInsightsGastosPeriodos(type: $type) {
      categories
      data
    }
  }
`;
