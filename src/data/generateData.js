// 기존 기업 기반 연관 기업 대규모 생성기

const RELATION_TYPES = [
  { type: 'supplier', prefix: '', suffix: '부품', relation: 'supply_chain' },
  { type: 'supplier', prefix: '', suffix: '소재', relation: 'supply_chain' },
  { type: 'supplier', prefix: '', suffix: '장비', relation: 'supply_chain' },
  { type: 'supplier', prefix: '', suffix: '모듈', relation: 'supply_chain' },
  { type: 'competitor', prefix: '', suffix: '테크', relation: 'sector' },
  { type: 'competitor', prefix: '', suffix: '시스템즈', relation: 'sector' },
  { type: 'competitor', prefix: '', suffix: '솔루션', relation: 'sector' },
  { type: 'subsidiary', prefix: '', suffix: '코리아', relation: 'investment' },
  { type: 'subsidiary', prefix: '', suffix: '재팬', relation: 'investment' },
  { type: 'subsidiary', prefix: '', suffix: '차이나', relation: 'investment' },
  { type: 'subsidiary', prefix: '', suffix: '유럽', relation: 'investment' },
  { type: 'partner', prefix: '', suffix: '파트너스', relation: 'partnership' },
  { type: 'partner', prefix: '', suffix: '벤처스', relation: 'partnership' },
  { type: 'customer', prefix: '', suffix: '리테일', relation: 'supply_chain' },
  { type: 'customer', prefix: '', suffix: '서비스', relation: 'supply_chain' },
]

const PREFIXES = [
  '글로벌', '유나이티드', '퍼스트', '프라임', '넥스트', '퓨처', '스마트', '메가', '울트라', '하이퍼',
  '알파', '베타', '델타', '오메가', '노바', '스텔라', '퀀텀', '네오', '젠', '맥스',
  '블루', '레드', '그린', '골든', '실버', '플래티넘', '로얄', '임페리얼', '수퍼', '엘리트',
  '어드밴스드', '프리미엄', '인피니티', '에버', '올웨이즈', '퍼펙트', '클리어', '브라이트', '파워', '포스',
  '뉴', '모던', '클래식', '유니크', '스페셜', '익스트림', '얼티밋', '토탈', '풀', '리얼',
]

const INDUSTRIES = [
  { name: '반도체', suffixes: ['세미콘', '칩', '웨이퍼', '패키징', '테스트', 'FAB', '파운드리', '설계', 'IP', 'EDA'] },
  { name: '디스플레이', suffixes: ['디스플레이', 'OLED', 'LCD', '패널', '글라스', '필름', '소재', '장비', '모듈', '터치'] },
  { name: '2차전지', suffixes: ['배터리', '셀', '양극재', '음극재', '분리막', '전해질', 'BMS', '팩', '리사이클', '소재'] },
  { name: 'AI', suffixes: ['AI', '머신러닝', '딥러닝', 'LLM', 'GPU', 'NPU', '데이터', '클라우드', '엣지', '로보틱스'] },
  { name: '자동차', suffixes: ['모터스', '오토', 'EV', '모빌리티', '부품', '전장', '센서', '라이다', '자율주행', '충전'] },
  { name: '바이오', suffixes: ['바이오', '파마', '메디컬', '진단', '치료제', '백신', '세포', '유전자', '헬스', '케어'] },
  { name: '에너지', suffixes: ['에너지', '파워', '솔라', '윈드', '그린', '수소', '연료전지', 'ESS', '그리드', '전력'] },
  { name: '금융', suffixes: ['파이낸셜', '캐피탈', '증권', '은행', '보험', '자산', '투자', '펀드', '핀테크', '페이'] },
  { name: '소프트웨어', suffixes: ['소프트', '클라우드', 'SaaS', '플랫폼', '앱', '시스템', '솔루션', '서비스', '디지털', '테크'] },
  { name: '통신', suffixes: ['텔레콤', '네트워크', '5G', '6G', '위성', '광통신', '인프라', '통신', '모바일', 'IoT'] },
  { name: '물류', suffixes: ['로지스틱스', '물류', '배송', '운송', '항공', '해운', '택배', '풀필먼트', '창고', '유통'] },
  { name: '소비재', suffixes: ['푸드', '음료', '화장품', '패션', '리빙', '가전', '가구', '완구', '스포츠', '레저'] },
  { name: '건설', suffixes: ['건설', 'E&C', '엔지니어링', '플랜트', '인프라', '시멘트', '철강', '자재', '설비', '중공업'] },
  { name: '미디어', suffixes: ['미디어', '엔터', '콘텐츠', '게임', '방송', '스튜디오', '뮤직', '애니', '웹툰', '메타버스'] },
]

const COLORS = [
  '#3182F6', '#8B5CF6', '#00C471', '#F59E0B', '#F45452', '#EC4899', '#06B6D4', '#84CC16',
  '#FF6600', '#C5A900', '#00629B', '#9333EA', '#14B8A6', '#DC2626', '#0891B2', '#7C3AED',
  '#059669', '#D97706', '#BE185D', '#0284C7', '#4F46E5', '#15803D', '#B91C1C', '#7E22CE',
  '#0D9488', '#CA8A04', '#DB2777', '#2563EB', '#6D28D9', '#16A34A', '#EF4444', '#A855F7',
]

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateTicker(index) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const num = index.toString().padStart(3, '0')
  const l1 = letters[index % 26]
  const l2 = letters[Math.floor(index / 26) % 26]
  return l1 + l2 + num
}

// 기존 기업 기반으로 연관 기업 생성
export function generateRelatedCompanies(coreCompanies, targetCount = 100000) {
  const companies = [...coreCompanies]
  const usedNames = new Set(coreCompanies.map(c => c.name))
  let idCounter = Math.max(...coreCompanies.map(c => parseInt(c.id))) + 1

  // 각 핵심 기업당 생성할 연관 기업 수
  const companiesPerCore = Math.ceil(targetCount / coreCompanies.length)

  for (const core of coreCompanies) {
    for (let i = 0; i < companiesPerCore && companies.length < targetCount + coreCompanies.length; i++) {
      const industry = randomItem(INDUSTRIES)
      const prefix = randomItem(PREFIXES)
      const suffix = randomItem(industry.suffixes)

      let name = `${prefix} ${suffix}`
      let attempts = 0
      while (usedNames.has(name) && attempts < 50) {
        name = `${randomItem(PREFIXES)} ${randomItem(industry.suffixes)}`
        attempts++
      }
      if (usedNames.has(name)) {
        name = `${prefix} ${suffix} ${idCounter}`
      }
      usedNames.add(name)

      companies.push({
        id: idCounter.toString(),
        name,
        ticker: generateTicker(idCounter),
        sector: core.sector,
        description: `${core.name} 관련 ${industry.name} 기업`,
        color: randomItem(COLORS),
        relatedTo: core.id,
      })
      idCounter++
    }
  }

  return companies
}

// 상세 연결 유형 목록
const CONNECTION_TYPE_GROUPS = {
  competition: ['sector', 'direct_competitor'],
  supply: ['supply_chain', 'supplier', 'customer', 'distributor'],
  investment: ['investment', 'subsidiary', 'joint_venture', 'major_shareholder'],
  partnership: ['partnership', 'technology', 'platform'],
  special: ['spin_off', 'merger_target', 'index'],
}

// 연결 관계 생성 (핵심 기업 중심 + 랜덤 연결)
export function generateConnections(companies, coreCompanyIds, avgConnections = 3) {
  const connections = []
  const connectionSet = new Set()
  let idCounter = 1

  const coreSet = new Set(coreCompanyIds)

  // 1. 핵심 기업 간 연결 (모든 핵심 기업 연결)
  const coreCompanies = companies.filter(c => coreSet.has(c.id))
  for (let i = 0; i < coreCompanies.length; i++) {
    for (let j = i + 1; j < coreCompanies.length; j++) {
      if (Math.random() < 0.3) { // 30% 확률로 연결
        const key = `${coreCompanies[i].id}-${coreCompanies[j].id}`
        if (!connectionSet.has(key)) {
          connectionSet.add(key)
          const sameSector = coreCompanies[i].sector === coreCompanies[j].sector
          let type
          if (sameSector) {
            type = randomItem(CONNECTION_TYPE_GROUPS.competition)
          } else {
            type = randomItem([
              ...CONNECTION_TYPE_GROUPS.supply,
              ...CONNECTION_TYPE_GROUPS.partnership,
              ...CONNECTION_TYPE_GROUPS.investment,
            ])
          }
          connections.push({
            id: (idCounter++).toString(),
            sourceId: coreCompanies[i].id,
            targetId: coreCompanies[j].id,
            type,
            label: '',
            strength: Math.floor(Math.random() * 3) + 3,
          })
        }
      }
    }
  }

  // 2. 연관 기업 → 핵심 기업 연결 (다양한 유형)
  const relatedCompanies = companies.filter(c => c.relatedTo)
  for (const related of relatedCompanies) {
    const key = `${related.relatedTo}-${related.id}`
    if (!connectionSet.has(key)) {
      connectionSet.add(key)
      // 기업명에 따라 연결 유형 결정
      let type = 'supply_chain'
      const name = related.name.toLowerCase()
      if (name.includes('부품') || name.includes('소재') || name.includes('장비')) {
        type = randomItem(['supplier', 'supply_chain'])
      } else if (name.includes('코리아') || name.includes('재팬') || name.includes('차이나')) {
        type = 'subsidiary'
      } else if (name.includes('벤처') || name.includes('캐피탈')) {
        type = randomItem(['investment', 'major_shareholder'])
      } else if (name.includes('파트너') || name.includes('테크')) {
        type = randomItem(['partnership', 'technology'])
      } else if (name.includes('리테일') || name.includes('서비스')) {
        type = randomItem(['customer', 'distributor'])
      } else {
        type = randomItem([
          ...CONNECTION_TYPE_GROUPS.supply,
          ...CONNECTION_TYPE_GROUPS.partnership,
        ])
      }
      connections.push({
        id: (idCounter++).toString(),
        sourceId: related.relatedTo,
        targetId: related.id,
        type,
        label: '',
        strength: Math.floor(Math.random() * 3) + 2,
      })
    }
  }

  // 3. 연관 기업 간 랜덤 연결 (같은 섹터 우선)
  const targetConnections = companies.length * avgConnections / 2
  while (connections.length < targetConnections) {
    const source = randomItem(companies)
    // 같은 섹터에서 연결할 확률 70%
    const samesSector = Math.random() < 0.7
    const candidates = samesSector
      ? companies.filter(c => c.sector === source.sector && c.id !== source.id)
      : companies.filter(c => c.id !== source.id)

    if (candidates.length === 0) continue

    const target = randomItem(candidates)
    const key1 = `${source.id}-${target.id}`
    const key2 = `${target.id}-${source.id}`

    if (!connectionSet.has(key1) && !connectionSet.has(key2)) {
      connectionSet.add(key1)
      const sameSector = source.sector === target.sector
      let type
      if (sameSector) {
        type = randomItem([...CONNECTION_TYPE_GROUPS.competition, ...CONNECTION_TYPE_GROUPS.supply])
      } else {
        type = randomItem([
          ...CONNECTION_TYPE_GROUPS.supply,
          ...CONNECTION_TYPE_GROUPS.partnership,
          'index',
        ])
      }
      connections.push({
        id: (idCounter++).toString(),
        sourceId: source.id,
        targetId: target.id,
        type,
        label: '',
        strength: Math.floor(Math.random() * 4) + 1,
      })
    }
  }

  return connections
}

export function generateMassiveDataFromCore(coreCompanies, targetCount = 100000) {
  console.log(`Generating ${targetCount.toLocaleString()} companies from ${coreCompanies.length} core companies...`)

  const coreIds = coreCompanies.map(c => c.id)
  const companies = generateRelatedCompanies(coreCompanies, targetCount)

  console.log(`Generated ${companies.length.toLocaleString()} companies`)
  console.log('Generating connections...')

  const connections = generateConnections(companies, coreIds, 2)

  console.log(`Generated ${connections.length.toLocaleString()} connections`)

  return { companies, connections }
}

// 기존 호환성 유지
export function generateCompanies(count) {
  return generateRelatedCompanies([], count)
}
