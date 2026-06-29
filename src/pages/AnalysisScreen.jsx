import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts'
import { GlassCard } from '../components/ui/GlassCard'
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react'

export default function AnalysisScreen({ onNavigate, records }) {
  const [selectedEye, setSelectedEye] = useState('right') // left (좌 OS), right (우 OD)
  const [managementPressure, setManagementPressure] = useState(20) // 관리안압 기본값 20

  // 날짜 범위 상태 (기본 최근 30일)
  const [startDate, setStartDate] = useState('2026-05-31')
  const [endDate, setEndDate] = useState('2026-06-29')

  // 필터링 및 그래프용 데이터 가공
  const [chartData, setChartData] = useState([])
  const [stats, setStats] = useState({
    target: 17.0,
    max: 0,
    min: 0,
    efficiency: 0
  })

  useEffect(() => {
    // 1. 눈 방향 및 날짜 범위 필터링
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    const filtered = records.filter(r => {
      const rDate = new Date(r.date)
      return r.eye === selectedEye && rDate >= start && rDate <= end
    })

    // 2. 날짜별 평균 계산 (동일 날짜에 여러 기록이 있을 경우 일 평균값 사용)
    const dateMap = {}
    filtered.forEach(r => {
      if (!dateMap[r.date]) {
        dateMap[r.date] = { sum: 0, count: 0 }
      }
      dateMap[r.date].sum += r.value
      dateMap[r.date].count += 1
    })

    // 3. Recharts 포맷으로 변환 및 날짜순 정렬
    const sortedData = Object.keys(dateMap)
      .sort()
      .map(date => {
        const avgVal = Number((dateMap[date].sum / dateMap[date].count).toFixed(1))
        // 차트 라벨 가독성을 위해 월/일만 추출 (예: '29일' 혹은 '06.29')
        const label = date.split('-')[2] + '일'
        return {
          name: label,
          fullDate: date,
          value: avgVal
        }
      })

    setChartData(sortedData)

    // 4. 통계 계산 (최고, 최저, 관리효율)
    if (filtered.length > 0) {
      const values = filtered.map(r => r.value)
      const maxVal = Math.max(...values)
      const minVal = Math.min(...values)

      // 관리효율 계산: 안압이 관리안압(예: 20mmHg) 이하로 유지된 비율
      // 녹색 정상 범위 기준(예: 10 ~ 20 mmHg)
      const normalCount = filtered.filter(r => r.value >= 10 && r.value <= managementPressure).length
      const efficiency = Math.round((normalCount / filtered.length) * 100)

      setStats({
        target: 17.0,
        max: maxVal,
        min: minVal,
        efficiency: efficiency
      })
    } else {
      setStats({
        target: 17.0,
        max: 0,
        min: 0,
        efficiency: 0
      })
    }
  }, [records, selectedEye, startDate, endDate, managementPressure])

  // 관리안압 업/다운 버튼 이벤트
  const handleIncreasePressure = () => {
    setManagementPressure(prev => Math.min(prev + 1, 30))
  }
  const handleDecreasePressure = () => {
    setManagementPressure(prev => Math.max(prev - 1, 10))
  }

  return (
    <div className="flex flex-col h-full text-white overflow-y-auto scrollbar-hide">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <button 
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 cursor-pointer"
          onClick={() => onNavigate('menu')}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-bold tracking-wide">기간별 분석</h2>
        
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

      {/* 날짜 범위 텍스트 */}
      <div className="text-center text-xs text-gray-400 mb-4 flex-shrink-0 space-y-1">
        <div className="text-sm font-bold text-gray-200">기간별 일 평균 안압 변화</div>
        <div>📅 {startDate.replace(/-/g, '. ')}. 부터</div>
        <div>📅 {endDate.replace(/-/g, '. ')}. 까지</div>
      </div>

      {/* 차트 영역 */}
      <GlassCard className="w-full h-48 p-2 bg-white/4 border-white/8 rounded-2xl mb-4 flex-shrink-0 relative">
        {chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
            분석할 데이터가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.4)" 
                fontSize={9} 
                tickLine={false}
              />
              <YAxis 
                domain={[0, 50]} 
                ticks={[0, 10, 20, 30, 40, 50]}
                stroke="rgba(255,255,255,0.4)" 
                fontSize={9}
                tickLine={false}
              />
              {/* 관리안압 임계선 표시 */}
              <ReferenceLine 
                y={managementPressure} 
                stroke="#f87171" 
                strokeDasharray="3 3" 
                label={{ value: `관리 ${managementPressure}`, fill: '#f87171', fontSize: 8, position: 'top' }} 
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ stroke: '#10b981', strokeWidth: 2, r: 3, fill: '#0b0f19' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      {/* 관리안압 & 관리효율 2열 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-4 flex-shrink-0">
        {/* 관리안압 설정 카드 */}
        <GlassCard className="p-4 bg-white/5 border-white/10 rounded-2xl flex flex-col justify-between">
          <span className="text-[11px] text-gray-400">관리안압</span>
          <div className="flex items-center justify-between mt-3">
            <span className="text-3xl font-black text-white">{managementPressure}</span>
            <div className="flex flex-col gap-0.5">
              <button 
                className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors"
                onClick={handleIncreasePressure}
              >
                <ChevronUp size={16} className="text-emerald-400" />
              </button>
              <button 
                className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors"
                onClick={handleDecreasePressure}
              >
                <ChevronDown size={16} className="text-emerald-400" />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* 관리효율 카드 */}
        <GlassCard className="p-4 bg-white/5 border-white/10 rounded-2xl flex flex-col justify-between items-center text-center">
          <span className="text-[11px] text-gray-400 w-full text-left">관리효율</span>
          <div className="relative flex items-center justify-center mt-2">
            {/* 가상 도넛 차트 */}
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="transparent" />
              <circle 
                cx="28" 
                cy="28" 
                r="22" 
                stroke="#10b981" 
                strokeWidth="4" 
                fill="transparent" 
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * stats.efficiency) / 100}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">{stats.efficiency}%</span>
          </div>
        </GlassCard>
      </div>

      {/* 기타 통계 카드 */}
      <GlassCard className="p-4 bg-white/5 border-white/10 rounded-2xl mb-6 flex-shrink-0 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">목표안압</span>
          <span className="font-bold text-gray-200">{stats.target.toFixed(1)} mmHg</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">최고안압</span>
          <span className="font-bold text-red-400">{stats.max.toFixed(1)} mmHg</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">최저안압</span>
          <span className="font-bold text-blue-400">{stats.min.toFixed(1)} mmHg</span>
        </div>
      </GlassCard>

      {/* 하단 확인 버튼 */}
      <button 
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all active:scale-98 shadow-lg shadow-emerald-950/20 mt-auto mb-4 flex-shrink-0"
        onClick={() => onNavigate('menu')}
      >
        확인
      </button>
    </div>
  )
}
