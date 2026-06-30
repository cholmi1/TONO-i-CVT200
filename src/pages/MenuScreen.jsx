import { Eye, FileText, Upload, RefreshCw, Info, Bell } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'

const MenuButton = ({ icon: Icon, label, onClick, className }) => (
  <GlassCard
    className={`flex flex-col items-center justify-center aspect-square cursor-pointer active:scale-95 transition-transform hover:bg-white/20 border-white/20 bg-white/5 ${className}`}
    onClick={onClick}
  >
    <div className="mb-3 text-white/90">
      <Icon size={40} strokeWidth={1.5} />
    </div>
    <span className="text-lg font-bold text-white tracking-wide">{label}</span>
  </GlassCard>
)

export default function MenuScreen({ onNavigate, isBluetoothConnected }) {
  return (
    <div className="flex flex-col h-full text-white">
      {/* 헤더에 사용 가이드(ℹ️) 정보 버튼 배치 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          TONO-i
        </h1>
        <button 
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 cursor-pointer transition-colors"
          onClick={() => onNavigate('guide')}
          title="사용 가이드"
        >
          <Info size={20} className="text-purple-300" />
        </button>
      </div>

      {/* 메뉴 카드 그리드 (5개 버튼 조화로운 배치) */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-4 w-full max-w-[280px] mx-auto mb-6">
          <MenuButton
            icon={RefreshCw}
            label="기기연결"
            onClick={() => onNavigate('record')}
          />
          <MenuButton
            icon={Eye}
            label="안압관리"
            onClick={() => onNavigate('management')}
          />
          <MenuButton
            icon={FileText}
            label="기록확인"
            onClick={() => onNavigate('history')}
          />
          <MenuButton
            icon={Upload}
            label="기록전송"
            onClick={() => onNavigate('send')}
          />
          {/* 알람설정은 5번째 버튼이므로 가로로 길게 하단 중앙 배치 */}
          <GlassCard
            className="col-span-2 flex items-center justify-center gap-4 py-4 cursor-pointer active:scale-95 transition-transform hover:bg-white/20 border-white/20 bg-white/5"
            onClick={() => onNavigate('alarm')}
          >
            <Bell size={28} className="text-purple-300" strokeWidth={1.5} />
            <span className="text-lg font-bold text-white tracking-wide">알람설정</span>
          </GlassCard>
        </div>
      </div>

      {/* 연결 상태 요약 바 */}
      <div className="mt-auto mb-2">
        <div 
          className="flex items-center justify-center gap-2.5 py-3.5 px-5 bg-white/5 border border-white/8 rounded-2xl cursor-pointer hover:bg-white/8 transition-colors"
          onClick={() => onNavigate('record')}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${
            isBluetoothConnected ? 'bg-emerald-500 animate-ping' : 'bg-red-500'
          }`}></span>
          {isBluetoothConnected && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute"></span>
          )}
          <span className="text-xs font-medium text-gray-300">
            {isBluetoothConnected ? '연결된 기기: CVT200-A' : '연결된 기기 없음'}
          </span>
        </div>
      </div>
    </div>
  )
}
