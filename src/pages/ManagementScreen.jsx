import { useState } from 'react'
import { Eye } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { cn } from '../lib/utils'

export default function ManagementScreen({ onNavigate }) {
    const [selectedEye, setSelectedEye] = useState('left')
    const [targetPressure, setTargetPressure] = useState('15')
    const [maxPressure, setMaxPressure] = useState('18')
    const [minPressure, setMinPressure] = useState('12')

    return (
        <div className="flex flex-col h-full items-center pt-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                안압관리
            </h1>

            {/* Eye Toggles */}
            <div className="flex w-full gap-6 mb-8">
                <GlassCard
                    className={cn(
                        "flex-1 aspect-square flex flex-col justify-center items-center cursor-pointer transition-all",
                        selectedEye === 'left'
                            ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_20px_rgba(50,50,255,0.3)]'
                            : 'bg-white/5 opacity-70'
                    )}
                    onClick={() => setSelectedEye('left')}
                >
                    <Eye className="w-12 h-12 mb-2 text-white" />
                    <span className="text-xl font-bold">좌안</span>
                </GlassCard>
                <GlassCard
                    className={cn(
                        "flex-1 aspect-square flex flex-col justify-center items-center cursor-pointer transition-all",
                        selectedEye === 'right'
                            ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_20px_rgba(200,50,255,0.3)]'
                            : 'bg-white/5 opacity-70'
                    )}
                    onClick={() => setSelectedEye('right')}
                >
                    <Eye className="w-12 h-12 mb-2 text-white" />
                    <span className="text-xl font-bold">우안</span>
                </GlassCard>
            </div>

            {/* Settings List */}
            <GlassCard className="w-full p-1 mb-8 bg-white/5">
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <span className="text-xl text-white">목표안압</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={targetPressure}
                            onChange={(e) => setTargetPressure(e.target.value)}
                            className="bg-transparent text-right text-2xl font-bold text-white w-20 outline-none border-b border-white/20 focus:border-white/50"
                        />
                        <span className="text-base font-normal text-gray-400">mmHg</span>
                    </div>
                </div>
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <span className="text-xl text-white">최고안압</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={maxPressure}
                            onChange={(e) => setMaxPressure(e.target.value)}
                            className="bg-transparent text-right text-2xl font-bold text-white w-20 outline-none border-b border-white/20 focus:border-white/50"
                        />
                        <span className="text-base font-normal text-gray-400">mmHg</span>
                    </div>
                </div>
                <div className="flex justify-between items-center p-4">
                    <span className="text-xl text-white">최저안압</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={minPressure}
                            onChange={(e) => setMinPressure(e.target.value)}
                            className="bg-transparent text-right text-2xl font-bold text-white w-20 outline-none border-b border-white/20 focus:border-white/50"
                        />
                        <span className="text-base font-normal text-gray-400">mmHg</span>
                    </div>
                </div>
            </GlassCard>

            {/* Buttons */}
            <div className="w-full grid grid-cols-2 gap-4 mt-auto mb-8">
                <GlassCard
                    className="flex items-center justify-center py-4 cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => console.log('Save')}
                >
                    <span className="text-xl font-bold text-purple-200">저장</span>
                </GlassCard>
                <GlassCard
                    className="flex items-center justify-center py-4 cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => onNavigate('menu')}
                >
                    <span className="text-xl font-bold text-white">취소</span>
                </GlassCard>
            </div>
        </div>
    )
}
