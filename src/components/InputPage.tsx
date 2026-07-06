/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  Coins, 
  Percent, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  Zap,
  MapPin
} from 'lucide-react';
import { InvestmentInput } from '../types';
import { regions, tendencyPresets } from '../data';

interface InputPageProps {
  onSubmit: (input: InvestmentInput) => void;
  initialInput?: InvestmentInput;
}

export default function InputPage({ onSubmit, initialInput }: InputPageProps) {
  // Local states initialized with optional previous inputs or neutral preset
  const [region, setRegion] = useState<string>(initialInput?.region || regions[0]);
  const [purchasePrice, setPurchasePrice] = useState<number>(initialInput?.purchasePrice || 7.5);
  const [loanRatio, setLoanRatio] = useState<number>(initialInput?.loanRatio || 50);
  const [interestRate, setInterestRate] = useState<number>(initialInput?.interestRate || 4.2);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(initialInput?.holdingPeriod || 4);
  const [tendency, setTendency] = useState<'conservative' | 'neutral' | 'aggressive'>(
    initialInput?.tendency || 'neutral'
  );

  // Set preset handler
  const handleTendencySelect = (type: 'conservative' | 'neutral' | 'aggressive') => {
    setTendency(type);
    const preset = tendencyPresets[type];
    setPurchasePrice(preset.purchasePrice);
    setLoanRatio(preset.loanRatio);
    setInterestRate(preset.interestRate);
    setHoldingPeriod(preset.holdingPeriod);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      region,
      purchasePrice,
      loanRatio,
      interestRate,
      holdingPeriod,
      tendency
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Decorative background elements consistent with High Density theme */}
      <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-b from-indigo-600/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 -left-40 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10 flex-grow flex flex-col justify-center">
        {/* Header Section with elegant branding badge */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm border border-indigo-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            재개발 맞춤 가치 평가 솔루션 v1.0
          </motion.div>
          
          <div className="flex justify-center items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">R</div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl font-display font-black tracking-tight text-slate-800"
            >
              재개발 투자 <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">시뮬레이터</span>
            </motion.h1>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-3 text-sm text-slate-500 max-w-md mx-auto"
          >
            원하는 구역과 개인 투자 여건을 입력하여 정밀 사업성 보고서와 예상 수익률을 즉시 확인해 보세요.
          </motion.p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 구역 선택 */}
            <div className="space-y-3">
              <label htmlFor="region-select" className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-400" />
                분석 대상 구역 선택
              </label>
              <div className="relative">
                <select
                  id="region-select"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none font-semibold cursor-pointer"
                >
                  {regions.map((name) => (
                    <option key={name} value={name}>
                      {name} {['신대방3구역', '흑석9구역'].includes(name) ? '🔥 (분석 데이터 보유)' : '(데이터 준비중)'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* 투자 성향 선택 */}
            <div className="space-y-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-slate-400" />
                투자 성향 빠른 세팅
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 보수적 */}
                <button
                  type="button"
                  onClick={() => handleTendencySelect('conservative')}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                    tendency === 'conservative'
                      ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      보수적
                    </span>
                    {tendency === 'conservative' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    안전 마진 중시, 대출 비중 30%, 안정지향 장기 투자
                  </p>
                </button>

                {/* 중립적 */}
                <button
                  type="button"
                  onClick={() => handleTendencySelect('neutral')}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                    tendency === 'neutral'
                      ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-indigo-500" />
                      중립적
                    </span>
                    {tendency === 'neutral' && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    적정 지분과 레버리지 혼합, 보편적인 투자 밸런스
                  </p>
                </button>

                {/* 공격적 */}
                <button
                  type="button"
                  onClick={() => handleTendencySelect('aggressive')}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                    tendency === 'aggressive'
                      ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-indigo-500" />
                      공격적
                    </span>
                    {tendency === 'aggressive' && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    레버리지 극대화 70%, 높은 위험 및 단기 고수익 추구
                  </p>
                </button>

              </div>
            </div>

            {/* 입력 상세 수치 (2x2 Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 매입가 */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label htmlFor="purchase-price-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-500" />
                    매입가 (조합원권 권리 포함)
                  </label>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {purchasePrice.toFixed(1)}억 원
                  </span>
                </div>
                <div className="flex gap-3">
                  <input
                    id="purchase-price-input"
                    type="range"
                    min="1.0"
                    max="25.0"
                    step="0.1"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="50.0"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-20 px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-1.5">
                  {[3, 5, 10, 15].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setPurchasePrice(val)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-white text-slate-600 border border-slate-200 rounded hover:border-indigo-300 hover:text-indigo-500 transition cursor-pointer"
                    >
                      {val}억
                    </button>
                  ))}
                </div>
              </div>

              {/* 대출비율 */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label htmlFor="loan-ratio-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-indigo-500" />
                    대출 비율 (LTV)
                  </label>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {loanRatio}%
                  </span>
                </div>
                <div className="flex gap-3">
                  <input
                    id="loan-ratio-input"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={loanRatio}
                    onChange={(e) => setLoanRatio(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={loanRatio}
                    onChange={(e) => setLoanRatio(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-20 px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-1.5">
                  {[0, 30, 50, 70].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setLoanRatio(val)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-white text-slate-600 border border-slate-200 rounded hover:border-indigo-300 hover:text-indigo-500 transition cursor-pointer"
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 금리 */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label htmlFor="interest-rate-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-red-500" />
                    대출 금리 (연이율)
                  </label>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {interestRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex gap-3">
                  <input
                    id="interest-rate-input"
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-20 px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-1.5">
                  {[3.0, 3.8, 4.2, 5.0].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setInterestRate(val)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-white text-slate-600 border border-slate-200 rounded hover:border-indigo-300 hover:text-indigo-500 transition cursor-pointer"
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 보유기간 */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label htmlFor="holding-period-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    보유 기간 (준공/매도까지 예상)
                  </label>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {holdingPeriod}년
                  </span>
                </div>
                <div className="flex gap-3">
                  <input
                    id="holding-period-input"
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={holdingPeriod}
                    onChange={(e) => setHoldingPeriod(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={holdingPeriod}
                    onChange={(e) => setHoldingPeriod(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-1.5">
                  {[2, 3, 5, 8].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setHoldingPeriod(val)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-white text-slate-600 border border-slate-200 rounded hover:border-indigo-300 hover:text-indigo-500 transition cursor-pointer"
                    >
                      {val}년
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* 제출 버튼 */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              분석하기
              <ArrowRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>

          </form>
        </motion.div>
      </div>

      <footer className="mt-[80px] pb-12 text-center text-[13px] text-[#888] leading-relaxed relative z-10 w-full">
        <p>© 2026 Redevelopment Analysis</p>
        <p>Developed by 임유은</p>
        <p>Contact: youeun0521@gmail.com</p>
        <p>Built with Next.js</p>
      </footer>
    </div>
  );
}

