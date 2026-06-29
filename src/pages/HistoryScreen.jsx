import { useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { ArrowLeft, TrendingUp, Menu } from 'lucide-react'

export default function HistoryScreen({ onNavigate, records, onSelectRecord }) {
  const [selectedEye, setSelectedEye] = useState('right') // left (좌안 OS), right (우안 OD)

  // 선택한 눈의 데이터만 필터링
  const filteredRecords = records.filter(r => r.eye === selectedEye)

  // 평균 안압 계산
  const averageValue = filteredRecords.length > 0
    ? (filteredRecords.reduce((sum, r) => sum + r.value, 0) / filteredRecords.length).toFixed(1)
    : '0.0'

  return (
    <div className="flex flex-col h-full text-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button 
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 cursor-pointer"
          onClick={() => onNavigate('menu')}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-bold tracking-wide">안압기록</h2>
        
        {/* 좌안/우안 탭 */}
        <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-white/8 text-[10px]">
          <button 
            className={`px-3 py-1 rounded-md font-bold cursor-pointer transition-colors ${
              selectedEye === 'left' ? 'bg-emerald-600 text-white' : 'text-gray-400'
            }`}
            onClick={() => setSelectedEye('left')}
          >
            좌
          </button>
          <button 
            className={`px-3 py-1 rounded-md font-bold cursor-pointer transition-colors ${
              selectedEye === 'right' ? 'bg-emerald-600 text-white' : 'text-gray-400'
            }`}
            onClick={() => setSelectedEye('right')}
          >
            우
          </button>
        </div>
      </div>

      {/* 리스트 본문 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 mb-4 pr-0.5">
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400 gap-2">
            <span className="text-sm">데이터가 없습니다</span>
          </div>
        ) : (
          filteredRecords.map(r => (
            <GlassCard
              key={r.id}
              className="flex justify-between items-center py-3.5 px-5 bg-white/4 border-white/8 cursor-pointer hover:bg-white/8 active:scale-99 transition-all"
              onClick={() => onSelectRecord(r)}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-400">측정시간</span>
                <span className="text-sm font-bold text-gray-200">{r.date} {r.time.slice(0, 5)}</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                  {r.value}
                </span>
                <span className="text-xs text-gray-400 mb-0.5">mmHg</span>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* 일 평균 표시 카드 */}
      <GlassCard className="w-full py-4 px-6 flex justify-between items-center mb-6 bg-white/5 border-white/10 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Daily Average</span>
            <span className="text-sm font-bold text-gray-200">일 평균</span>
          </div>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-black text-emerald-400">{averageValue}</span>
          <span className="text-xs text-gray-400 mb-1">mmHg</span>
        </div>
      </GlassCard>

      {/* 하단 고정 버튼 */}
      <div className="w-full grid grid-cols-2 gap-4 mt-auto mb-4 flex-shrink-0">
        <button 
          className="flex items-center justify-center py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-sm cursor-pointer transition-colors active:scale-98"
          onClick={() => onNavigate('analysis')}
        >
          기간별 분석
        </button>
        <button 
          className="flex items-center justify-center py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all active:scale-98 shadow-lg shadow-emerald-950/20"
          onClick={() => onNavigate('menu')}
        >
          메뉴
        </button>
      </div>
    </div>
  )
}
