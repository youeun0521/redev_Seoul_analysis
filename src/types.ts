/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RegionDetail {
  세대수: number;
  용적률: number;
  임대비율: number;
  단계: string;
  분양가: number; // in 억 원 (hundred millions KRW)
  시세: number; // in 억 원
  권리가액: number; // in 억 원
  입지: string;
}

export interface InvestmentInput {
  region: string;
  purchasePrice: number; // 매입가 (억 원)
  loanRatio: number; // 대출비율 (%)
  interestRate: number; // 금리 (%)
  holdingPeriod: number; // 보유기간 (년)
  tendency: 'conservative' | 'neutral' | 'aggressive';
}

export interface AnalysisResult {
  additionalPayment: number; // 추가분담금 (억)
  loanAmount: number; // 대출금 (억)
  equity: number; // 자기자본 (억)
  interestCost: number; // 이자비용 (억)
  totalInvestment: number; // 총투자금 (억)
  netProfit: number; // 순수익 (억)
  returnOnInvestment: number; // 수익률 (%)
}
