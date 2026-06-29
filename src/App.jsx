import { useState, useEffect } from 'react'
import SplashScreen from './pages/SplashScreen'
import MenuScreen from './pages/MenuScreen'
import RecordScreen from './pages/RecordScreen'
import HistoryScreen from './pages/HistoryScreen'
import AnalysisScreen from './pages/AnalysisScreen'
import ManagementScreen from './pages/ManagementScreen'
import SendScreen from './pages/SendScreen'
import GuideScreen from './pages/GuideScreen'

import { 
  Wifi, 
  Battery, 
  Smartphone, 
  Play, 
  RotateCcw, 
  Info,
  Clock,
  Eye,
  Check,
  Trash2,
  X,
  Bell
} from 'lucide-react'
import './App.css'

// 초기 모의 데이터
const INITIAL_RECORDS = [
  { id: 1, date: '2026-06-29', dayOfWeek: '월요일', time: '12:40:12', value: 17, eye: 'right', device: 'CVT200-A', memo: '정상 수치 유지' },
  { id: 2, date: '2026-06-29', dayOfWeek: '월요일', time: '09:15:24', value: 15, eye: 'left', device: 'CVT200-A', memo: '안정적' },
  { id: 3, date: '2026-06-28', dayOfWeek: '일요일', time: '21:30:45', value: 19, eye: 'right', device: 'CVT200-A', memo: '약간 높음' },
  { id: 4, date: '2026-06-28', dayOfWeek: '일요일', time: '08:45:10', value: 16, eye: 'left', device: 'CVT200-A', memo: '양호' },
  { id: 5, date: '2026-06-27', dayOfWeek: '토요일', time: '20:10:00', value: 18, eye: 'right', device: 'CVT200-A', memo: '특이사항 없음' },
  { id: 6, date: '2026-06-27', dayOfWeek: '토요일', time: '09:00:15', value: 14, eye: 'left', device: 'CVT200-A', memo: '최상' },
  { id: 7, date: '2026-06-26', dayOfWeek: '금요일', time: '19:40:33', value: 21, eye: 'right', device: 'CVT200-A', memo: '취침 전 측정, 약간 상승' }
]

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash')
  
  // 블루투스 상태
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false)
  const [isBluetoothConnecting, setIsBluetoothConnecting] = useState(false)
  
  // 기록 데이터 상태
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('tono_i_records')
    return saved ? JSON.parse(saved) : INITIAL_RECORDS
  })
  
  // 가상 알림 팝업 모달
  const [isAlarmPopupOpen, setIsAlarmPopupOpen] = useState(false)
  const [alarmInfo, setAlarmInfo] = useState({
    time: 'PM 11:33',
    value: 17,
    eye: 'right'
  })

  // 상세 편집 모달
  const [selectedRecordForEdit, setSelectedRecordForEdit] = useState(null)
  
  // 실시간 시간 업데이트
  const [currentTime, setCurrentTime] = useState('09:41')
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      let hours = now.getHours()
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const ampm = hours >= 12 ? '오후' : '오전'
      hours = hours % 12
      hours = hours ? hours : 12 // 0시를 12시로 표시
      setCurrentTime(`${ampm} ${String(hours).padStart(2, '0')}:${minutes}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  // 로컬 스토리지 데이터 동기화
  useEffect(() => {
    localStorage.setItem('tono_i_records', JSON.stringify(records))
  }, [records])

  // 가상 블루투스 연결 토글 프로세스
  const handleBluetoothToggle = () => {
    if (isBluetoothConnected) {
      setIsBluetoothConnected(false)
    } else {
      setIsBluetoothConnecting(true)
      setTimeout(() => {
        setIsBluetoothConnecting(false)
        setIsBluetoothConnected(true)
        setCurrentScreen('record')
      }, 2000)
    }
  }

  // 가상 알림 트리거 (3초 후 발생)
  const triggerVirtualAlarm = () => {
    setTimeout(() => {
      setAlarmInfo({
        time: currentTime,
        value: 18,
        eye: 'right'
      })
      setIsAlarmPopupOpen(true)
    }, 3000)
  }

  // 데이터 리셋
  const handleResetData = () => {
    if (window.confirm('모든 데이터를 초기 기본 데이터로 리셋하시겠습니까?')) {
      setRecords(INITIAL_RECORDS)
      setIsBluetoothConnected(false)
      setCurrentScreen('menu')
    }
  }

  // 기록 추가 함수 (저장 버튼 클릭 시 최종 호출됨)
  const addRecord = (newValue, eyeType, customTimeStr, customDateStr) => {
    const now = new Date()
    const dateStr = customDateStr || now.toISOString().split('T')[0] // YYYY-MM-DD
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
    
    // 만약 사용자가 지정한 날짜가 있다면 해당 날짜의 요일 계산
    const targetDate = new Date(dateStr)
    const dayOfWeek = days[isNaN(targetDate.getDay()) ? now.getDay() : targetDate.getDay()]
    
    // 시간대 포맷 보정 (수기 입력 등으로 커스텀 시간이 들어온 경우)
    let timeStr = customTimeStr || now.toTimeString().split(' ')[0]
    
    const newRecord = {
      id: Date.now(),
      date: dateStr,
      dayOfWeek: dayOfWeek,
      time: timeStr,
      value: Number(newValue),
      eye: eyeType,
      device: 'CVT200-A',
      memo: '수기 입력 기록'
    }
    
    setRecords(prev => [newRecord, ...prev])
  }

  // 기록 업데이트 함수 (상세 편집 팝업에서 저장 시 사용)
  const updateRecord = (updated) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r))
    setSelectedRecordForEdit(null)
  }

  // 기록 삭제 함수
  const deleteRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id))
    setSelectedRecordForEdit(null)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': 
        return <SplashScreen onNavigate={setCurrentScreen} />
      case 'menu': 
        return (
          <MenuScreen 
            onNavigate={setCurrentScreen} 
            isBluetoothConnected={isBluetoothConnected} 
          />
        )
      case 'record': 
        return (
          <RecordScreen 
            onNavigate={setCurrentScreen} 
            isBluetoothConnected={isBluetoothConnected}
            onConnectToggle={handleBluetoothToggle}
            onAddRecord={addRecord}
          />
        )
      case 'history': 
        return (
          <HistoryScreen 
            onNavigate={setCurrentScreen} 
            records={records}
            onSelectRecord={setSelectedRecordForEdit}
          />
        )
      case 'analysis': 
        return (
          <AnalysisScreen 
            onNavigate={setCurrentScreen} 
            records={records}
          />
        )
      case 'management': 
        return (
          <ManagementScreen 
            onNavigate={setCurrentScreen} 
          />
        )
      case 'send':
        return (
          <SendScreen 
            onNavigate={setCurrentScreen} 
            records={records}
          />
        )
      case 'guide':
        return (
          <GuideScreen 
            onNavigate={setCurrentScreen} 
          />
        )
      default: 
        return <SplashScreen onNavigate={setCurrentScreen} />
    }
  }

  return (
    <div className="app-container">
      {/* 좌측: 스마트폰 시뮬레이터 구역 */}
      <div className="simulator-section">
        <div className={`phone-mockup ${isAlarmPopupOpen ? 'shake-active' : ''}`}>
          {/* 노치 데코레이션 */}
          <div className="phone-notch"></div>
          
          {/* 외부 볼륨 & 전원 버튼 */}
          <div className="phone-btn volume-up"></div>
          <div className="phone-btn volume-down"></div>
          <div className="phone-btn power"></div>

          {/* 폰 화면 영역 */}
          <div className="phone-screen">
            {/* 상단 시스템 상태바 */}
            <div className="status-bar">
              <span className="status-time text-white/95">{currentTime}</span>
              <div className="status-icons text-white/95">
                <Wifi size={14} strokeWidth={2.5} />
                <Battery size={16} strokeWidth={2.5} className="rotate-90" />
              </div>
            </div>

            {/* 실제 앱 뷰 */}
            <div className="screen-content scrollbar-hide">
              {renderScreen()}
            </div>

            {/* 가상 블루투스 연결 오버레이 */}
            {isBluetoothConnecting && (
              <div className="scan-overlay-backdrop">
                <div className="scan-box">
                  <div className="scan-spinner"></div>
                  <p className="text-sm font-semibold text-purple-300">스마트 안압계 연결 중...</p>
                </div>
              </div>
            )}

            {/* [화면 1] 안압 측정 알림 팝업 모달 */}
            {isAlarmPopupOpen && (
              <div className="popup-backdrop">
                <div className="w-full max-w-[280px] bg-slate-900/95 border-2 border-purple-500 rounded-3xl p-6 text-center pulse-glow-purple">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="text-purple-400 w-8 h-8 animate-bounce" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">안압 측정 알림</h2>
                  <p className="text-xs text-purple-300 mb-4">정기 측정 시간입니다</p>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-5 text-left text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">예약시간</span>
                      <span className="font-bold text-yellow-300">{alarmInfo.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">측정방향</span>
                      <span className="font-bold text-white">{alarmInfo.eye === 'right' ? '우안(OD)' : '좌안(OS)'}</span>
                    </div>
                  </div>

                  <button 
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold py-3 rounded-xl transition-colors cursor-pointer"
                    onClick={() => {
                      setIsAlarmPopupOpen(false);
                      setCurrentScreen('record');
                    }}
                  >
                    측정하러 가기
                  </button>
                </div>
              </div>
            )}

            {/* [수정] 안압 측정 결과 상세 모달 팝업 */}
            {selectedRecordForEdit && (
              <div className="popup-backdrop">
                <div className="result-modal-card">
                  <h2 className="result-popup-title">안압 측정 결과</h2>
                  <div className="result-form-container">
                    <div className="result-form-row">
                      <span className="result-label">안압값</span>
                      <input 
                        type="number" 
                        className="result-field-input font-bold text-emerald-400" 
                        value={selectedRecordForEdit.value}
                        onChange={(e) => setSelectedRecordForEdit(prev => ({...prev, value: Number(e.target.value)}))}
                      />
                    </div>
                    <div className="result-form-row">
                      <span className="result-label">측정방향</span>
                      <div className="flex gap-2 flex-1">
                        <button 
                          className={`flex-1 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                            selectedRecordForEdit.eye === 'left' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 border border-white/10'
                          }`}
                          onClick={() => setSelectedRecordForEdit(prev => ({...prev, eye: 'left'}))}
                        >
                          좌안
                        </button>
                        <button 
                          className={`flex-1 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                            selectedRecordForEdit.eye === 'right' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 border border-white/10'
                          }`}
                          onClick={() => setSelectedRecordForEdit(prev => ({...prev, eye: 'right'}))}
                        >
                          우안
                        </button>
                      </div>
                    </div>
                    <div className="result-form-row">
                      <span className="result-label">측정일</span>
                      <input 
                        type="text" 
                        className="result-field-input" 
                        value={selectedRecordForEdit.date}
                        onChange={(e) => setSelectedRecordForEdit(prev => ({...prev, date: e.target.value}))}
                      />
                    </div>
                    <div className="result-form-row">
                      <span className="result-label">측정시간</span>
                      <input 
                        type="text" 
                        className="result-field-input" 
                        value={selectedRecordForEdit.time}
                        onChange={(e) => setSelectedRecordForEdit(prev => ({...prev, time: e.target.value}))}
                      />
                    </div>
                    <div className="result-form-row">
                      <span className="result-label">측정기기</span>
                      <input 
                        type="text" 
                        className="result-field-input" 
                        value={selectedRecordForEdit.device}
                        onChange={(e) => setSelectedRecordForEdit(prev => ({...prev, device: e.target.value}))}
                      />
                    </div>
                    <div className="result-form-row align-start">
                      <span className="result-label mt-1">메모</span>
                      <textarea 
                        className="result-field-textarea" 
                        rows={2}
                        value={selectedRecordForEdit.memo || ''}
                        onChange={(e) => setSelectedRecordForEdit(prev => ({...prev, memo: e.target.value}))}
                      />
                    </div>
                  </div>

                  <div className="result-popup-buttons">
                    <button 
                      className="btn-result-action"
                      onClick={() => updateRecord(selectedRecordForEdit)}
                    >
                      저장
                    </button>
                    <button 
                      className="btn-result-action"
                      onClick={() => deleteRecord(selectedRecordForEdit.id)}
                    >
                      삭제
                    </button>
                    <button 
                      className="btn-result-action"
                      onClick={() => setSelectedRecordForEdit(null)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 우측: 데모 가이드 및 페이지 강제 전환 컨트롤러 */}
      <div className="guide-section scrollbar-hide">
        <header className="guide-header">
          <span className="badge">PROTOTYPE DEMO</span>
          <h1>TONO-i CVT200</h1>
          <p>안압 관리 및 스마트 기기 연동 인터랙티브 프로토타입입니다. 우측 패널 제어 장치와 좌측 시뮬레이터를 통해 가상으로 안압 측정 시나리오를 검증해 보실 수 있습니다.</p>
        </header>

        {/* 1. 페이지 직접 이동 */}
        <div className="guide-card">
          <h2>1. 페이지 강제 이동 및 전개</h2>
          <p className="card-desc">아래 버튼을 눌러 시뮬레이터 내 화면을 직접 이동합니다.</p>
          <div className="demo-buttons-grid">
            <button 
              className={`demo-nav-btn ${currentScreen === 'splash' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('splash')}
            >
              <span className="step-num">1</span>
              <span className="step-name">시작화면</span>
            </button>
            <button 
              className={`demo-nav-btn ${currentScreen === 'menu' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('menu')}
            >
              <span className="step-num">2</span>
              <span className="step-name">메인메뉴</span>
            </button>
            <button 
              className={`demo-nav-btn ${currentScreen === 'record' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('record')}
            >
              <span className="step-num">3</span>
              <span className="step-name">기기연결/기록</span>
            </button>
            <button 
              className={`demo-nav-btn ${currentScreen === 'management' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('management')}
            >
              <span className="step-num">4</span>
              <span className="step-name">안압관리</span>
            </button>
            <button 
              className={`demo-nav-btn ${currentScreen === 'history' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('history')}
            >
              <span className="step-num">5</span>
              <span className="step-name">안압기록</span>
            </button>
            <button 
              className={`demo-nav-btn ${currentScreen === 'analysis' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('analysis')}
            >
              <span className="step-num">6</span>
              <span className="step-name">기간별분석</span>
            </button>
            <button 
              className={`demo-nav-btn ${currentScreen === 'send' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('send')}
            >
              <span className="step-num">7</span>
              <span className="step-name">기록전송 (CSV)</span>
            </button>
            <button 
              className={`demo-nav-btn ${currentScreen === 'guide' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('guide')}
            >
              <span className="step-num">8</span>
              <span className="step-name">사용설명서</span>
            </button>
          </div>
        </div>

        {/* 2. 인터랙티브 기능 시뮬레이션 */}
        <div className="guide-card">
          <h2>2. 기능 시뮬레이터</h2>
          <p className="card-desc">실제 기기처럼 작동하는 다양한 이벤트를 테스트해 볼 수 있습니다.</p>
          
          <div className="sim-actions-list">
            {/* 블루투스 기기 연결 */}
            <div className="sim-action-item">
              <div className="sim-info">
                <strong>블루투스 기기 페어링</strong>
                <span>스마트 안압계와의 가상 블루투스 페어링 모션을 진행합니다.</span>
              </div>
              <button 
                className={`btn-sim ${isBluetoothConnected ? 'btn-danger' : ''}`}
                onClick={handleBluetoothToggle}
              >
                {isBluetoothConnected ? '연결 해제' : '연결 시작'}
              </button>
            </div>

            {/* 가상 알림 트리거 */}
            <div className="sim-action-item">
              <div className="sim-info">
                <strong>3초 후 가상 안압 측정 알림</strong>
                <span>측정 예약 시간에 맞춰 모바일 팝업창을 가상으로 띄웁니다.</span>
              </div>
              <button className="btn-sim" onClick={triggerVirtualAlarm}>알림 테스트</button>
            </div>

            {/* 데이터 리셋 */}
            <div className="sim-action-item">
              <div className="sim-info">
                <strong>데모 데이터 초기화</strong>
                <span>수정하거나 추가한 안압 측정 이력을 공장 초기화 데이터로 리셋합니다.</span>
              </div>
              <button className="btn-sim btn-danger" onClick={handleResetData}>데이터 초기화</button>
            </div>
          </div>
        </div>

        {/* 💡 팁 안내 */}
        <div className="guide-card">
          <h3>💡 실시간 기능 연계 팁</h3>
          <ul>
            <li>메인메뉴 우측 상단의 <strong>ℹ️(정보) 아이콘</strong>을 터치하면 <strong>사용설명서 페이지</strong>로 편리하게 이동합니다.</li>
            <li>기록 화면에서 안압을 <strong>수기로 직접 입력</strong>하거나, 블루투스가 연결된 상태에서 <strong>자동측정</strong>을 진행한 후 반드시 <strong>"저장"</strong> 버튼을 눌러야 최종 이력에 등록됩니다.</li>
            <li>안압기록 화면에서 개별 이력을 터치하면, <strong>[안압 측정 결과] 상세 팝업</strong>이 나타나 수정 및 삭제가 연동됩니다.</li>
            <li>기록전송 화면에서 검색 기간을 정해 필터링한 후 <strong>"CSV 다운로드"</strong>를 누르면 엑셀 연동 데이터가 파일로 다운로드됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
