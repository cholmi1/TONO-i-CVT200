import { GlassCard } from '../components/ui/GlassCard'

export default function HistoryScreen({ onNavigate }) {
    const records = [
        { time: '오후 02:00', value: 17 },
        { time: '오후 02:02', value: 16 },
        { time: '오후 02:04', value: 16 },
        { time: '오후 07:02', value: 14 },
        { time: '오후 07:04', value: 15 },
        { time: '오후 07:06', value: 14 },
    ]

    return (
        <div className="flex flex-col h-full items-center pt-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                안압기록
            </h1>

            <div className="w-full mb-2 text-center">
                <h2 className="text-xl text-white font-medium">2023년 3월 5일 일요일</h2>
                <p className="text-white/70 text-sm">안압측정 결과입니다</p>
            </div>

            <div className="flex-1 w-full overflow-y-auto space-y-3 p-1 my-4 scrollbar-hide">
                {records.map((rec, i) => (
                    <GlassCard
                        key={i}
                        className="flex justify-between items-center py-3 px-6 bg-white/5 border-white/10 cursor-pointer hover:bg-white/10"
                        onClick={() => onNavigate('record')}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-300">측정시간</span>
                            <span className="text-xl font-bold text-white">{rec.time}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xl font-bold text-white">{rec.value} <span className="text-sm font-normal text-gray-400">mmHg</span></span>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-auto mb-8 flex-shrink-0">
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
