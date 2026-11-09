import React, { useState } from 'react';
import { DIGITALX_PROPOSAL_MARKDOWN } from '../data/digitalxProposal';
import { Copy, Check, Download, Building2, ShieldCheck, TrendingUp, Handshake, ExternalLink, ArrowRight } from 'lucide-react';

interface DigitalXProposalViewProps {
  onGoToSimulator: () => void;
  onGoToPools: () => void;
}

export const DigitalXProposalView: React.FC<DigitalXProposalViewProps> = ({
  onGoToSimulator,
  onGoToPools,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(DIGITALX_PROPOSAL_MARKDOWN).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }).catch(() => {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    } catch {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = DIGITALX_PROPOSAL_MARKDOWN;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Fallback copy failed', e);
    }
    document.body.removeChild(textArea);
  };

  const handleDownload = () => {
    const blob = new Blob([DIGITALX_PROPOSAL_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Veritas_DigitalX_Partnership_Proposal.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Top Banner & Action Controls */}
      <div className="p-6 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-600 text-white shadow-xs">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Strategic Institutional Proposal
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  ASX: DCC
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                Veritas Protocol × DigitalX 협업 제안서
              </h1>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>제안서 복사 (Markdown)</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>다운로드 (.md)</span>
            </button>
          </div>
        </div>

        {/* Quick Institutional Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-slate-500 text-[11px]">목표 펀드 수익률</div>
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base mt-0.5">
              12.0% – 16.5% APR
            </div>
            <div className="text-[10px] text-slate-400">시니어 델타-뉴트럴</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-slate-500 text-[11px]">방향성(Delta) 리스크</div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-base mt-0.5">
              &lt; 0.5% (헤지)
            </div>
            <div className="text-[10px] text-slate-400">원금 손실 위험 극소화</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-slate-500 text-[11px]">프로토콜 수수료 분배</div>
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base mt-0.5">
              80.0% 직배분
            </div>
            <div className="text-[10px] text-slate-400">HLP 대비 1.78배 현금흐름</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-slate-500 text-[11px]">LVR 차익거래 방어</div>
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base mt-0.5">
              85% 회수
            </div>
            <div className="text-[10px] text-slate-400">독성 오라클 실시간 방어</div>
          </div>
        </div>
      </div>

      {/* Proposal Rendered Document */}
      <article className="p-8 sm:p-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-8 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
        
        {/* Title Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>STRATEGIC PARTNERSHIP PROPOSAL</span>
            <span aria-hidden="true">·</span>
            <span>VERITAS PROTOCOL × DIGITALX (ASX: DCC)</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            [전략적 파트너십 제안서] Veritas Protocol × DigitalX
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            차세대 투명성 기반 사용자 소유 유동성(TUOL) 탈중앙화 거래소(DEX) 및 기관용 디파이 펀드 인프라 구축
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 font-mono">
            <span>제출처: DigitalX Limited (ASX: DCC) 이사회 및 투자위원회</span>
            <span aria-hidden="true">·</span>
            <span>작성: Veritas Research Foundation</span>
            <span aria-hidden="true">·</span>
            <span>2026년 11월</span>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            1. 제안 배경 및 핵심 요약 (Executive Summary)
          </h3>
          <p>
            온체인 무기한 선물(Perpetual DEX) 시장은 폭발적으로 성장하고 있으며 Hyperliquid가 성공적인 거래량을 보여주었으나, <strong>단일 블랙박스 HLP 풀의 델타 노출 위험, 55%에 달하는 재단의 과도한 수수료 독점, 그리고 지연시간 차익거래(LVR)로 인한 기관 LP의 지속적인 자본 유출</strong>이라는 치명적 한계를 안고 있습니다.
          </p>
          <p>
            호주 최초의 증권거래소(ASX: DCC) 상장 디지털 자산 운용사이자 비트코인 ETF 및 디지털 자산 펀드를 선도하는 <strong>DigitalX</strong>와 차세대 투명성 DEX <strong>Veritas Protocol</strong>의 결합은 기관 투자자들에게 규제 준수형 델타-뉴트럴 실물 수익(Real-Yield) 상품과 투명한 온체인 유동성 인프라를 제공하는 결정적 기회를 창출합니다.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            2. 협업 핵심 전략 (Core Collaboration Pillars)
          </h3>
          
          <div className="space-y-3 pt-1">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="text-emerald-600 font-mono font-bold">Pillar 1.</span>
                <span>DigitalX 기관 전용 '시니어 델타-뉴트럴 유동성 펀드' 공동 출시</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Veritas 시니어 볼트를 기초 자산으로 하여 시장 방향성과 무관하게 연 12.0%~16.5%의 안정적인 USD 수익을 창출하는 기관용 펀드 상품을 DigitalX가 운용. 델타 노출도를 0.5% 미만으로 자동 헤지하여 원금 손실 위험을 원천 차단.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="text-emerald-600 font-mono font-bold">Pillar 2.</span>
                <span>DigitalX의 앵커 LP(Anchor Liquidity) 및 시퀀서 노드 검증인 참여</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                DigitalX가 Veritas 초기 유동성에 $25M~$50M 규모의 앵커 LP로 참여하여 시장 마켓 뎁스를 선도하고, 상응하는 프로토콜 검증인 노드 운영권을 획득하여 추가적인 블록 생성 및 증명 수수료 수익 확보.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="text-emerald-600 font-mono font-bold">Pillar 3.</span>
                <span>동적 독성 오라클(Toxicity Oracle)을 통한 수탁자 책임(Fiduciary Duty) 충족</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                외부 거래소(Binance, Bybit)와의 가격 괴리 발생 시 스프레드를 즉각 확장하여 HFT 차익거래자로부터 유동성을 보호하고, 확보된 차익거래 수수료를 DigitalX 유동성 풀로 100% 환원하여 펀드 수익 극대화.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="text-emerald-600 font-mono font-bold">Pillar 4.</span>
                <span>DigitalX 자체 프랍 데스크 및 펀드의 초저비용(0.8 bps) 거래 인프라</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Hyperliquid 대비 60% 이상 저렴한 비용 구조를 활용하여 DigitalX의 고유 아비트라지 및 헤징 실행 비용을 연간 수십만 달러 이상 절감.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Financial Comparison Table */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            3. 재무 및 수익 시뮬레이션 ($50M 유동성 예치 기준)
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">비교 항목</th>
                  <th className="py-2.5 px-3">Hyperliquid HLP 단순 예치</th>
                  <th className="py-2.5 px-3">Veritas × DigitalX 모델</th>
                  <th className="py-2.5 px-3">DigitalX 기대 가치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">수수료 직배분율</td>
                  <td className="py-2.5 px-3 text-slate-500">~45% (재단 55% 유보)</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">80.0% 직배분</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">+1.78배 현금흐름 증가</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">$50M 예치 연수익</td>
                  <td className="py-2.5 px-3 text-slate-500">$6.9M (13.8% APY)</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">$8.5M – $11.2M</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">+$1.6M ~ $4.3M / 년</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">방향성(Delta) 리스크</td>
                  <td className="py-2.5 px-3 text-amber-500">비헤지 (시장 급락 시 손실)</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">99.5% 자동 헤지</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">원금 보존형 안정성</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">신규 펀드 운용 보수</td>
                  <td className="py-2.5 px-3 text-slate-400">수취 불가</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">2% 운용 + 20% 성과</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">새로운 AUM 매출 창출</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Roadmap */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            4. 단계별 추진 로드맵 (Execution Schedule)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">1단계 (M1-M2): 기술 검증 및 샌드박스 온보딩</strong>
              <p className="text-slate-500 mt-0.5">Veritas 테스트넷 API 및 시니어 델타-뉴트럴 헤징 엔진 실시간 검증, 호주 금융 규제 및 ASX 공시 요건 검토</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">2단계 (M3-M4): 파일럿 유동성 공급 및 기관 펀드 런칭</strong>
              <p className="text-slate-500 mt-0.5">DigitalX $10M~$25M 앵커 유동성 투입, 기관 및 패밀리 오피스 대상 프라이빗 펀드 론칭</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">3단계 (M5+): 글로벌 확장 및 APAC 기관 게이트웨이화</strong>
              <p className="text-slate-500 mt-0.5">ASX 공식 파트너십 공시, APAC 전역 기관 유동성 $100M+ 유치 및 실물자산(RWA) 선물 페어 확장</p>
            </div>
          </div>
        </div>

        {/* Call to Action Footer Box */}
        <div className="p-6 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-base">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>DigitalX 리더십 팀과의 1차 비공개 전략 미팅 제안</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Veritas 프로토콜의 라이브 시뮬레이션 엔진 및 스마트 컨트랙트 실시간 검증을 시연해 드릴 수 있습니다. 본 제안서 내용을 바탕으로 세부 텀시트(Term Sheet) 조율을 위한 실무 화상회의를 제안드립니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={onGoToSimulator}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors"
            >
              <span>라이브 경제성 시뮬레이터 확인</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onGoToPools}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
            >
              <span>TUOL 유동성 풀 확인</span>
            </button>
          </div>
        </div>

      </article>

    </div>
  );
};
