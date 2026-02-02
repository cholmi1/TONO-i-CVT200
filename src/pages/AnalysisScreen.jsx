import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Eye, Check } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { cn } from '../lib/utils'

const data = [
    { name: 'Mon', value: 14.5 },
    { name: 'Tue', value: 12.5 },
    { name: 'Wed', value: 15.5 },
    { name: 'Thu', value: 16.0 },
    { name: 'Fri', value: 18.5 },
    { name: 'Sat', value: 19.0 },
    { name: 'Sun', value: 15.5 },
]

export default function AnalysisScreen({ onNavigate }) {
    const [selectedEye, setSelectedEye] = useState('left') // left, right
    const [startDate, setStartDate] = useState('2023-03-02')
    const [endDate, setEndDate] = useState('2023-03-08')

    return (
        <div className="flex flex-col h-full items-center pt-8 overflow-y-auto scrollbar-hide">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                기록분석
            </h1>

            {/* Main Toggle */}
            <GlassCard className="w-1/2 flex justify-center items-center py-2 mb-4 bg-white/10 active:scale-95 transition-transform">
                <Eye className="mr-2" />
                <span className="font-bold">안압</span>
            </GlassCard>

            {/* L/R Toggle */}
            <div className="flex w-full gap-4 mb-4">
                <GlassCard
                    className={cn("flex-1 flex justify-center items-center py-2 cursor-pointer transition-colors", selectedEye === 'left' ? 'bg-blue-500/30 border-blue-400' : 'bg-transparent')}
                    onClick={() => setSelectedEye('left')}
                >
                    <Eye className="mr-2 w-5 h-5" /> <span>좌안</span>
                </GlassCard>
                <GlassCard
                    className={cn("flex-1 flex justify-center items-center py-2 cursor-pointer transition-colors", selectedEye === 'right' ? 'bg-orange-500/30 border-orange-400' : 'bg-transparent')}
                    onClick={() => setSelectedEye('right')}
                >
                    <Eye className="mr-2 w-5 h-5" /> <span>우안</span>
                </GlassCard>
            </div>

            {/* IOP Info */}
            <GlassCard className="w-full p-4 mb-4 bg-white/5">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">목표안압</span>
                    <div className="bg-purple-500/50 px-4 py-1 rounded-full"><span className="text-white font-bold">15.0</span> <span className="text-xs">mmHg</span></div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">관리안압</span>
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-500/50 px-3 py-1 rounded-full"><span className="text-white font-bold">12.0</span></div>
                        <span>~</span>
                        <div className="bg-purple-500/50 px-3 py-1 rounded-full"><span className="text-white font-bold">18.0</span> <span className="text-xs">mmHg</span></div>
                    </div>
                </div>
            </GlassCard>

            {/* Date Range */}
            <div className="flex flex-col items-center mb-4 gap-2">
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent text-lg text-white border-b border-white/20 outline-none focus:border-white/50"
                    />
                    <span className="text-lg">부터</span>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent text-lg text-white border-b border-white/20 outline-none focus:border-white/50"
                    />
                    <span className="text-lg">까지</span>
                </div>
            </div>

            {/* Graph */}
            <div className="w-full mb-4">
                <div className="text-center mb-2 font-medium">기간별 일 평균 안압 변화</div>
                <GlassCard className="h-64 w-full p-2 bg-white/5 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" vertical={true} horizontal={true} />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={[5, 23]} hide />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#fbbf24"
                                strokeWidth={3}
                                dot={{ stroke: '#fbbf24', strokeWidth: 2, r: 4, fill: '#000' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    {/* Axis Labels Overlay (Simulated) */}
                    <div className="absolute left-2 top-2 bottom-2 flex flex-col justify-between text-xs text-blue-200">
                        <span>23</span><span>20</span><span>17</span><span>14</span><span>11</span><span>08</span><span>05</span>
                    </div>
                </GlassCard>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-3 w-full mb-6">
                <GlassCard className="flex flex-col items-center py-2">
                    <span className="text-xs text-gray-300 mb-1">목표안압</span>
                    <span className="font-bold text-blue-300">15.0 <span className="text-[10px] text-gray-400">mmHg</span></span>
                </GlassCard>
                <GlassCard className="flex flex-col items-center py-2">
                    <span className="text-xs text-gray-300 mb-1">최고안압</span>
                    <span className="font-bold text-orange-300">15.0 <span className="text-[10px] text-gray-400">mmHg</span></span>
                </GlassCard>
                <GlassCard className="flex flex-col items-center py-2">
                    <span className="text-xs text-gray-300 mb-1">관리효율</span>
                    <span className="font-bold text-yellow-300">80 %</span>
                </GlassCard>
                <GlassCard className="flex flex-col items-center py-2">
                    <span className="text-xs text-gray-300 mb-1">최저안압</span>
                    <span className="font-bold text-blue-300">15.0 <span className="text-[10px] text-gray-400">mmHg</span></span>
                </GlassCard>
            </div>

            <GlassCard
                className="w-full flex items-center justify-center py-4 cursor-pointer hover:bg-white/20 transition-colors mt-auto mb-8"
                onClick={() => onNavigate('menu')}
            >
                <span className="text-xl font-bold text-yellow-100">확인</span>
            </GlassCard>

        </div>
    )
}
