export interface PainelRelatorioTypes {
  GetInsightsPanel: {
    contasAtivas: {
      quantidade: number;
      gastoTotal: number;
      saldoTotal: number;
      saldoMeta: number;
    };
    contasInativas: {
      quantidade: number;
      gastoTotal: number;
      saldoTotal: number;
      saldoMeta: number;
    };
  };
}

export interface PainelRelatorioRankingTypes {
  GetInsightsPanelRelatorioRanking: {
    id: string;
    nome: string;
    gastoTotal: number;
    moeda: string;
    fusoHorario: string;
    status: number;
  }[]
}
