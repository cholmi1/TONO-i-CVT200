import { GlassCard } from '../components/ui/GlassCard'

export default function RecordScreen({ onNavigate }) {
    // Mock data matching the screenshot
    const record = {
        date: '2023년 3월 5일 일요일',
        time: '오후 02:00',
        value: 17
    }

    return (
        <div className="flex flex-col h-full items-center pt-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                기록
            </h1>

            {/* Date Display */}
            <GlassCard className="w-full mb-8 py-3 px-6 flex justify-center items-center rounded-full bg-white/5 border-white/20">
                <span className="text-xl font-medium text-white tracking-wide">{record.date}</span>
            </GlassCard>

            {/* Main Measurement Display */}
            <GlassCard className="w-full flex-1 max-h-[250px] flex flex-col justify-center px-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl text-gray-300">측정시간</span>
                    <span className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{record.time}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-2xl text-gray-300">측정치</span>
                    <div className="flex items-end gap-2">
                        <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 drop-shadow-[0_0_10px_rgba(100,200,255,0.5)]">
                            {record.value}
                        </span>
                        <span className="text-2xl text-gray-300 mb-2">mmHg</span>
                    </div>
                </div>
            </GlassCard>

            <div className="mb-12">
                <p className="text-xl text-white/80 font-light tracking-wider">안압측정 결과입니다</p>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-auto mb-8">
                <GlassCard
                    className="flex items-center justify-center py-4 cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => onNavigate('menu')}
                >
                    <span className="text-xl font-bold">확인</span>
                </GlassCard>
                <GlassCard
                    className="flex items-center justify-center py-4 cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => onNavigate('analysis')}
                >
                    <span className="text-xl font-bold text-purple-200">기간별분석</span>
                </GlassCard>
            </div>
        </div>
    )
}
