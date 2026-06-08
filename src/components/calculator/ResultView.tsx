'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult } from '@/lib/calculate';
import {
  Trophy,
  FileText,
  BarChart3,
  Calculator,
  ChevronRight,
  Sparkles,
  Hash,
  Sigma,
  Zap,
} from 'lucide-react';

interface ResultViewProps {
  result: CalculationResult | null;
}

export default function ResultView({ result }: ResultViewProps) {
  if (!result) {
    return null;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* ═══════════════════════════════════════════════════════════════
          HERO: Final Result
          ═══════════════════════════════════════════════════════════════ */}
      <Card className="glass overflow-hidden border-sky-500/20 shadow-[0_0_50px_rgba(56,189,248,0.15)] relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/20 to-transparent blur-2xl" />
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500 animate-bounce" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              النتيجة النهائية الختامية
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-white">القوة المختزلة</CardTitle>
        </CardHeader>
        <CardContent className="pb-10 pt-4">
          <div className="relative flex justify-center items-center px-4">
            <div className="absolute inset-0 bg-sky-500/20 blur-[100px] rounded-full scale-50 group-hover:scale-100 transition-transform duration-1000" />
            <span className="text-[12rem] font-black leading-none bg-gradient-to-b from-white via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-in zoom-in duration-1000">
              {result.finalReduced}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════
          STEP 1: Letter Decomposition & Numbering
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/20">
            ١
          </div>
          <h3 className="text-lg font-bold tracking-tight">
            الخطوة الأولى: العد الطبيعي (مواقع الحروف)
          </h3>
        </div>

        <Card className="glass border-white/5 overflow-hidden">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                النص الموحد
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3" dir="rtl">
              {result.sequence.map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-white group-hover:bg-sky-500/10 group-hover:border-sky-500/30 group-hover:text-sky-300 transition-all duration-300">
                    {step.char}
                  </div>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-sky-400 transition-colors">
                    {step.position}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          STEP 2: Position Sum (No Simplification)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-500/20">
            ٢
          </div>
          <h3 className="text-lg font-bold tracking-tight">
            الخطوة الثانية: تحديد قيم الحروف المكررة (بدون تبسيط)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.charAnalysis.map((analysis, idx) => (
            <Card
              key={idx}
              className="glass border-white/5 hover:border-violet-500/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 text-right">
                <div className="text-[0.65rem] font-black text-slate-600 group-hover:text-violet-500/50 transition-colors uppercase">
                  حرف #{idx + 1}
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-5xl font-black text-white group-hover:scale-110 group-hover:text-violet-300 transition-all duration-500">
                    {analysis.char}
                  </span>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-violet-400">
                      {analysis.positionsSum}
                    </span>
                    <span className="text-[0.6rem] font-bold text-slate-600 uppercase">
                      المجموع
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-[0.65rem] font-bold">
                    <span className="text-slate-500">المواقع</span>
                    <span className="text-teal-400 font-mono">
                      {analysis.positions.join(' + ')}
                    </span>
                  </div>
                  <p className="text-[0.6rem] text-slate-500 leading-relaxed italic">
                    تم جمع الأرقام التسلسلية للمواضع بدون أي تبسيط.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          STEP 3: Multiplication & Total Sum
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-sky-500/20">
            ٣
          </div>
          <h3 className="text-lg font-bold tracking-tight">
            الخطوة الثالثة: ضرب قيم الخطوة ٢ في رتب الخطوة ١
          </h3>
        </div>

        <Card className="glass border-white/5 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-6 p-6 bg-white/[0.02] rounded-2xl border border-white/5 min-h-[100px]" dir="rtl">
              {result.sequence.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1 group">
                    <span className="text-xs font-bold text-slate-600 group-hover:text-sky-500 transition-colors">
                      {step.char}
                    </span>
                    <div className="text-[0.65rem] text-slate-400 font-mono" dir="ltr">
                      {step.position} × {step.charValue}
                    </div>
                    <div className="px-3 h-10 min-w-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-lg shadow-inner group-hover:scale-110 transition-transform">
                      {step.value}
                    </div>
                  </div>
                  {i < result.sequence.length - 1 && (
                    <div className="text-slate-700 font-black text-lg self-end pb-2">
                      +
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Sigma className="w-4 h-4 text-sky-400" />
                <span className="text-[0.6rem] font-black text-slate-600 uppercase tracking-widest">
                  مجموع الخطوة الثالثة
                </span>
              </div>
              <div className="text-4xl font-black text-white bg-gradient-to-r from-sky-500/10 to-blue-500/10 px-8 py-3 rounded-2xl border border-sky-500/20 shadow-lg shadow-sky-500/5">
                {result.step3Sum}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          STEP 4: Power Calculation & Final Reduction
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-amber-500/20">
            ٤
          </div>
          <h3 className="text-lg font-bold tracking-tight">
            الخطوة الرابعة: تبسيط ناتج الخطوة الثالثة ورفع الأس
          </h3>
        </div>

        <Card className="glass border-white/5 overflow-hidden">
          <CardContent className="p-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  تبسيط ناتج الخطوة الثالثة إلى رقم أحادي
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {result.step4ReducedSteps.map((step, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span
                      className={`font-black ${
                        i === result.step4ReducedSteps.length - 1
                          ? 'text-amber-400 text-3xl'
                          : 'text-slate-300 text-xl'
                      }`}
                    >
                      {step}
                    </span>
                    {i < result.step4ReducedSteps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  الصيغة الأسية المطلوبة
                </span>
              </div>
              <div className="text-center p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                <span className="text-2xl font-black text-white">
                  {result.step4Reduced}
                </span>
                <sup className="text-lg font-black text-amber-400 mr-1">
                  {result.step3Sum}
                </sup>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    حساب المجموع النهائي (Sum)
                  </span>
                </div>
                <span className="text-[0.6rem] font-bold text-slate-600 bg-white/5 px-2 py-1 rounded-full">
                  {result.powerDigitCount} خانة
                </span>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 overflow-x-auto max-h-32 scrollbar-hide">
                <p className="text-sm font-mono font-bold text-slate-300 break-all leading-relaxed" dir="ltr">
                  {result.powerResult.length > 500
                    ? result.powerResult.substring(0, 250) +
                      ' ... ' +
                      result.powerResult.substring(result.powerResult.length - 250)
                    : result.powerResult}
                </p>
              </div>
            </div>

            {result.powerReductionSteps && result.powerReductionSteps.length > 1 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    مسار الاختزال النهائي
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  {result.powerReductionSteps
                    .filter((_, i) => i > 0)
                    .map((step, i, arr) => {
                      const isLast = i === arr.length - 1;
                      return (
                        <div key={i} className="flex flex-col items-center gap-2">
                          {i === 0 && (
                            <div className="flex flex-col items-center gap-1 text-slate-500">
                              <span className="text-[0.6rem] font-black uppercase tracking-widest opacity-50">
                                مجموع الخانات
                              </span>
                              <ChevronRight className="w-4 h-4 rotate-90" />
                            </div>
                          )}
                          <span
                            className={`font-black ${
                              isLast
                                ? 'text-4xl text-amber-400'
                                : 'text-xl text-slate-300'
                            }`}
                          >
                            {step}
                          </span>
                          {!isLast && (
                            <div className="flex flex-col items-center gap-1 text-slate-500">
                              <ChevronRight className="w-4 h-4 rotate-90" />
                              <span className="text-[0.6rem] font-black uppercase tracking-widest opacity-50">
                                جمع المكونات
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Summary Cards
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass border-white/5 glass-hover transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                النص الموحد
              </CardTitle>
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
              <p
                className="text-3xl font-bold text-center text-sky-200 tracking-[0.3em] break-all"
                dir="rtl"
              >
                {result.normalized
                  .trim()
                  .replace(/\s+/g, ' ')
                  .split('')
                  .join(' ')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/5 glass-hover transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-400" />
                ملخص الأرقام
              </CardTitle>
            </div>
            <div className="w-2 h-2 rounded-full bg-purple-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: 'النص الأصلي',
                value: result.original,
                color: 'text-slate-300',
                rtl: true,
              },
              {
                label: 'إجمالي عدد الحروف',
                value: result.normalized.length,
                color: 'text-sky-400',
                rtl: false,
              },
              {
                label: 'الناتج الكلي (خطوة ٣)',
                value: result.step3Sum,
                color: 'text-sky-400',
                rtl: false,
              },
              {
                label: 'الرقم المبسط',
                value: result.step4Reduced,
                color: 'text-amber-400 font-black',
                rtl: false,
              },
              {
                label: 'عدد خانات ناتج القوة',
                value: result.powerDigitCount,
                color: 'text-slate-400',
                rtl: false,
              },
              {
                label: 'القيمة النهائية',
                value: result.finalReduced,
                color: 'text-white font-black text-xl',
                rtl: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <span className="text-xs font-bold text-slate-500">
                  {item.label}
                </span>
                <span
                  className={`${item.color} break-all text-right ml-4`}
                  dir={item.rtl ? 'rtl' : 'ltr'}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
