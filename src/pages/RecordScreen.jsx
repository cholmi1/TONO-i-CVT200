import { useState, useEffect, useRef } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { ArrowLeft, Wifi, ToggleLeft, ToggleRight, Edit2, Save, X } from 'lucide-react'

export default function RecordScreen({ onNavigate, isBluetoothConnected, onConnectToggle, onAddRecord }) {
  const [selectedEye, setSelectedEye] = useState('right') // left, right
  const [isAutoMeasuring, setIsAutoMeasuring] = useState(false)
  
  // 측정 안압값 및 시간 상태 (수기 및 자동측정 겸용)
  const [measuredValue, setMeasuredValue] = useState(0)
  const [measuredDate, setMeasuredDate] = useState('')
  const [measuredTime, setMeasuredTime] = useState('')
  
  const [isMeasuring, setIsMeasuring] = useState(false)
  const autoMeasureTimer = useRef(null)

  // 컴포넌트 마운트 시 날짜 및 시간 초기화
  useEffect(() => {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
    
    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const ampm = hours >= 12 ? '오후' : '오전'
    hours = hours % 12
    hours = hours ? hours : 12 // 0시를 12시로 표시
    const timeStr = `${ampm} ${String(hours).padStart(2, '0')}:${minutes}:${seconds}`
    
    setMeasuredDate(dateStr)
    setMeasuredTime(timeStr)
  }, [])

  // 자동측정 로직 (화면의 수치만 업데이트하고, 저장은 되지 않음!)
  useEffect(() => {
    if (isAutoMeasuring && isBluetoothConnected) {
      const measure = () => {
        setIsMeasuring(true)
        
        setTimeout(() => {
          const randomVal = Math.floor(Math.random() * 8) + 12 // 12 ~ 19 사이 임의 값
          const now = new Date()
          let hours = now.getHours()
          const minutes = String(now.getMinutes()).padStart(2, '0')
          const seconds = String(now.getSeconds()).padStart(2, '0')
          const ampm = hours >= 12 ? '오후' : '오전'
          hours = hours % 12
          hours = hours ? hours : 12
          const timeStr = `${ampm} ${String(hours).padStart(2, '0')}:${minutes}:${seconds}`
          
          setMeasuredValue(randomVal)
          setMeasuredTime(timeStr)
          setMeasuredDate(now.toISOString().split('T')[0])
          setIsMeasuring(false)
        }, 1500)
      }

      measure()
      autoMeasureTimer.current = setInterval(measure, 5000)
    } else {
      if (autoMeasureTimer.current) {
        clearInterval(autoMeasureTimer.current)
      }
    }

    return () => {
      if (autoMeasureTimer.current) {
        clearInterval(autoMeasureTimer.current)
      }
    }
  }, [isAutoMeasuring, isBluetoothConnected])

  // 블루투스가 끊기면 자동측정도 해제
  useEffect(() => {
    if (!isBluetoothConnected) {
      setIsAutoMeasuring(false)
    }
  }, [isBluetoothConnected])

  const handleAutoMeasureToggle = () => {
    if (!isBluetoothConnected) {
      alert('자동측정을 시작하려면 먼저 블루투스 기기를 연결해주세요.')
      return
    }
    setIsAutoMeasuring(!isAutoMeasuring)
  }

  // 최종 저장 버튼 클릭
  const handleSave = () => {
    if (measuredValue <= 0) {
      alert('저장할 안압 수치를 입력하거나 측정해주세요. (0보다 커야 합니다.)')
      return
    }
    
    // 최종 전역 상태에 저장 요청
    onAddRecord(measuredValue, selectedEye, measuredTime, measuredDate)
    alert('기록이 성공적으로 저장되었습니다.')
    
    // 저장 후 수치 리셋
    setMeasuredValue(0)
    setIsAutoMeasuring(false)
  }

  // 취소 버튼 클릭
  const handleCancel = () => {
    setMeasuredValue(0)
    setIsAutoMeasuring(false)
    
    // 시간 재설정
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const ampm = hours >= 12 ? '오후' : '오전'
    hours = hours % 12
    hours = hours ? hours : 12
    const timeStr = `${ampm} ${String(hours).padStart(2, '0')}:${minutes}:${seconds}`
    
    setMeasuredDate(dateStr)
    setMeasuredTime(timeStr)
  }

  return (
    <div className="flex flex-col h-full text-white">
      {/* 상단 바: 블루투스 설정 텍스트 + 우측 좌/우 탭 */}
      <div className="flex items-center justify-between mb-5">
        <button 
          className="text-xs font-semibold text-purple-300 hover:text-purple-200 cursor-pointer bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
          onClick={onConnectToggle}
        >
          {isBluetoothConnected ? '블루투스 연결해제' : '블루투스 설정'}
        </button>
        
        <h2 className="text-lg font-bold">기록</h2>

        {/* 좌안 / 우안 토글 */}
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

      {/* 날짜/시간 수기 입력 영역 */}
      <GlassCard className="w-full mb-4 p-4 rounded-2xl bg-white/4 border-white/8 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">측정일</span>
          <input 
            type="date" 
            value={measuredDate}
            onChange={(e) => setMeasuredDate(e.target.value)}
            className="bg-slate-950/60 border border-white/10 rounded px-2 py-1 text-right text-white outline-none w-32 focus:border-emerald-500/50"
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">측정시간 (오전/오후 포함)</span>
          <input 
            type="text" 
            value={measuredTime}
            onChange={(e) => setMeasuredTime(e.target.value)}
            placeholder="오후 02:00:00"
            className="bg-slate-950/60 border border-white/10 rounded px-2 py-1 text-right text-white outline-none w-36 focus:border-emerald-500/50"
          />
        </div>
      </GlassCard>

      {/* 자동측정 토글 버튼 */}
      <div className="flex justify-end items-center gap-2 mb-3 px-1">
        <span className="text-xs text-gray-400">자동측정</span>
        <button 
          className="cursor-pointer text-emerald-400 hover:text-emerald-300 transition-colors"
          onClick={handleAutoMeasureToggle}
        >
          {isAutoMeasuring ? (
            <ToggleRight size={28} className="text-emerald-500" />
          ) : (
            <ToggleLeft size={28} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* 메인 측정 디스플레이 */}
      <GlassCard className="w-full flex-1 max-h-[180px] flex flex-col justify-center px-6 py-4 mb-4 bg-white/5 border-white/10 rounded-2xl relative">
        {isMeasuring && (
          <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center z-10">
            <span className="text-xs text-emerald-400 font-bold animate-pulse">안압 측정 중...</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-gray-400">현재 입력/측정치</span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Edit2 size={10} /> 수기 수정 가능
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">안압값</span>
          <div className="flex items-center gap-1.5">
            <input 
              type="number"
              value={measuredValue || ''}
              onChange={(e) => setMeasuredValue(Number(e.target.value))}
              placeholder="0"
              className="bg-transparent text-right text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] w-24 outline-none border-b border-white/10 focus:border-emerald-500/30 pr-1"
            />
            <span className="text-xs text-gray-400 mb-1">mmHg</span>
          </div>
        </div>
      </GlassCard>

      {/* [신규] 저장 및 취소 버튼 (수치 기록 카드 하단에 연계 배치) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          className="flex items-center justify-center gap-1.5 py-2.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 rounded-xl font-bold text-xs text-red-300 cursor-pointer transition-colors active:scale-98"
          onClick={handleCancel}
        >
          <X size={14} />
          <span>취소</span>
        </button>
        <button 
          className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-xs text-white cursor-pointer transition-all active:scale-98 shadow-md shadow-emerald-950/15"
          onClick={handleSave}
        >
          <Save size={14} />
          <span>저장</span>
        </button>
      </div>

      {/* 하단 네비게이션 버튼 */}
      <div className="w-full grid grid-cols-2 gap-4 mt-auto mb-2">
        <button 
          className="flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-xs cursor-pointer transition-colors active:scale-98"
          onClick={() => onNavigate('menu')}
        >
          메뉴
        </button>
        <button 
          className="flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-xs text-purple-300 cursor-pointer transition-all active:scale-98"
          onClick={() => onNavigate('history')}
        >
          안압기록
        </button>
      </div>
    </div>
  )
}
