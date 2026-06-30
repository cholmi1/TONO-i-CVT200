import { useState, useEffect } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { ArrowLeft, Bell, BellOff, Save, Trash2, X, Plus } from 'lucide-react'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

export default function AlarmScreen({ 
  onNavigate, 
  alarms, 
  onAddAlarm, 
  onUpdateAlarm, 
  onDeleteAlarm, 
  onToggleAlarm 
}) {
  // 알람 생성 입력 상태
  const [time, setTime] = useState('09:00')
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]) // 기본 평일
  const [everyday, setEveryday] = useState(false)
  const [title, setTitle] = useState('')
  
  // 수정할 알람 선택 상태 (null 또는 알람 객체)
  const [selectedAlarmForEdit, setSelectedAlarmForEdit] = useState(null)

  // 요일 선택 개별 토글
  const toggleDay = (dayIndex) => {
    let newDays = []
    if (selectedDays.includes(dayIndex)) {
      newDays = selectedDays.filter(d => d !== dayIndex)
    } else {
      newDays = [...selectedDays, dayIndex].sort()
    }
    setSelectedDays(newDays)
  }

  // 요일 선택 상태가 바뀔 때 "매일" 체크박스 상태 동기화
  useEffect(() => {
    if (selectedDays.length === 7) {
      setEveryday(true)
    } else {
      setEveryday(false)
    }
  }, [selectedDays])

  // "매일" 체크박스 토글
  const handleEverydayToggle = (checked) => {
    setEveryday(checked)
    if (checked) {
      setSelectedDays([0, 1, 2, 3, 4, 5, 6])
    } else {
      setSelectedDays([])
    }
  }

  // 새 알람 등록
  const handleAddAlarm = () => {
    if (!title.trim()) {
      alert('알람 제목을 입력해주세요.')
      return
    }
    if (selectedDays.length === 0) {
      alert('최소 하루 이상의 요일을 선택해주세요.')
      return
    }

    const newAlarm = {
      time,
      days: selectedDays,
      everyday,
      title: title.trim()
    }

    onAddAlarm(newAlarm)
    
    // 입력창 초기화
    setTitle('')
    setTime('09:00')
    setSelectedDays([1, 2, 3, 4, 5])
    alert('알람이 등록되었습니다.')
  }

  // 알람 요일 포맷팅 표시 (예: "매일", "월, 화, 수", "주말")
  const formatDays = (days) => {
    if (days.length === 7) return '매일'
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return '평일 (월-금)'
    if (days.length === 2 && days.includes(0) && days.includes(6)) return '주말 (토-일)'
    if (days.length === 0) return '요일 선택 안됨'
    return days.map(d => DAY_NAMES[d]).join(', ')
  }

  // 24시간제(09:00)를 12시간제(오전 09:00)로 표시
  const formatTime12h = (timeStr) => {
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? '오후' : '오전'
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return `${ampm} ${String(displayHour).padStart(2, '0')}:${m}`
  }

  // 수정 팝업 관련 처리
  const openEditModal = (alarm) => {
    setSelectedAlarmForEdit({ ...alarm })
  }

  const toggleDayInEdit = (dayIndex) => {
    if (!selectedAlarmForEdit) return
    const days = selectedAlarmForEdit.days
    let newDays = []
    if (days.includes(dayIndex)) {
      newDays = days.filter(d => d !== dayIndex)
    } else {
      newDays = [...days, dayIndex].sort()
    }
    
    setSelectedAlarmForEdit(prev => ({
      ...prev,
      days: newDays,
      everyday: newDays.length === 7
    }))
  }

  const toggleEverydayInEdit = (checked) => {
    if (!selectedAlarmForEdit) return
    setSelectedAlarmForEdit(prev => ({
      ...prev,
      everyday: checked,
      days: checked ? [0, 1, 2, 3, 4, 5, 6] : []
    }))
  }

  const handleUpdateAlarm = () => {
    if (!selectedAlarmForEdit.title.trim()) {
      alert('알람 제목을 입력해주세요.')
      return
    }
    if (selectedAlarmForEdit.days.length === 0) {
      alert('최소 하루 이상의 요일을 선택해주세요.')
      return
    }

    onUpdateAlarm(selectedAlarmForEdit)
    setSelectedAlarmForEdit(null)
    alert('알람이 수정되었습니다.')
  }

  const handleDeleteAlarm = (id) => {
    if (window.confirm('이 알람을 삭제하시겠습니까?')) {
      onDeleteAlarm(id)
      setSelectedAlarmForEdit(null)
    }
  }

  return (
    <div className="flex flex-col h-full text-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <button 
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 cursor-pointer"
          onClick={() => onNavigate('menu')}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-bold tracking-wide">알람설정</h2>
        <div className="w-9"></div>
      </div>

      {/* 알람 추가 등록 폼 카드 */}
      <GlassCard className="p-4 bg-white/4 border-white/8 rounded-2xl mb-5 flex-shrink-0 text-xs space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-semibold">알람 시간</span>
          <input 
            type="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-slate-950/60 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none w-28 text-center focus:border-purple-500/50 text-sm font-semibold"
          />
        </div>

        {/* 요일 선택 패널 */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-semibold">알람 요일</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
              <input 
                type="checkbox" 
                checked={everyday}
                onChange={(e) => handleEverydayToggle(e.target.checked)}
                className="w-3.5 h-3.5 accent-purple-500 cursor-pointer"
              />
              <span>매일</span>
            </label>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {DAY_NAMES.map((day, idx) => {
              const isSelected = selectedDays.includes(idx)
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className={`py-2 rounded-lg font-bold text-center cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-950/30' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* 알람 제목 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-gray-400 font-semibold">알람 제목</span>
          <input 
            type="text" 
            placeholder="예: 아침 안압 측정"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500/50 placeholder:text-gray-600 w-full"
          />
        </div>

        {/* 추가 버튼 */}
        <button
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shadow-md shadow-purple-950/15"
          onClick={handleAddAlarm}
        >
          <Plus size={16} />
          <span>알람 일정 추가</span>
        </button>
      </GlassCard>

      {/* 알람 리스트 목록 */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-xs text-gray-400 mb-2 px-1 font-semibold flex-shrink-0">알람 일정 리스트</h3>
        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pb-6">
          {alarms.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500">
              등록된 알람이 없습니다.
            </div>
          ) : (
            alarms.map(alarm => (
              <GlassCard
                key={alarm.id}
                className={`p-4 border rounded-xl flex justify-between items-center transition-all cursor-pointer ${
                  alarm.active 
                    ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                    : 'bg-white/2 border-white/5 opacity-50 hover:opacity-60'
                }`}
                onClick={() => openEditModal(alarm)}
              >
                <div className="space-y-1">
                  <div className="text-[10px] text-purple-300 font-semibold">
                    {formatDays(alarm.days)}
                  </div>
                  <div className="text-xl font-black text-white leading-none">
                    {formatTime12h(alarm.time)}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {alarm.title}
                  </div>
                </div>

                {/* 활성/비활성 스위치 (이벤트 버블링 방지) */}
                <div 
                  className="p-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleAlarm(alarm.id)
                  }}
                >
                  <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    alarm.active ? 'bg-purple-600' : 'bg-gray-600'
                  }`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${
                      alarm.active ? 'translate-x-4' : 'translate-x-0'
                    }`}></div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>

      {/* [수정] 알람 수정 팝업 모달 */}
      {selectedAlarmForEdit && (
        <div className="popup-backdrop">
          <div className="w-full max-w-[290px] bg-slate-900 border border-purple-500/40 rounded-2xl p-5 text-left text-xs space-y-4">
            <h2 className="text-base font-bold text-purple-300 text-center mb-1">알람 설정 수정</h2>

            {/* 시간 설정 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">시간</span>
              <input 
                type="time" 
                value={selectedAlarmForEdit.time}
                onChange={(e) => setSelectedAlarmForEdit(prev => ({ ...prev, time: e.target.value }))}
                className="bg-slate-950/60 border border-white/10 rounded px-2 py-1 text-white outline-none w-28 text-center focus:border-purple-500/50"
              />
            </div>

            {/* 요일 설정 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">요일</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                  <input 
                    type="checkbox" 
                    checked={selectedAlarmForEdit.everyday}
                    onChange={(e) => toggleEverydayInEdit(e.target.checked)}
                    className="w-3 h-3 accent-purple-500 cursor-pointer"
                  />
                  <span>매일</span>
                </label>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES.map((day, idx) => {
                  const isSelected = selectedAlarmForEdit.days.includes(idx)
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDayInEdit(idx)}
                      className={`py-1.5 rounded font-bold text-center cursor-pointer text-[10px] ${
                        isSelected 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 알람 제목 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-gray-400 font-semibold">알람 제목</span>
              <input 
                type="text" 
                value={selectedAlarmForEdit.title}
                onChange={(e) => setSelectedAlarmForEdit(prev => ({ ...prev, title: e.target.value }))}
                className="bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500/50"
              />
            </div>

            {/* 3버튼 그룹 */}
            <div className="flex gap-2 pt-2">
              <button 
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold cursor-pointer transition-colors text-center"
                onClick={handleUpdateAlarm}
              >
                저장
              </button>
              <button 
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-200 font-bold cursor-pointer transition-colors text-center flex items-center justify-center gap-1"
                onClick={() => handleDeleteAlarm(selectedAlarmForEdit.id)}
              >
                <Trash2 size={12} />
                <span>삭제</span>
              </button>
              <button 
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-300 font-bold cursor-pointer transition-colors text-center"
                onClick={() => setSelectedAlarmForEdit(null)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
