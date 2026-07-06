/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Percent, 
  MapPin, 
  Building2, 
  Info, 
  Activity, 
  AlertCircle,
  HelpCircle,
  Calendar,
  Layers,
  Home,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { InvestmentInput, AnalysisResult } from '../types';
import { regionData } from '../data';

interface ResultPageProps {
  input: InvestmentInput;
  onBack: () => void;
  onSelectRegion: (regionName: string) => void;
}

// Helper to format currency elegantly in Korean style
export function formatKoreanWon(value: number): string {
  if (value === 0) return '0원';
  
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const eok = Math.floor(absValue);
  // Get 10,000s unit (4 decimal digits of "억" value)
  const remaining = Math.round((absValue - eok) * 10000);

  let result = '';
  if (eok > 0) {
    result += `${eok}억`;
  }
  if (remaining > 0) {
    if (eok > 0) result += ' ';
    result += `${remaining.toLocaleString()}만`;
  }
  result += ' 원';

  return isNegative ? `-${result}` : result;
}

export default function ResultPage({ input, onBack, onSelectRegion }: ResultPageProps) {
  const details = regionData[input.region];
  const isDataAvailable = !!details;

  // Render Data Not Available state
  if (!isDataAvailable) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
          
          <div className="mx-auto w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 border border-amber-100">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-3 font-sans">
            데이터 준비 중인 구역입니다
          </h2>
          
          <p className="text-xs text-slate-500 leading-relaxed mb-8">
            선택하신 <span className="font-semibold text-slate-700">[{input.region}]</span> 구역의 심층 사업성 시뮬레이션 데이터는 현재 정밀 검수 및 분석 단계에 있습니다.
            <br />
            <br />
            아래의 대표 분석 구역을 선택하시면 실시간 계산 공식이 대입된 고해상도 리포트를 즉시 체험하실 수 있습니다.
          </p>

          <div className="space-y-3 mb-8">
            <button
              onClick={() => onSelectRegion('신대방3구역')}
              className="w-full py-3 px-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              신대방3구역 분석 체험하기 (LTV 추천)
            </button>
            <button
              onClick={() => onSelectRegion('흑석9구역')}
              className="w-full py-3 px-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              흑석9구역 분석 체험하기 (한강망 조망)
            </button>
          </div>

          <button
            onClick={onBack}
            className="w-full py-3 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            이전 단계로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // --- Core Calculations ---
  // 추가분담금 = 분양가 - 권리가액
  const additionalPayment = details.분양가 - details.권리가액;
  // 대출금 = 매입가 * (대출비율 / 100)
  const loanAmount = input.purchasePrice * (input.loanRatio / 100);
  // 자기자본 = 매입가 - 대출금
  const equity = input.purchasePrice - loanAmount;
  // 이자비용 = 대출금 * (금리 / 100) * 보유기간
  const interestCost = loanAmount * (input.interestRate / 100) * input.holdingPeriod;
  // 총투자금 = 자기자본 + 추가분담금 + 이자비용
  const totalInvestment = equity + additionalPayment + interestCost;
  // 순수익 = 시세 - 총투자금
  const netProfit = details.시세 - totalInvestment;
  // 수익률 = (순수익 / 자기자본) * 100
  const returnOnInvestment = (netProfit / equity) * 100;

  // --- Investment Conclusion Setup ---
  let conclusionType: 'very_promising' | 'promising' | 'average' | 'risk' = 'average';
  let conclusionTitle = '';
  let conclusionColorClass = '';
  let conclusionBgClass = '';
  let aiComment = '';

  if (returnOnInvestment > 50) {
    conclusionType = 'very_promising';
    conclusionTitle = '매우 유망';
    conclusionColorClass = 'text-emerald-700 border-emerald-200 bg-emerald-50';
    conclusionBgClass = 'from-emerald-600 to-teal-600';
    aiComment = `본 투자 시나리오는 수익률이 ${returnOnInvestment.toFixed(1)}%로 극히 우수한 사업성을 시뮬레이션하고 있습니다. 조합원 분양가(${details.분양가}억 원) 대비 주변 시세(${details.시세}억 원)가 매우 높게 형성되어 대출을 적절히 동원(LTV ${input.loanRatio}%)한 투자 조건 하에서 레버리지 효과가 강력하게 작용합니다. 추가 분담 위험성이 낮아 최우선 진입을 권장합니다.`;
  } else if (returnOnInvestment >= 20) {
    conclusionType = 'promising';
    conclusionTitle = '투자 유망';
    conclusionColorClass = 'text-indigo-700 border-indigo-200 bg-indigo-50/70';
    conclusionBgClass = 'from-indigo-600 to-indigo-800';
    aiComment = `수익성이 우수하며 중장기적인 프리미엄 확보가 분명한 유망 투자처입니다. 자기자본 ${equity.toFixed(1)}억 원 대비 안정적인 순수익(${netProfit.toFixed(1)}억 원)이 창출되며, 보유 기간(${input.holdingPeriod}년) 동안 발생할 이자비용(${interestCost.toFixed(2)}억 원)을 뛰어넘는 충분한 마진이 보장됩니다. 균형감 있는 포트폴리오 구성을 권장합니다.`;
  } else if (returnOnInvestment > 0) {
    conclusionType = 'average';
    conclusionTitle = '보통 수준';
    conclusionColorClass = 'text-amber-700 border-amber-200 bg-amber-50';
    conclusionBgClass = 'from-amber-500 to-orange-500';
    aiComment = `투자 타당성이 무난하나 기대 수익률이 ${returnOnInvestment.toFixed(1)}%로 보통 수준에 그칩니다. 매입가격 또는 자금융통 금리 조건(${input.interestRate}%)이 높아 순수익 마진이 일부 감쇄된 것으로 관측됩니다. 추가 분담금이 늘어나거나 시세가 보합을 유지할 경우 위험할 수 있으니 자본 규모를 신중히 검토하시기 바랍니다.`;
  } else {
    conclusionType = 'risk';
    conclusionTitle = '투자 위험';
    conclusionColorClass = 'text-rose-700 border-rose-200 bg-rose-50';
    conclusionBgClass = 'from-rose-600 to-red-600';
    aiComment = `현재 입력 조건 하에서는 순수익이 적자(${netProfit.toFixed(1)}억 원)로 평가되거나 마이너스 수익률을 기록하고 있습니다. 대출 비율(${input.loanRatio}%)과 이자 비용(${interestCost.toFixed(2)}억 원)이 가치를 초과했거나 매입가가 이미 시세 수준에 달해 안전 마진이 부족합니다. 금리 조건을 완화하거나 매입 단가를 대폭 하향 조정해야 리스크를 피할 수 있습니다.`;
  }

  // Chart data setup
  const chartData = [
    {
      name: '자기자본',
      amount: parseFloat(equity.toFixed(2)),
      color: '#4f46e5',
    },
    {
      name: '추가분담금',
      amount: parseFloat(additionalPayment.toFixed(2)),
      color: '#6366f1',
    },
    {
      name: '보유이자',
      amount: parseFloat(interestCost.toFixed(2)),
      color: '#f59e0b',
    },
    {
      name: '총투자금',
      amount: parseFloat(totalInvestment.toFixed(2)),
      color: '#3b82f6',
    },
    {
      name: '준공시세',
      amount: parseFloat(details.시세.toFixed(2)),
      color: '#ec4899',
    },
    {
      name: '순수익',
      amount: parseFloat(netProfit.toFixed(2)),
      color: '#10b981',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans scroll-smooth">
      {/* Floating Header */}
      <div className="fixed top-0 inset-x-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-4 sm:px-8 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-slate-400 group-hover:text-slate-700" />
          다시 입력하기
        </button>
        <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
          <Activity className="w-3.5 h-3.5 text-indigo-600" />
          <span>{input.region} 정밀 리포트 v1.0</span>
        </div>
      </div>

      {/* SECTION 1: HERO (요약) */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden pt-16">
        {/* Subtle decorative grid/gradient backdrop matching High Density */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-slate-50 to-slate-50 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto w-full text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            투자 사업성 평가 리포트
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl sm:text-2xl font-bold text-slate-400 tracking-tight"
          >
            {input.region} 분석 시나리오
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-tight text-slate-800"
          >
            예상 순수익 <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">{formatKoreanWon(netProfit)}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4 text-base font-medium"
          >
            <div className="bg-white border border-slate-200 shadow-sm px-5 py-2.5 rounded-xl flex items-center gap-2">
              <span className="text-slate-500 font-semibold text-xs">예상 투자 수익률 (ROI):</span>
              <span className={`font-bold text-lg ${returnOnInvestment >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-mono`}>
                {returnOnInvestment.toFixed(1)}%
              </span>
            </div>
            
            <div className={`px-5 py-2.5 rounded-xl border font-bold text-xs shadow-sm ${conclusionColorClass}`}>
              종합 의견: {conclusionTitle}
            </div>
          </motion.div>

          {/* Prompt to scroll */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="pt-24 flex flex-col items-center gap-2 text-slate-400 animate-bounce cursor-pointer"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
              });
            }}
          >
            <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">심층 리포트 아래로 스크롤</span>
            <ChevronDown className="w-5 h-5 text-indigo-500" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: 사업 개요 */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto w-full space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-indigo-600 text-xs font-bold tracking-wider uppercase">01 / 구역 제원</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-sans">구역 기본 사업 설계</h3>
            <p className="text-slate-500 text-xs max-w-lg mx-auto">
              조합에서 공식 제출 및 확정 인가를 득한 재개발 기초 건축 사업 계획안 명세서입니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 세대수 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative hover:border-indigo-500/50 hover:bg-white hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-all border border-indigo-100/50">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">건축 설계 총 세대수</span>
              <p className="text-xl font-bold text-slate-800 mt-1 font-mono">{details.세대수.toLocaleString()} 세대</p>
            </motion.div>

            {/* 용적률 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative hover:border-indigo-500/50 hover:bg-white hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-all border border-indigo-100/50">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">계획 용적률 산정</span>
              <p className="text-xl font-bold text-slate-800 mt-1 font-mono">{details.용적률}%</p>
            </motion.div>

            {/* 임대비율 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative hover:border-indigo-500/50 hover:bg-white hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-all border border-indigo-100/50">
                <Percent className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">의무 공공 임대 비율</span>
              <p className="text-xl font-bold text-slate-800 mt-1 font-mono">{details.임대비율}%</p>
            </motion.div>

            {/* 사업단계 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative hover:border-indigo-500/50 hover:bg-white hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-all border border-indigo-100/50">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">현재 공인 추진 단계</span>
              <p className="text-xl font-bold text-slate-800 mt-1 font-sans font-semibold">{details.단계}</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 3: 입지 분석 + 지도 */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto w-full space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-indigo-600 text-xs font-bold tracking-wider uppercase">02 / 지리적 경쟁력</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-sans">실시간 위치 및 교통 가치 분석</h3>
            <p className="text-slate-500 text-xs max-w-lg mx-auto">
              재개발 예정 구역의 대중교통 연결망 및 쾌적한 주택 인프라 분포 수준을 매핑하였습니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* 좌측: 네이버 지도 iframe */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-[400px] relative"
            >
              {/* Fallback load state behind iframe */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-xs flex-col gap-2">
                <MapPin className="w-8 h-8 text-slate-400 animate-bounce" />
                네이버 지도 정보 로딩 중...
              </div>
              
              <iframe
                title={`${input.region} Naver Map`}
                src={`https://map.naver.com/v5/search/${encodeURIComponent(input.region)}`}
                className="w-full h-full relative z-10 border-none"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* 우측: 입지 설명 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 flex flex-col justify-between bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-100">
                  <MapPin className="w-3.5 h-3.5" />
                  대표 입지 장점
                </div>
                
                <h4 className="text-lg font-bold text-slate-800 leading-snug">
                  {input.region} 입지 종합 요약
                </h4>
                
                <p className="text-slate-600 leading-relaxed text-xs whitespace-pre-line">
                  {details.입지}
                  <br />
                  <br />
                  인근 대규모 녹지공간과 간선 교통 허브에 인접해 있어, 명품 대단지 브랜드 타운이 준공될 경우 주변 시세를 선도하는 신축 랜드마크로 급부상할 잠재력이 풍부합니다.
                </p>
              </div>

              {/* Keyword badges */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200/60 rounded-lg text-[10px] font-bold">
                  📍 역세권 근접
                </span>
                <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200/60 rounded-lg text-[10px] font-bold">
                  🌳 숲세권/공원
                </span>
                <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200/60 rounded-lg text-[10px] font-bold">
                  🏫 학군 프리미엄
                </span>
                <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200/60 rounded-lg text-[10px] font-bold">
                  🏢 1군 브랜드 예정
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 4: 투자 분석 (숫자 강조) */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto w-full space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-indigo-600 text-xs font-bold tracking-wider uppercase">03 / 재무 시뮬레이션</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-sans">실수요 및 자본 투자금 정밀 분석</h3>
            <p className="text-slate-500 text-xs max-w-lg mx-auto">
              현재 매입 단가와 대출 비율 등을 적용하여 도출한 예산 총합 분석표입니다.
            </p>
          </motion.div>

          {/* Capital Allocation & Cash Flow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 자기자본 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-slate-50 border border-slate-200 p-8 rounded-2xl space-y-4 hover:border-indigo-500/40 hover:bg-white hover:shadow-sm transition-all"
            >
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">초기 투입 자기자본</span>
              <p className="text-2xl font-black text-slate-800 font-mono">{formatKoreanWon(equity)}</p>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                매입가 {input.purchasePrice}억 원에서 총 대출 실행액 {loanAmount.toFixed(1)}억 원(LTV {input.loanRatio}%)을 제한 실제 순 현금 투입액입니다.
              </div>
            </motion.div>

            {/* 대출금 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-slate-50 border border-slate-200 p-8 rounded-2xl space-y-4 hover:border-amber-500/40 hover:bg-white hover:shadow-sm transition-all"
            >
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">실행 총 대출금</span>
              <p className="text-2xl font-black text-slate-800 font-mono">{formatKoreanWon(loanAmount)}</p>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                사용 가용 한도 내 대출 비중 {input.loanRatio}%를 온전히 적용하여 실행하는 가상의 이자 납부 대출금 총액입니다.
              </div>
            </motion.div>

            {/* 이자비용 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-slate-50 border border-slate-200 p-8 rounded-2xl space-y-4 hover:border-red-500/40 hover:bg-white hover:shadow-sm transition-all"
            >
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">예상 보유 기간 이자</span>
              <p className="text-2xl font-black text-slate-800 font-mono">{formatKoreanWon(interestCost)}</p>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                연이율 {input.interestRate}% 기준, 준공 예정 및 투자 회수 시점인 보유 {input.holdingPeriod}년 동안 발생하는 이자 부담 총비용입니다.
              </div>
            </motion.div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 총투자금 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-slate-50 border border-slate-200 p-8 rounded-2xl space-y-4 hover:border-indigo-500/40 hover:bg-white hover:shadow-sm transition-all"
            >
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">실제 최종 총투자금</span>
              <p className="text-2xl font-black text-slate-800 font-mono">{formatKoreanWon(totalInvestment)}</p>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                자기자본 {equity.toFixed(1)}억 원 + 추가분담금 {additionalPayment.toFixed(1)}억 원(분양가 {details.분양가}억 원 - 권리가 {details.권리가액}억 원) + 총 이자액의 실질 자본 누적액입니다.
              </div>
            </motion.div>

            {/* 순수익 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-2xl space-y-4 hover:border-indigo-500/40 hover:bg-white hover:shadow-sm transition-all"
            >
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">세전 예상 순수익</span>
              <p className="text-2xl font-black text-emerald-600 font-mono">{formatKoreanWon(netProfit)}</p>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                준공 이후 최종 가치 평가 시세인 {details.시세}억 원에서 투입된 전체 총투자금을 제외한 순이익 프리미엄 예상액입니다.
              </div>
            </motion.div>

            {/* 수익률 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-slate-50 border border-slate-200 p-8 rounded-2xl space-y-4 hover:border-purple-500/40 hover:bg-white hover:shadow-sm transition-all"
            >
              <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">최종 투자 수익률 (ROI)</span>
              <p className={`text-2xl font-black font-mono ${returnOnInvestment >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {returnOnInvestment.toFixed(1)}%
              </p>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                초기 순현금 투입 자금(자기자본 {equity.toFixed(1)}억 원) 대비 창출된 세전 순수익의 가치 비례 상승 수익률 성적표입니다.
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 5: 차트 (Recharts) */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto w-full space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-indigo-600 text-xs font-bold tracking-wider uppercase">04 / 데이터 시각화</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-sans">자본 흐름 및 수익 가치 분포 차트</h3>
            <p className="text-slate-500 text-xs max-w-lg mx-auto">
              자기자본 투입부터 예상 분담금, 이자비용, 최종 시세와 세전 순이익까지의 자금 성격별 규모를 비교 분석합니다.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="bg-white border border-slate-200 p-6 sm:p-10 rounded-2xl shadow-sm relative"
          >
            {/* Legend Indicators */}
            <div className="flex flex-wrap gap-4 justify-center mb-8 text-[11px] font-bold text-slate-500">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />자기자본</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />추가분담금</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />보유이자</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" />총투자금</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" />준공시세</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />순수익</div>
            </div>

            {/* Recharts BarChart */}
            <div className="h-[380px] w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}억`}
                    tick={{ fill: '#64748b', fontWeight: 'bold' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-md font-sans space-y-1">
                            <p className="text-[10px] text-slate-400 font-bold">{data.name}</p>
                            <p className="text-xs font-bold text-slate-800">
                              {formatKoreanWon(data.amount)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-center text-slate-400 text-[10px] mt-6 leading-relaxed">
              * 가로축 수치는 모두 '억 원' 단위 기준으로 시각화 처리되었습니다.
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: 투자 결론 */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto w-full space-y-10">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-indigo-600 text-xs font-bold tracking-wider uppercase">05 / 투자 최종 심사평</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-sans">시뮬레이션 AI 종합 의견</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="rounded-2xl p-8 sm:p-12 border shadow-lg relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white"
          >
            {/* Visual gradient backdrop decoration consistent with High Density summary card */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${conclusionBgClass} opacity-20 rounded-full blur-2xl`} />

            <div className="space-y-6 relative z-10">
              
              {/* Header result info */}
              <div className="flex flex-wrap items-center gap-4 justify-between pb-6 border-b border-slate-700/60">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">종합 투자 검토 결과</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-lg sm:text-xl font-extrabold text-white">
                      {input.region} 시나리오는 <span className="text-indigo-400">[{conclusionTitle}]</span> 군에 해당합니다.
                    </h4>
                  </div>
                </div>
                
                <div className="bg-slate-950/40 border border-slate-700/50 px-6 py-3 rounded-xl text-center">
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">세전 예상 ROI</span>
                  <span className={`text-lg font-bold font-mono ${returnOnInvestment >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {returnOnInvestment.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Core Commentary */}
              <div className="space-y-4">
                <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-300" />
                  AI 기반 정밀 진단 분석 코멘트
                </span>
                
                <p className="text-slate-200 leading-relaxed text-sm">
                  {aiComment}
                </p>

                <p className="text-slate-400 leading-relaxed text-xs pt-2">
                  본 모형은 입력 값인 매입가 {input.purchasePrice}억 원, 대출 비율 {input.loanRatio}%, 이율 {input.interestRate}%, 그리고 조합 분담 조건을 기반으로 한 계량 경제 모델링 결과물입니다. 재개발 사업은 이주, 철거, 공사 및 시세 변동 등 다양한 사업 지연 요소가 상존하므로 자본 유동성 버퍼를 최소 20% 이상 충분히 확보한 후 진입하실 것을 제안합니다.
                </p>
              </div>

            </div>
          </motion.div>

          {/* 다시 분석하기 버튼 */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center pt-8"
          >
            <button
              onClick={onBack}
              className="py-4 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer group text-sm"
            >
              <ArrowLeft className="w-5 h-5 text-white transition-transform duration-300 group-hover:-translate-x-1" />
              구역 및 투자 조건 다시 설정하기
            </button>
          </motion.div>

        </div>
      </section>

      {/* Footer copyright */}
      <footer className="mt-[80px] pb-12 text-center text-[13px] text-[#888] leading-relaxed relative z-10 w-full">
        <p>© 2026 Redevelopment Analysis</p>
        <p>Developed by 임유은</p>
        <p>Contact: youeun0521@gmail.com</p>
        <p>Built with Next.js</p>
      </footer>
    </div>
  );
}
