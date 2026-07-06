/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RegionDetail } from './types';

export const regions: string[] = [
  "신대방3구역",
  "흑석9구역",
  "전농8구역",
  "창신동23-606",
  "상도14구역",
  "면목7구역",
  "구의동 재개발",
  "중화동 재개발",
  "망우동 재개발",
  "천호동 재개발"
];

export const regionData: Record<string, RegionDetail> = {
  "신대방3구역": {
    세대수: 1900,
    용적률: 250,
    임대비율: 21,
    단계: "신속통합기획",
    분양가: 9, // 9억
    시세: 13, // 13억
    권리가액: 3.5, // 3.5억
    입지: "보라매공원 인근, 신림선 접근 가능"
  },
  "흑석9구역": {
    세대수: 1500,
    용적률: 270,
    임대비율: 15,
    단계: "조합설립",
    분양가: 12, // 12억
    시세: 17, // 17억
    권리가액: 5, // 5억
    입지: "한강 조망, 중앙대 인근"
  }
};

export const tendencyPresets = {
  conservative: {
    purchasePrice: 6.0, // 6억
    loanRatio: 30, // 30%
    interestRate: 3.8, // 3.8%
    holdingPeriod: 5, // 5년
    label: "보수적 투자",
    description: "낮은 대출 비중과 든든한 안정성 위주의 장기 투자 성향"
  },
  neutral: {
    purchasePrice: 7.5, // 7.5억
    loanRatio: 50, // 50%
    interestRate: 4.2, // 4.2%
    holdingPeriod: 4, // 4년
    label: "중립적 투자",
    description: "적정 레버리지 활용과 안정적인 중기 수익 극대화 성향"
  },
  aggressive: {
    purchasePrice: 9.0, // 9억
    loanRatio: 70, // 70%
    interestRate: 4.8, // 4.8%
    holdingPeriod: 3, // 3년
    label: "공격적 투자",
    description: "높은 대출 비율을 활용하여 빠른 회전을 노리는 고수익 성향"
  }
};
