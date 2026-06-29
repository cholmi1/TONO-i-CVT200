import { useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { Calendar, Search, ArrowLeft, Download } from 'lucide-react'

export default function SendScreen({ onNavigate, records }) {
  const [startDate, setStartDate] = useState('2026-05-31')
  const [endDate, setEndDate] = useState('2026-06-29')
  const [filteredRecords, setFilteredRecords] = useState([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    // 시간 범위 포함을 위해 end 날짜의 시간을 23:59:59로 설정
    end.setHours(23, 59, 59, 999)

    const filtered = records.filter(r => {
      const recordDate = new Date(r.date)
      return recordDate >= start && recordDate <= end
    })

    setFilteredRecords(filtered)
    setHasSearched(true)
  }

  const handleDownloadCSV = () => {
    if (filteredRecords.length === 0) {
      alert('다운로드할 데이터가 없습니다. 먼저 기간을 검색해주세요.')
      return
    }

    // 한글 깨짐 방지 BOM 추가
    let csvContent = '\uFEFF'
    csvContent += '날짜,요일,시간,안압(mmHg),방향,기기명,안약명,점안여부\n'

    filteredRecords.forEach(r => {
      const eyeText = r.eye === 'right' ? '우안(OD)' : '좌안(OS)'
      const takenText = r.taken ? '완료' : '미완료'
      csvContent += `${r.date},${r.dayOfWeek},${r.time},${r.value},${eyeText},${r.device},${r.medicine},${takenText}\n`
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `tono_i_records_${startDate}_to_${endDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col h-full text-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button 
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 cursor-pointer"
          onClick={() => onNavigate('menu')}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-bold tracking-wide">기록전송</h2>
        <div className="w-9"></div> {/* 좌측 버튼과의 균형용 공백 */}
      </div>

      {/* 기간선택 카드 */}
      <GlassCard className="p-5 mb-6 bg-white/5 border-white/10 rounded-2xl">
        <div className="flex items-center gap-2 text-emerald-400 mb-4 text-sm font-semibold">
          <Calendar size={16} />
          <span>기간선택</span>
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">시작일</span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">종료일</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <button 
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/20 active:scale-98"
          onClick={handleSearch}
        >
          <Search size={16} />
          <span>검 색</span>
        </button>
      </GlassCard>

      {/* 검색 결과 목록 */}
      {hasSearched && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs text-gray-400">검색 결과: {filteredRecords.length}건</span>
            {filteredRecords.length > 0 && (
              <button 
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                onClick={handleDownloadCSV}
              >
                <Download size={14} />
                <span>CSV 다운로드</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pb-6">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400">
                해당 기간의 측정 기록이 없습니다.
              </div>
            ) : (
              filteredRecords.map(r => (
                <div 
                  key={r.id}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-200">
                      {r.date} ({r.dayOfWeek.slice(0, 1)})
                    </div>
                    <div className="text-gray-400 text-[10px]">
                      {r.time} | {r.medicine}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">
                      {r.value} mmHg
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">
                      {r.eye === 'right' ? '우안' : '좌안'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
