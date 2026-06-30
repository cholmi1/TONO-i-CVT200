import { useState } from 'react'
import { ArrowLeft, ChevronDown } from 'lucide-react'

const GUIDE_ITEMS = [
  {
    num: 1,
    title: '시작 화면 (Splash)',
    desc: '앱 실행 시 최초로 나타나는 화면입니다. 로고 및 안압 관리 솔루션의 고급 비주얼을 확인하고 화면을 터치하여 메인으로 진입합니다.'
  },
  {
    num: 2,
    title: '메인 메뉴 (Menu)',
    desc: '앱의 메인 컨트롤 센터입니다. 기기연결, 안압관리, 기록확인, 기록전송, 알람설정 기능으로 이동하며 하단에서 기기의 실시간 연결 현황을 직관적으로 확인할 수 있습니다.'
  },
  {
    num: 3,
    title: '기기연결 / 측정 (Record)',
    desc: '안압 측정 인터페이스입니다. 블루투스 설정을 터치하여 가상으로 기기를 페어링할 수 있습니다. 수기로 안압값을 직접 기입하거나 자동측정을 가동하여 생성된 수치를 직접 확인한 뒤, 반드시 하단의 "저장" 버튼을 눌러야 최종 이력으로 등재됩니다.'
  },
  {
    num: 4,
    title: '안압 관리 (Management)',
    desc: '개인 맞춤형 안압 목표 관리 공간입니다. 좌안(OS) 및 우안(OD)을 선택하고, 본인의 목표안압 및 위험 경계선인 최고/최저안압 임계값을 직접 기입하여 저장 관리합니다.'
  },
  {
    num: 5,
    title: '안압 기록 (History)',
    desc: '측정된 안압 이력을 한눈에 보는 타임라인입니다. 상단에서 좌/우안을 필터링할 수 있으며, 이력 리스트의 항목을 터치하면 [안압 측정 결과] 상세 정보(안압값, 측정일, 측정시간, 측정기기, 비고 메모 등)를 직접 편집하고 삭제할 수 있는 특수 모달 팝업이 노출됩니다.'
  },
  {
    num: 6,
    title: '기간별 분석 (Analysis)',
    desc: '통계 대시보드입니다. 설정된 날짜 범위 동안의 일평균 안압 변화 추이를 꺾은선 그래프로 표현하며, 최저/최고 안압 수치 및 설정한 임계값 대비 안압을 안정적으로 유지한 비중인 [관리효율(%)]을 자동 연산하여 표기합니다.'
  },
  {
    num: 7,
    title: '기록 전송 (Send)',
    desc: '데이터 내보내기 기능입니다. 시작일과 종료일을 지정하여 검색을 누르면 해당 범위 내의 모든 안압 기록이 수집됩니다. "CSV 다운로드" 버튼을 터치하여 엑셀(Excel)과 호환되는 *.CSV 데이터 파일로 즉시 다운로드할 수 있습니다.'
  },
  {
    num: 8,
    title: '알람 설정 (Alarm)',
    desc: '안압 측정 일정을 등록하는 공간입니다. 원하는 시간과 요일을 지정하고 알람의 목적(알람제목)을 입력하여 생성합니다. "매일" 체크 시 일~토 전체 요일이 즉시 선택되며, 하단 목록에서 각 알람의 활성 상태를 켜고 끌 수 있습니다. 등록된 알람 카드를 누르면 수정 및 삭제 팝업 모달이 노출됩니다.'
  },
  {
    num: 9,
    title: '사용설명서 (Guide)',
    desc: '현재 보고 계신 모바일 도움말 화면입니다. 각 번호별 탭을 터치하면 아코디언 방식으로 페이지별 주요 설명 및 인터랙티브 팁을 열람할 수 있습니다.'
  }
]

export default function GuideScreen({ onNavigate }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index)
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
        <h2 className="text-xl font-bold tracking-wide">사용 가이드</h2>
        <div className="w-9"></div>
      </div>

      {/* 설명 안내 문구 */}
      <div className="mb-6 px-1 text-center">
        <p className="text-xs text-gray-400 leading-relaxed">
          각 항목을 탭하여 TONO-i CVT200 안압관리 앱의<br />
          페이지별 핵심 기능 요약과 활용 가이드를 확인하세요.
        </p>
      </div>

      {/* 아코디언 목록 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pb-8">
        {GUIDE_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx
          return (
            <div 
              key={item.num} 
              className={`border border-white/10 rounded-2xl overflow-hidden bg-white/3 transition-all ${
                isOpen ? 'border-purple-500/35 bg-purple-950/5' : ''
              }`}
            >
              {/* 타이틀 버튼 */}
              <div 
                className="p-4 flex items-center gap-3 cursor-pointer select-none hover:bg-white/5 active:bg-white/10 transition-colors"
                onClick={() => toggleItem(idx)}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isOpen ? 'bg-purple-500 text-white' : 'bg-white/10 text-purple-300'
                }`}>
                  {item.num}
                </div>
                <h4 className="flex-1 text-sm font-semibold text-gray-200">
                  {item.title}
                </h4>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-purple-400' : ''
                  }`} 
                />
              </div>

              {/* 내용 바디 */}
              <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                <div className="px-4 pb-4 pl-13 text-xs text-gray-400 leading-relaxed border-t border-white/2">
                  {item.desc}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
