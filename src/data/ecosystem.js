// 기업별 생태계 테마 및 연관 기업 정의
// 각 테마는 다음 단계로 연결되는 기업들을 포함

export const ECOSYSTEM_DATA = {
  // 아마존
  '1': {
    themes: [
      {
        id: 'ai_cloud',
        name: 'AI/클라우드',
        icon: '🤖',
        companies: [
          { name: 'Anthropic', ticker: 'Private', description: 'Claude AI 개발사, AWS 파트너' },
          { name: 'NVIDIA', ticker: 'NVDA', description: 'AI GPU 공급' },
          { name: 'AMD', ticker: 'AMD', description: ' 데이터센터 CPU/GPU' },
          { name: 'Intel', ticker: 'INTC', description: 'Xeon 서버 CPU' },
        ],
      },
      {
        id: 'datacenter',
        name: '데이터센터 인프라',
        icon: '🏢',
        companies: [
          { name: 'Vertiv', ticker: 'VRT', description: '냉각/전력 장비' },
          { name: 'Equinix', ticker: 'EQIX', description: '코로케이션' },
          { name: 'Arista Networks', ticker: 'ANET', description: '네트워크 스위치' },
        ],
      },
      {
        id: 'ecommerce',
        name: 'e커머스/물류',
        icon: '📦',
        companies: [
          { name: 'Shopify', ticker: 'SHOP', description: '경쟁/파트너' },
          { name: 'FedEx', ticker: 'FDX', description: '배송 파트너' },
          { name: 'UPS', ticker: 'UPS', description: '배송 파트너' },
        ],
      },
      {
        id: 'advertising',
        name: '디지털 광고',
        icon: '📢',
        companies: [
          { name: 'Google', ticker: 'GOOGL', description: '광고 경쟁' },
          { name: 'Meta', ticker: 'META', description: '광고 경쟁' },
          { name: 'The Trade Desk', ticker: 'TTD', description: 'DSP 플랫폼' },
        ],
      },
    ],
  },

  // 마이크로소프트
  '2': {
    themes: [
      {
        id: 'ai',
        name: 'AI/Copilot',
        icon: '🤖',
        companies: [
          { name: 'OpenAI', ticker: 'Private', description: 'GPT 개발사, 전략적 투자' },
          { name: 'NVIDIA', ticker: 'NVDA', description: 'AI GPU 공급' },
          { name: 'AMD', ticker: 'AMD', description: 'AI 가속기' },
        ],
      },
      {
        id: 'cloud',
        name: 'Azure 클라우드',
        icon: '☁️',
        companies: [
          { name: 'Vertiv', ticker: 'VRT', description: 'DC 인프라' },
          { name: 'Nutanix', ticker: 'NTNX', description: '하이브리드 클라우드' },
          { name: 'VMware', ticker: 'VMW', description: '가상화' },
        ],
      },
      {
        id: 'gaming',
        name: '게임/Xbox',
        icon: '🎮',
        companies: [
          { name: 'Activision Blizzard', ticker: 'ATVI', description: '인수 완료' },
          { name: 'Sony', ticker: 'SONY', description: 'PlayStation 경쟁' },
          { name: 'Nintendo', ticker: 'NTDOY', description: 'Switch 경쟁' },
        ],
      },
      {
        id: 'enterprise',
        name: '엔터프라이즈 SW',
        icon: '💼',
        companies: [
          { name: 'Salesforce', ticker: 'CRM', description: 'CRM 경쟁' },
          { name: 'ServiceNow', ticker: 'NOW', description: 'IT 서비스 경쟁' },
          { name: 'Workday', ticker: 'WDAY', description: 'HR SW 경쟁' },
        ],
      },
    ],
  },

  // TSMC
  '7': {
    themes: [
      {
        id: 'ai_chips',
        name: 'AI 반도체 고객',
        icon: '🧠',
        companies: [
          { name: 'NVIDIA', ticker: 'NVDA', description: 'H100/H200 생산' },
          { name: 'AMD', ticker: 'AMD', description: 'MI300 생산' },
          { name: 'Broadcom', ticker: 'AVGO', description: 'AI ASIC 생산' },
        ],
      },
      {
        id: 'mobile',
        name: '모바일 AP 고객',
        icon: '📱',
        companies: [
          { name: 'Apple', ticker: 'AAPL', description: 'A/M 시리즈 칩' },
          { name: 'Qualcomm', ticker: 'QCOM', description: 'Snapdragon' },
          { name: 'MediaTek', ticker: '2454.TW', description: 'Dimensity' },
        ],
      },
      {
        id: 'equipment',
        name: '반도체 장비',
        icon: '🔧',
        companies: [
          { name: 'ASML', ticker: 'ASML', description: 'EUV 노광장비 독점' },
          { name: 'Applied Materials', ticker: 'AMAT', description: '증착/식각 장비' },
          { name: 'Lam Research', ticker: 'LRCX', description: '식각 장비' },
          { name: 'KLA', ticker: 'KLAC', description: '검사 장비' },
        ],
      },
      {
        id: 'materials',
        name: '반도체 소재',
        icon: '⚗️',
        companies: [
          { name: 'Entegris', ticker: 'ENTG', description: '특수화학/필터' },
          { name: 'Air Products', ticker: 'APD', description: '특수가스' },
          { name: 'Shin-Etsu', ticker: '4063.T', description: '실리콘 웨이퍼' },
        ],
      },
      {
        id: 'packaging',
        name: '패키징/테스트',
        icon: '📦',
        companies: [
          { name: 'ASE Technology', ticker: 'ASX', description: 'OSAT 1위' },
          { name: 'Amkor', ticker: 'AMKR', description: 'OSAT' },
          { name: 'Teradyne', ticker: 'TER', description: '반도체 테스트' },
        ],
      },
    ],
  },

  // NVIDIA
  'NVDA': {
    themes: [
      {
        id: 'datacenter',
        name: '데이터센터 고객',
        icon: '🏢',
        companies: [
          { name: 'Amazon', ticker: 'AMZN', description: 'AWS' },
          { name: 'Microsoft', ticker: 'MSFT', description: 'Azure' },
          { name: 'Google', ticker: 'GOOGL', description: 'GCP' },
          { name: 'Meta', ticker: 'META', description: 'AI 인프라' },
        ],
      },
      {
        id: 'manufacturing',
        name: '제조 파트너',
        icon: '🏭',
        companies: [
          { name: 'TSMC', ticker: 'TSM', description: 'GPU 생산' },
          { name: 'Samsung', ticker: '005930.KS', description: 'HBM 메모리' },
          { name: 'SK Hynix', ticker: '000660.KS', description: 'HBM 메모리' },
          { name: 'Micron', ticker: 'MU', description: 'HBM 메모리' },
        ],
      },
      {
        id: 'networking',
        name: '네트워킹',
        icon: '🔗',
        companies: [
          { name: 'Arista Networks', ticker: 'ANET', description: 'DC 스위치' },
          { name: 'Cisco', ticker: 'CSCO', description: '네트워크 장비' },
          { name: 'Broadcom', ticker: 'AVGO', description: 'NIC/스위치칩' },
        ],
      },
      {
        id: 'software',
        name: 'AI 소프트웨어',
        icon: '💻',
        companies: [
          { name: 'Palantir', ticker: 'PLTR', description: 'AI 플랫폼' },
          { name: 'Databricks', ticker: 'Private', description: '데이터/AI' },
          { name: 'Snowflake', ticker: 'SNOW', description: '데이터 클라우드' },
        ],
      },
    ],
  },

  // Vertiv
  '14': {
    themes: [
      {
        id: 'customers',
        name: '하이퍼스케일러 고객',
        icon: '☁️',
        companies: [
          { name: 'Amazon', ticker: 'AMZN', description: 'AWS DC' },
          { name: 'Microsoft', ticker: 'MSFT', description: 'Azure DC' },
          { name: 'Google', ticker: 'GOOGL', description: 'GCP DC' },
          { name: 'Meta', ticker: 'META', description: 'AI DC' },
        ],
      },
      {
        id: 'power',
        name: '전력 공급',
        icon: '⚡',
        companies: [
          { name: 'Vistra', ticker: 'VST', description: '전력 생산' },
          { name: 'Constellation Energy', ticker: 'CEG', description: '원자력' },
          { name: 'NextEra Energy', ticker: 'NEE', description: '재생에너지' },
        ],
      },
      {
        id: 'competitors',
        name: '경쟁사',
        icon: '🥊',
        companies: [
          { name: 'Schneider Electric', ticker: 'SU.PA', description: '전력/냉각' },
          { name: 'Eaton', ticker: 'ETN', description: '전력관리' },
          { name: 'Johnson Controls', ticker: 'JCI', description: '빌딩관리' },
        ],
      },
      {
        id: 'cooling',
        name: '냉각 기술',
        icon: '❄️',
        companies: [
          { name: 'Modine Manufacturing', ticker: 'MOD', description: '열관리' },
          { name: 'nVent Electric', ticker: 'NVT', description: '전기 연결' },
          { name: 'Carrier Global', ticker: 'CARR', description: 'HVAC' },
        ],
      },
    ],
  },

  // 테슬라
  '15': {
    themes: [
      {
        id: 'battery',
        name: '배터리/에너지',
        icon: '🔋',
        companies: [
          { name: 'Panasonic', ticker: 'PCRFY', description: '배터리 셀 공급' },
          { name: 'CATL', ticker: '300750.SZ', description: '배터리 공급' },
          { name: 'LG Energy Solution', ticker: '373220.KS', description: '배터리' },
          { name: 'BYD', ticker: 'BYDDY', description: '경쟁/배터리' },
        ],
      },
      {
        id: 'chips',
        name: '반도체/AI',
        icon: '🧠',
        companies: [
          { name: 'NVIDIA', ticker: 'NVDA', description: 'FSD 학습' },
          { name: 'Samsung', ticker: '005930.KS', description: 'FSD 칩 생산' },
          { name: 'Ambarella', ticker: 'AMBA', description: 'AI 비전' },
        ],
      },
      {
        id: 'materials',
        name: '소재/원자재',
        icon: '⛏️',
        companies: [
          { name: 'MP Materials', ticker: 'MP', description: '희토류' },
          { name: 'Albemarle', ticker: 'ALB', description: '리튬' },
          { name: 'Livent', ticker: 'LTHM', description: '리튬' },
        ],
      },
      {
        id: 'charging',
        name: '충전 인프라',
        icon: '⚡',
        companies: [
          { name: 'ChargePoint', ticker: 'CHPT', description: '충전 네트워크' },
          { name: 'EVgo', ticker: 'EVGO', description: '고속 충전' },
          { name: 'Blink Charging', ticker: 'BLNK', description: '충전기' },
        ],
      },
    ],
  },

  // Apple
  '6': {
    themes: [
      {
        id: 'chips',
        name: '반도체',
        icon: '🧠',
        companies: [
          { name: 'TSMC', ticker: 'TSM', description: 'A/M칩 생산' },
          { name: 'Samsung Display', ticker: '005930.KS', description: 'OLED' },
          { name: 'SK Hynix', ticker: '000660.KS', description: '메모리' },
        ],
      },
      {
        id: 'components',
        name: '핵심 부품',
        icon: '🔧',
        companies: [
          { name: 'Qualcomm', ticker: 'QCOM', description: '5G 모뎀' },
          { name: 'Broadcom', ticker: 'AVGO', description: 'WiFi/BT 칩' },
          { name: 'Sony', ticker: 'SONY', description: '이미지 센서' },
        ],
      },
      {
        id: 'manufacturing',
        name: '제조/조립',
        icon: '🏭',
        companies: [
          { name: 'Foxconn', ticker: '2317.TW', description: 'iPhone 조립' },
          { name: 'Pegatron', ticker: '4938.TW', description: 'iPhone 조립' },
          { name: 'Luxshare', ticker: '002475.SZ', description: 'AirPods 조립' },
        ],
      },
      {
        id: 'services',
        name: '서비스/콘텐츠',
        icon: '🎵',
        companies: [
          { name: 'Spotify', ticker: 'SPOT', description: '음악 경쟁' },
          { name: 'Netflix', ticker: 'NFLX', description: '스트리밍 경쟁' },
          { name: 'Google', ticker: 'GOOGL', description: '검색 수수료' },
        ],
      },
    ],
  },

  // Meta
  '5': {
    themes: [
      {
        id: 'ai_infra',
        name: 'AI 인프라',
        icon: '🤖',
        companies: [
          { name: 'NVIDIA', ticker: 'NVDA', description: 'AI GPU' },
          { name: 'AMD', ticker: 'AMD', description: 'AI 가속기' },
          { name: 'Broadcom', ticker: 'AVGO', description: 'AI ASIC' },
        ],
      },
      {
        id: 'vr_ar',
        name: 'VR/AR (Reality Labs)',
        icon: '🥽',
        companies: [
          { name: 'Qualcomm', ticker: 'QCOM', description: 'XR 칩' },
          { name: 'Sony', ticker: 'SONY', description: 'PSVR 경쟁' },
          { name: 'Apple', ticker: 'AAPL', description: 'Vision Pro 경쟁' },
        ],
      },
      {
        id: 'advertising',
        name: '디지털 광고',
        icon: '📢',
        companies: [
          { name: 'Google', ticker: 'GOOGL', description: '광고 경쟁' },
          { name: 'Amazon', ticker: 'AMZN', description: '광고 경쟁' },
          { name: 'The Trade Desk', ticker: 'TTD', description: '광고 기술' },
        ],
      },
    ],
  },

  // Micron
  '11': {
    themes: [
      {
        id: 'ai_memory',
        name: 'AI/HBM 메모리',
        icon: '🧠',
        companies: [
          { name: 'NVIDIA', ticker: 'NVDA', description: 'HBM 고객' },
          { name: 'AMD', ticker: 'AMD', description: 'HBM 고객' },
          { name: 'SK Hynix', ticker: '000660.KS', description: 'HBM 경쟁' },
          { name: 'Samsung', ticker: '005930.KS', description: 'HBM 경쟁' },
        ],
      },
      {
        id: 'equipment',
        name: '반도체 장비',
        icon: '🔧',
        companies: [
          { name: 'Applied Materials', ticker: 'AMAT', description: '증착 장비' },
          { name: 'Lam Research', ticker: 'LRCX', description: '식각 장비' },
          { name: 'ASML', ticker: 'ASML', description: 'EUV 장비' },
        ],
      },
      {
        id: 'datacenter',
        name: '데이터센터 고객',
        icon: '🏢',
        companies: [
          { name: 'Amazon', ticker: 'AMZN', description: 'AWS' },
          { name: 'Microsoft', ticker: 'MSFT', description: 'Azure' },
          { name: 'Google', ticker: 'GOOGL', description: 'GCP' },
        ],
      },
    ],
  },

  // MP Materials
  '23': {
    themes: [
      {
        id: 'ev',
        name: '전기차/모터',
        icon: '🚗',
        companies: [
          { name: 'Tesla', ticker: 'TSLA', description: 'EV 모터' },
          { name: 'GM', ticker: 'GM', description: 'Ultium 모터' },
          { name: 'Ford', ticker: 'F', description: 'EV 모터' },
        ],
      },
      {
        id: 'wind',
        name: '풍력 발전',
        icon: '💨',
        companies: [
          { name: 'Vestas', ticker: 'VWS.CO', description: '풍력 터빈' },
          { name: 'GE Vernova', ticker: 'GEV', description: '풍력 터빈' },
          { name: 'Siemens Gamesa', ticker: 'SGRE.MC', description: '풍력' },
        ],
      },
      {
        id: 'defense',
        name: '방산',
        icon: '🛡️',
        companies: [
          { name: 'Lockheed Martin', ticker: 'LMT', description: '미사일/항공' },
          { name: 'Raytheon', ticker: 'RTX', description: '정밀유도' },
          { name: 'Northrop Grumman', ticker: 'NOC', description: '항공우주' },
        ],
      },
      {
        id: 'mining',
        name: '광업/소재',
        icon: '⛏️',
        companies: [
          { name: 'Lynas Rare Earths', ticker: 'LYC.AX', description: '희토류 경쟁' },
          { name: 'China Northern Rare Earth', ticker: '600111.SS', description: '중국 경쟁' },
          { name: 'Ucore Rare Metals', ticker: 'UCU.V', description: '희토류' },
        ],
      },
    ],
  },

  // Vistra
  '22': {
    themes: [
      {
        id: 'datacenter',
        name: '데이터센터 전력',
        icon: '🏢',
        companies: [
          { name: 'Vertiv', ticker: 'VRT', description: '전력/냉각 장비' },
          { name: 'Amazon', ticker: 'AMZN', description: 'AWS DC' },
          { name: 'Microsoft', ticker: 'MSFT', description: 'Azure DC' },
        ],
      },
      {
        id: 'nuclear',
        name: '원자력',
        icon: '☢️',
        companies: [
          { name: 'Constellation Energy', ticker: 'CEG', description: '원전 운영' },
          { name: 'Cameco', ticker: 'CCJ', description: '우라늄' },
          { name: 'Uranium Energy', ticker: 'UEC', description: '우라늄' },
        ],
      },
      {
        id: 'utilities',
        name: '유틸리티',
        icon: '⚡',
        companies: [
          { name: 'NextEra Energy', ticker: 'NEE', description: '재생에너지' },
          { name: 'Duke Energy', ticker: 'DUK', description: '전력' },
          { name: 'Southern Company', ticker: 'SO', description: '전력' },
        ],
      },
    ],
  },
}

// 기업명 또는 티커로 생태계 데이터 검색
export function findEcosystemByName(companies, name) {
  const company = companies.find(
    c => c.name.toLowerCase().includes(name.toLowerCase()) ||
         c.ticker?.toLowerCase() === name.toLowerCase()
  )
  if (!company) return null

  return {
    company,
    ecosystem: ECOSYSTEM_DATA[company.id] || ECOSYSTEM_DATA[company.ticker] || null
  }
}

// 테마 기업에서 실제 기업 데이터 찾기
export function resolveThemeCompany(companies, themeCompany) {
  return companies.find(
    c => c.ticker === themeCompany.ticker ||
         c.name.includes(themeCompany.name)
  )
}
