import { gql } from '@apollo/client';

export const GET_PANEL_INSIGHTS = gql`
  query GetInsightsPanel($startDate: String!, $endDate: String, $bMs: [String!]) {
    GetInsightsPanel(startDate: $startDate, endDate: $endDate, BMs: $bMs) {
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
  query GetInsightsPanelRelatorioRanking($bMs: [String!], $startDate: String!, $endDate: String) {
    GetInsightsPanelRelatorioRanking(BMs: $bMs, startDate: $startDate, endDate: $endDate) {
      id
      nome
      gastoTotal
      moeda
      fusoHorario
      status
      saldoMeta
    }
  }
`;

export const GET_PANEL_INSIGHTS_LINE_CHART = gql`
  query GetInsightsGastosPeriodos($type: String!, $adAccountId: String) {
    GetInsightsGastosPeriodos(type: $type, adAccountId: $adAccountId) {
      categories
      data
    }
  }
`;
