import { Link, Eye, FileText, Upload, RefreshCw } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'

const MenuButton = ({ icon: Icon, label, onClick }) => (
    <GlassCard
        className="flex flex-col items-center justify-center aspect-square cursor-pointer active:scale-95 transition-transform hover:bg-white/20 border-white/30"
        onClick={onClick}
    >
        <div className="mb-4 text-white/90">
            <Icon size={48} strokeWidth={1.5} />
        </div>
        <span className="text-xl font-bold text-white tracking-wide">{label}</span>
    </GlassCard>
)

export default function MenuScreen({ onNavigate }) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center pt-16">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    메뉴
                </h1>

                <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
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
                        onClick={() => console.log('Send')}
                    />
                </div>
            </div>
        </div>
    )
}
