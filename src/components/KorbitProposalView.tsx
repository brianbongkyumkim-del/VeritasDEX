import React, { useState } from 'react';
import { KORBIT_PROPOSAL_MARKDOWN } from '../data/korbitProposal';
import { Copy, Check, Download, Building2, ShieldCheck, TrendingUp, Handshake, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

interface KorbitProposalViewProps {
  onGoToSimulator: () => void;
  onGoToPools: () => void;
}

export const KorbitProposalView: React.FC<KorbitProposalViewProps> = ({
  onGoToSimulator,
  onGoToPools,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(KORBIT_PROPOSAL_MARKDOWN).then(() => {
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
    textArea.value = KORBIT_PROPOSAL_MARKDOWN;
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
    const blob = new Blob([KORBIT_PROPOSAL_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Veritas_Korbit_Partnership_Proposal.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Top Banner & Action Controls */}
      <div className="p-6 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Strategic Exchange Partnership
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold">
                  대한민국 1호 거래소 · NXC & SK스퀘어 주주사
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                Veritas Protocol × Korbit (코빗) 협업 제안서
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
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-blue-600 font-bold">복사 완료!</span>
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>다운로드 (.md)</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-slate-500 text-[11px]">코빗 고객 델타-뉴트럴 펀드</div>
            <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base mt-0.5">
              12.0% – 16.5% APR
            </div>
            <div className="text-[10px] text-slate-400">원금 보존형 달러 실물수익</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-slate-500 text-[11px]">무기한 선물 수수료</div>
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base mt-0.5">
              0.8 – 1.1 bps
            </div>
            <div className="text-[10px] text-slate-400">하이퍼리퀴드 대비 -60%</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-slate-500 text-[11px]">프로토콜 수수료 분배</div>
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base mt-0.5">
              80.0% 직배분
            </div>
            <div className="text-[10px] text-slate-400">코빗 앵커 LP 직결 현금흐름</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-slate-500 text-[11px]">NXC·SK 웹3 시너지</div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-base mt-0.5">
              게임 IP & TUOL 풀
            </div>
            <div className="text-[10px] text-slate-400">넥슨 게임토큰 선물 페어</div>
          </div>
        </div>
      </div>

      {/* Rendered Proposal Article */}
      <article className="p-8 sm:p-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-8 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
        
        {/* Title Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
            <span>STRATEGIC PARTNERSHIP PROPOSAL</span>
            <span aria-hidden="true">·</span>
            <span>VERITAS PROTOCOL × KORBIT</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            [전략적 파트너십 제안서] Veritas Protocol × Korbit (코빗)
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            국내 규제 한계를 극복하는 글로벌 온체인 무기한 선물(Perp DEX) 인프라 구축 및 NXC·SK스퀘어 생태계 연계 전략
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 font-mono">
            <span>제출처: 주식회사 코빗 (Korbit) 이사회 및 NXC / SK스퀘어 전략위원회</span>
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
            대한민국 가상자산 시장은 세계 최고 수준의 개인 및 전문 트레이더 유동성을 보유하고 있으나, <strong>금융위원회의 국내 파생상품(선물/마진) 거래 금지 규제</strong>로 인해 연간 수백조 원 규모의 선물 거래량과 수수료 수익이 Binance, Bybit, 그리고 최근 급부상한 <strong>Hyperliquid</strong> 등 해외 거래소로 고스란히 유출되고 있습니다.
          </p>
          <p>
            코빗(Korbit)은 대한민국 1호 거래소이자 <strong>NXC(넥슨, 60%+) 및 SK스퀘어(SK그룹, 30%+)</strong>라는 국내 최고 수준의 기관 주주 구성을 갖추었음에도 불구하고, 국내 현물 시장의 점유율 경쟁에서 구조적 한계에 직면해 있습니다.
          </p>
          <p>
            <strong>Veritas Protocol</strong>과의 협업은 코빗이 국내 특금법 규제 리스크 없이 <strong>비수탁형(Non-Custodial) 글로벌 온체인 무기한 선물 시장</strong>에 진출하여 해외로 유출되는 국내 트레이더를 되찾아오고, 새로운 막대한 온체인 현금흐름을 창출할 수 있는 유일무이한 돌파구입니다.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            2. 4대 전략적 협업 분야 (Core Strategic Pillars)
          </h3>
          
          <div className="space-y-3 pt-1">
            
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="text-blue-600 font-mono font-bold">Pillar 1.</span>
                <span>코빗 글로벌 온체인 무기한 선물 게이트웨이 (Korbit Web3 Portal)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                코빗 패스(Korbit Pass) 웹3 지갑을 통해 중앙화 거래소의 직접 선물 취급 규제(자본시장법/특금법) 마찰 없이, 사용자가 개인 지갑으로 Veritas 스마트 컨트랙트와 직접 연결되어 초고속 무기한 선물을 거래하는 DeFi Gateway 구축.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="text-blue-600 font-mono font-bold">Pillar 2.</span>
                <span>Hyperliquid 대항 '초저수수료(0.8 bps)' 및 독성 차익거래(LVR) 방어</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Hyperliquid(2.8 bps) 대비 60% 이상 저렴한 0.8~1.1 bps의 초저수수료로 바이낸스/하이퍼리퀴드로 이탈한 국내 대형 트레이더를 코빗 생태계로 재유치. 동적 독성 오라클을 통해 CEX 간 지연 차익거래자로부터 유동성 손실을 85% 이상 방어.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="text-blue-600 font-mono font-bold">Pillar 3.</span>
                <span>코빗 고객 전용 '원금 보존형 델타-뉴트럴 실물 수익 펀드' (연 12~16% APR)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                시장 폭락 시에도 원금 손실 위험이 없는 시니어 델타-뉴트럴 볼트 서비스 출시. 영구 선물 숏 베이시스를 통해 델타 노출도를 0.5% 미만으로 헤지하고, 프로토콜 수수료를 실시간 분배받아 코빗 고객에게 고수익 달러 수익률 제공.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="text-blue-600 font-mono font-bold">Pillar 4.</span>
                <span>NXC(넥슨) 게임 토큰 및 SK스퀘어 Web3 자산 온체인 풀(TUOL) 연계</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                넥슨의 메이플스토리 유니버스 등 웹3 게임 경제 토큰 및 SK스퀘어 포트폴리오 디지털 자산의 유동성을 Veritas 사용자 소유 풀에 예치하여 글로벌 선물 페어 신설 및 유동성 허브 선점.
              </p>
            </div>

          </div>
        </div>

        {/* Section 3: Financial Simulation Table */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            3. 재무 및 비즈니스 효과 (일 거래대금 $1.5B 기준)
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">비교 항목</th>
                  <th className="py-2.5 px-3">현재 코빗 (현물 전용)</th>
                  <th className="py-2.5 px-3">Veritas × 코빗 모델</th>
                  <th className="py-2.5 px-3">코빗 기대 가치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">선물 거래량 확보</td>
                  <td className="py-2.5 px-3 text-slate-500">0원 (국내 규제 제한)</td>
                  <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">일 $1.5B (연 $547B)</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">글로벌 파생상품 파이 개척</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">프로토콜 연간 수수료 풀</td>
                  <td className="py-2.5 px-3 text-slate-500">현물 수수료에 국한</td>
                  <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">약 $65.7M / 년</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">수수료 기반 대규모 확장</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">LP 수수료 직배분 (80%)</td>
                  <td className="py-2.5 px-3 text-slate-500">없음</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">$52.56M / 년</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">코빗 및 예치 고객 실시간 분배</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">코빗 앵커 LP 수익 ($50M 기준)</td>
                  <td className="py-2.5 px-3 text-slate-500">없음</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">연 $8.5M – $11.0M</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">자기자본 운용 순이익 급증</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold">LVR 방어로 보존된 자본</td>
                  <td className="py-2.5 px-3 text-slate-500">없음</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">+$18.4M / 년</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-emerald-600">HFT 독성 차익거래 원천 차단</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Roadmap */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            4. 단계별 공동 추진 로드맵 (Execution Schedule)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">1단계 (M1-M2): 기술 샌드박스 연동 & 법률 검토</strong>
              <p className="text-slate-500 mt-0.5">코빗 웹3 지갑(Korbit Pass) 연동, 대형 로펌(김앤장/광장) DeFi 게이트웨이 법적 안전성 의견서 확보, NXC·SK스퀘어 전략 브리핑</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">2단계 (M3-M4): 파일럿 런칭 & 코빗 고객 전용 델타-뉴트럴 볼트 출시</strong>
              <p className="text-slate-500 mt-0.5">코빗 $20M~$40M 규모 앵커 유동성 투입, 연 12~16% 달러 실물 수익 예치 상품 코빗 앱 내 전용 인터페이스 오픈</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">3단계 (M5+): 넥슨·SK 웹3 자산 연계 및 글로벌 마케팅</strong>
              <p className="text-slate-500 mt-0.5">메이플스토리 유니버스 등 넥슨 게임 토큰 선물 페어 신설, 일 거래대금 $2B+ 돌파 및 코빗의 글로벌 웹3 파생상품 허브화</p>
            </div>
          </div>
        </div>

        {/* Call to Action Box */}
        <div className="p-6 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-base">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>코빗 경영진 및 전략기획팀 대상 1차 실무 미팅 제안</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Veritas 프로토콜의 라이브 매칭 엔진, 실시간 오라클, 그리고 코빗 지갑 연동 아키텍처를 직접 시연해 드릴 수 있습니다. 주주사(NXC, SK스퀘어)의 기업 가치를 획기적으로 높일 수 있는 구체적인 협력 텀시트(Term Sheet) 협의를 제안드립니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={onGoToSimulator}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
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
