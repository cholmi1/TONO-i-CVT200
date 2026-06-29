import { useState, useEffect, useRef } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { ArrowLeft, Wifi, ToggleLeft, ToggleRight } from 'lucide-react'

export default function RecordScreen({ onNavigate, isBluetoothConnected, onConnectToggle, onAddRecord }) {
  const [selectedEye, setSelectedEye] = useState('right') // left, right
  const [isAutoMeasuring, setIsAutoMeasuring] = useState(false)
  const [lastMeasuredValue, setLastMeasuredValue] = useState(0)
  const [lastMeasuredTime, setLastMeasuredTime] = useState('00:00:00')
  const [isMeasuring, setIsMeasuring] = useState(false)
  
  const autoMeasureTimer = useRef(null)

  // 오늘 날짜 표시용
  const [todayStr, setTodayStr] = useState('')
  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate()
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
    const dayOfWeek = days[now.getDay()]
    setTodayStr(`${year}년 ${month}월 ${date}일 ${dayOfWeek}`)
  }, [])

  // 자동측정 로직
  useEffect(() => {
    if (isAutoMeasuring && isBluetoothConnected) {
      const measure = () => {
        setIsMeasuring(true)
        
        // 1.5초간 측정 중인 듯한 로딩 모션
        setTimeout(() => {
          const randomVal = Math.floor(Math.random() * 8) + 12 // 12 ~ 19 사이 임의 값
          const now = new Date()
          const timeStr = now.toTimeString().split(' ')[0]
          
          setLastMeasuredValue(randomVal)
          setLastMeasuredTime(timeStr)
          setIsMeasuring(false)
          
          // 전역 데이터에 자동 추가
          onAddRecord(randomVal, selectedEye)
        }, 1500)
      }

      // 즉시 한번 측정 후 5초마다 반복 측정 (기존 3초에서 5초로 늘려 부드러운 전개 제공)
      measure()
      autoMeasureTimer.current = setInterval(measure, 5000)
    } else {
      if (autoMeasureTimer.current) {
        clearInterval(autoMeasureTimer.current)
      }
      setIsAutoMeasuring(false)
    }

    return () => {
      if (autoMeasureTimer.current) {
        clearInterval(autoMeasureTimer.current)
      }
    }
  }, [isAutoMeasuring, isBluetoothConnected, selectedEye])

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

  return (
    <div className="flex flex-col h-full text-white">
      {/* 상단 바: 블루투스 설정 텍스트 + 우측 좌/우 탭 */}
      <div className="flex items-center justify-between mb-6">
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

      {/* 날짜 표시 영역 */}
      <GlassCard className="w-full mb-6 py-3.5 text-center rounded-2xl bg-white/4 border-white/8">
        <span className="text-sm font-semibold tracking-wide text-gray-200">{todayStr}</span>
      </GlassCard>

      {/* 자동측정 토글 버튼 */}
      <div className="flex justify-end items-center gap-2 mb-4 px-1">
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
      <GlassCard className="w-full flex-1 max-h-[220px] flex flex-col justify-center px-6 py-5 mb-6 bg-white/5 border-white/10 rounded-2xl relative">
        {isMeasuring && (
          <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center z-10">
            <span className="text-xs text-emerald-400 font-bold animate-pulse">안압 측정 중...</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-400">측정시간</span>
          <span className="text-base font-bold text-gray-200">{lastMeasuredTime}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">측정치</span>
          <div className="flex items-end gap-1.5">
            <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              {lastMeasuredValue}
            </span>
            <span className="text-sm text-gray-400 mb-1.5">mmHg</span>
          </div>
        </div>
      </GlassCard>

      {/* 안내메시지 */}
      <div className="text-center mb-8">
        <p className="text-xs text-gray-400 leading-relaxed font-light">
          {isBluetoothConnected 
            ? '안압계가 연결되어 있습니다. 측정을 준비하세요.' 
            : '스마트 안압계의 블루투스 전원을 켜주세요.'}
        </p>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="w-full grid grid-cols-2 gap-4 mt-auto mb-4">
        <button 
          className="flex items-center justify-center py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-sm cursor-pointer transition-colors active:scale-98"
          onClick={() => onNavigate('menu')}
        >
          메뉴
        </button>
        <button 
          className="flex items-center justify-center py-3.5 bg-emerald-600/90 hover:bg-emerald-600 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all active:scale-98 shadow-lg shadow-emerald-950/20"
          onClick={() => onNavigate('history')}
        >
          안압기록
        </button>
      </div>
    </div>
  )
}
