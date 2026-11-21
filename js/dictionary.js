/**
 * 세대 공감 사전 (Generation Dictionary)
 * 사진 속 디자인과 완벽하게 일치하는 단어 하이라이트 & 단어 풀이 엔진
 */

const GENERATION_DICTIONARY = {
  // 청년 신조어
  youth: [
    {
      word: "중꺾마",
      origin: "청년 신조어",
      meaning: "'중요한 것은 꺾이지 않는 마음'의 줄임말",
      easyExplain: "어려운 일이 닥쳐도 포기하지 않고 꿋꿋하게 이겨내려는 굳센 마음을 뜻해요.",
      example: "요즘은 어려운 일이 있어도 포기하지 말자는 뜻의 '중꺾마'라는 말이 유행이에요!",
      equivalent: "백절불굴 / 칠전팔기"
    },
    {
      word: "럭키비키",
      origin: "청년 유행어",
      meaning: "모든 상황을 초긍정적으로 바라보는 사고방식",
      easyExplain: "뜻밖의 곤란한 일이 생겨도 '오히려 잘됐다! 운이 좋다!'라며 긍정적으로 생각하는 밝은 마음이에요.",
      example: "모든 상황을 긍정적으로 보려는 '럭키비키'라는 말도 많이 써요!",
      equivalent: "전화위복 / 새옹지마"
    },
    {
      word: "알잘딱깔센",
      origin: "청년 신조어",
      meaning: "'알아서 잘 딱 깔끔하고 센스있게'의 줄임말",
      easyExplain: "눈치 빠르게 스스로 똑똑하고 야무지게 일을 처리하는 모양을 칭찬하는 말이에요.",
      example: "민준이가 회의 준비를 알잘딱깔센하게 끝내뒀더라고요!",
      equivalent: "야무지게 / 눈치 빠르게 / 척척"
    },
    {
      word: "갓생",
      origin: "청년 유행어",
      meaning: "신(God) + 인생(生)의 합성어",
      easyExplain: "게으름 피우지 않고 일찍 일어나 운동이나 공부를 하며 성실하고 보람차게 사는 삶을 말해요.",
      example: "새해에는 아침 6시에 일어나서 운동하는 갓생 살 거예요.",
      equivalent: "근면성실한 삶 / 참된 하루"
    },
    {
      word: "도파민",
      origin: "청년 신조어",
      meaning: "너무 흥미진진해서 심장이 두근거리는 상태",
      easyExplain: "즐거울 때 나오는 호르몬에서 유래해, '너무 재미있어서 눈을 뗄 수 없다'는 뜻으로 써요.",
      example: "오늘 저녁 드라마 전개가 완전 도파민 터지네!",
      equivalent: "흥미진진 / 꿀잼"
    },
    {
      word: "폼 미쳤다",
      origin: "청년 유행어",
      meaning: "실력이나 외모, 상태가 기가 막히게 훌륭함을 극찬하는 말",
      easyExplain: "솜씨나 맵시가 아주 대단하다고 칭찬할 때 쓰는 표현입니다.",
      example: "오늘 할머니가 끓여주신 된장찌개 폼 미쳤어요!",
      equivalent: "솜씨가 기가 막히다 / 물이 올랐다"
    },
    {
      word: "오운완",
      origin: "청년 줄임말",
      meaning: "'오늘 운동 완료'의 줄임말",
      easyExplain: "오늘 목표한 산책이나 운동을 뿌듯하게 마쳤을 때 기록하는 말이에요.",
      example: "동네 한 바퀴 40분 걷기, 오늘도 오운완!",
      equivalent: "오늘 운동 끝"
    },
    {
      word: "핑프",
      origin: "청년 신조어",
      meaning: "'핑거 프린세스(Finger Princess)'의 줄임말",
      easyExplain: "스스로 검색해보면 바로 알 수 있는 것을 직접 찾지 않고 남에게 다 물어보는 태도를 말해요.",
      example: "바로 위에 나와 있는데 왜 안 보고 물어봐? 핑프짓 그만해~",
      equivalent: "스스로 찾지 않는 사람"
    },
    {
      word: "억까",
      origin: "청년 줄임말",
      meaning: "'억지로 까기(비난하기)'의 줄임말",
      easyExplain: "잘못한 것도 없는데 꼬투리를 잡아서 억울하게 트집 잡는 상황을 뜻해요.",
      example: "비가 갑자기 쏟아지다니 하늘이 나를 억까하는 것 같아.",
      equivalent: "트집 잡기 / 애꿎은 탓"
    },
    {
      word: "뇌절",
      origin: "청년 신조어",
      meaning: "같은 말이나 장난을 적당히 끝내지 않고 지나치게 반복해 눈살을 찌푸리게 하는 행위",
      easyExplain: "도를 넘어서 과하게 행동하는 것을 말해요.",
      example: "농담은 1절만 해야지 계속하니까 뇌절이다.",
      equivalent: "도가 지나침 / 주책"
    },
    {
      word: "분좋카",
      origin: "청년 줄임말",
      meaning: "'분위기 좋은 카페'의 줄임말",
      easyExplain: "아늑하거나 경치가 멋져서 이야기 나누기 좋은 찻집을 말해요.",
      example: "이번 주말에 예쁜 분좋카 가서 차 한잔 마실래요?",
      equivalent: "운치 있는 찻집"
    }
  ],

  // 어르신 고유어/옛말
  elder: [
    {
      word: "혜안",
      origin: "전통 한자어 (慧眼)",
      meaning: "사물의 본질이나 앞날을 꿰뚫어 보는 슬기로운 안목",
      easyExplain: "인생의 경험과 지혜가 깊어서 상황을 깊고 넓게 내다보는 통찰력을 뜻해요.",
      example: "선배님의 혜안 덕분에 어려운 고비를 잘 넘겼습니다.",
      equivalent: "통찰력 / 깊은 안목"
    },
    {
      word: "시나브로",
      origin: "순우리말",
      meaning: "모르는 사이에 조금씩 조금씩",
      easyExplain: "눈에 띄지 않게 천천히, 하지만 꾸준하게 스며드는 아름다운 순우리말입니다.",
      example: "시나브로 봄이 다가와 들꽃이 피었네.",
      equivalent: "조금씩 서서히"
    },
    {
      word: "개치네네",
      origin: "순우리말",
      meaning: "재채기를 한 뒤 감기가 들지 않도록 빌어주는 감탄사",
      easyExplain: "재채기한 사람이 감기 앓지 말고 건강하길 바라는 따뜻한 우리 옛말이에요 (서양의 Bless you).",
      example: "에이취! 어이쿠 개치네네, 감기 조심하거라.",
      equivalent: "감기 걸리지 마 (덕담)"
    },
    {
      word: "고샅길",
      origin: "순우리말",
      meaning: "마을의 좁은 골목길이나 사이 길",
      easyExplain: "가옥들 사이사이에 정겹게 얽혀 있는 구불구불한 골목길을 말해요.",
      example: "어릴 적 고샅길에서 동무들과 뛰놀았단다.",
      equivalent: "정겨운 골목길"
    },
    {
      word: "지청구",
      origin: "순우리말",
      meaning: "까닭 없이 남을 탓하거나 책망하는 잔소리 또는 꾸지람",
      easyExplain: "서운하거나 답답해서 툭툭 던지는 잔소리나 꾸중을 말합니다.",
      example: "늦잠 자다 아침부터 지청구를 들었지 뭐냐.",
      equivalent: "잔소리 / 꾸중"
    },
    {
      word: "심심한",
      origin: "전통 한자어 (甚深한)",
      meaning: "마음의 표현이나 감정이 마음 깊숙하고 매우 간절함",
      easyExplain: "'지루하다'가 아니라 '마음 깊은 곳에서 우러나온다'는 깊은 정성의 뜻이에요.",
      example: "수고해주신 여러분께 심심한 감사의 말씀을 드립니다.",
      equivalent: "진심 어린 / 깊은 마음의"
    },
    {
      word: "에누리",
      origin: "순우리말",
      meaning: "값을 깎는 일, 또는 물건값을 실제보다 올려 부르는 일",
      easyExplain: "시장에서 물건 살 때 깎아주거나 덤을 얹어주는 정겨운 흥정을 뜻해요.",
      example: "단골이니까 천 원 에누리해서 드릴게!",
      equivalent: "할인 / 깎아주기"
    },
    {
      word: "툇마루",
      origin: "전통 건축 용어",
      meaning: "방과 마당 사이에 걸쳐 놓은 좁은 나무 마루",
      easyExplain: "햇볕을 쬐며 차 한잔 마시기 좋은 한옥의 정겨운 마루 공간입니다.",
      example: "따스한 툇마루에 앉아 차 한잔 마시면 참 좋단다.",
      equivalent: "한옥 베란다"
    }
  ],

  // 제주 지역 특화 방언 (제주어 데이터셋)
  jeju: [
    {
      word: "혼저옵서예",
      origin: "제주 방언 (지역 특화)",
      meaning: "'어서 오세요'라는 뜻의 대표적인 제주도 환영 인사말",
      easyExplain: "손님이나 반가운 이를 두 팔 벌려 환영하는 다정한 제주도 인사예요.",
      example: "아이고 혼저옵서예! 오늘 하루도 물질하고 일하느라 폭싹 속았수다.",
      equivalent: "어서 오세요 / 환영합니다"
    },
    {
      word: "폭싹 속았수다",
      origin: "제주 방언 (지역 특화)",
      meaning: "'정말 대단히 수고 많으셨습니다'라는 뜻의 따뜻한 위로와 격려 덕담",
      easyExplain: "속았다는 뜻이 아니라, 오늘 하루 고된 일상을 꿋꿋이 버텨낸 이를 깊이 위로하는 표현이에요.",
      example: "오늘 시험 보고 면접 보느라 폭싹 속았수다. 기운 내렴!",
      equivalent: "수고 많으셨습니다 / 고생하셨습니다"
    },
    {
      word: "밥은 먹언?",
      origin: "제주 구어체",
      meaning: "'식사는 하셨나요? / 밥 먹었니?'라는 정겨운 안부 인사",
      easyExplain: "상대방의 끼니와 건강을 살뜰히 챙겨 묻는 제주 삼춘들의 따뜻한 안부입니다.",
      example: "아이고 우리 청년, 밥은 먹언? 빈속으로 다니지 말거라.",
      equivalent: "식사하셨어요? / 밥 먹었니?"
    },
    {
      word: "어떵 살맨?",
      origin: "제주 방언",
      meaning: "'요즘 어떻게 잘 지내고 있니?'라는 안부 질문",
      easyExplain: "오랜만에 만난 이웃이나 후배에게 일상을 다정하게 묻는 제주어예요.",
      example: "성산포 떠나 서울 가더니 어떵 살맨?",
      equivalent: "어떻게 지내니?"
    },
    {
      word: "맨도롱 또똣",
      origin: "제주 방언",
      meaning: "'기분 좋게 따뜻하고 알맞은 온도'를 나타내는 형용사",
      easyExplain: "너무 뜨겁지도 차갑지도 않고 가슴속까지 포근하고 훈훈하게 감싸주는 온기예요.",
      example: "맨도롱 또똣한 메밀차 한 잔 마시멍 이야기 나눠보자꾸나.",
      equivalent: "따뜻하고 훈훈한 / 온기 가득한"
    },
    {
      word: "지꺼지게",
      origin: "제주 방언",
      meaning: "'기쁘고 신명나게 / 즐겁게'",
      easyExplain: "마음속에 걱정 근심을 털어내고 신나고 유쾌하게 어울리는 모양을 뜻해요.",
      example: "오늘 저녁엔 삼춘들이랑 다 같이 지꺼지게 웃어봅주!",
      equivalent: "기쁘게 / 즐겁게 / 신명나게"
    },
    {
      word: "놀멍 쉬멍",
      origin: "제주 슬로라이프 표현",
      meaning: "'놀면서 쉬면서 천천히 여유롭게'",
      easyExplain: "앞만 보고 조급하게 뛰지 말고, 때로는 쉬어가며 인생을 즐기자는 제주의 지혜입니다.",
      example: "청년아, 너무 조급해하지 말고 놀멍 쉬멍 가도 괜찮다.",
      equivalent: "쉬어가며 여유롭게"
    },
    {
      word: "호썰만 기둘립서",
      origin: "제주 방언",
      meaning: "'조금만 기다려 주세요'",
      easyExplain: "잠시만 여유를 갖고 기다려 달라는 정중하고 나긋나긋한 제주어 부탁입니다.",
      example: "따끈한 톳밥 금방 내올 테니 호썰만 기둘립서!",
      equivalent: "조금만 기다려 주세요"
    },
    {
      word: "잘도 아꼽다",
      origin: "제주 방언",
      meaning: "'정말 사랑스럽고 귀엽다'",
      easyExplain: "보고만 있어도 눈에 넣어도 아프지 않을 만큼 예쁘고 귀여울 때 쓰는 칭찬이에요.",
      example: "손주 녀석 웃는 얼굴이 잘도 아꼽네!",
      equivalent: "너무 사랑스럽다 / 귀엽다"
    },
    {
      word: "잘도 곱딱하다",
      origin: "제주 방언",
      meaning: "'정말 곱고 예쁘다 / 아름답다'",
      easyExplain: "사람의 마음씨나 얼굴, 풍경이 곱고 고울 때 쓰는 찬사예요.",
      example: "성산포 바당에 피어난 유채꽃이 잘도 곱딱하구나.",
      equivalent: "아주 곱고 예쁘다"
    },
    {
      word: "무사 경 햄수과?",
      origin: "제주 방언",
      meaning: "'왜 그렇게 하세요?'",
      easyExplain: "영문을 부드럽고 다정하게 물어보는 제주의 의문 표현입니다.",
      example: "몸도 성치 않은데 무사 경 햄수과? 쉬멍 헙서.",
      equivalent: "왜 그렇게 하세요?"
    },
    {
      word: "게난 말이다",
      origin: "제주 구어 추임새",
      meaning: "'그러니까 말이야! / 내 말이 그 말이야!'",
      easyExplain: "상대방의 이야기에 크게 맞장구치고 깊이 공감할 때 쓰는 정겨운 추임새예요.",
      example: "게난 말이다! 사람 사는 게 다 저마다의 속도가 있는 법이지.",
      equivalent: "그러게 말이야 / 전적으로 동감해"
    },
    {
      word: "안트레 들어옵서",
      origin: "제주 방언",
      meaning: "'안으로 들어오세요'",
      easyExplain: "바깥에 서 있지 말고 집 안이나 방 안으로 들어오라는 친절한 초대 인사말입니다.",
      example: "바람 찬데 밖에서 서성이지 말고 안트레 들어옵서!",
      equivalent: "안으로 들어오세요"
    }
  ]
};

const ALL_WORDS = [
  ...GENERATION_DICTIONARY.youth.map(i => ({ ...i, type: 'youth' })),
  ...GENERATION_DICTIONARY.elder.map(i => ({ ...i, type: 'elder' })),
  ...GENERATION_DICTIONARY.jeju.map(i => ({ ...i, type: 'jeju' }))
];

/**
 * 단어 하이라이트 치환:
 * 사용자가 제공한 사진과 100% 동일하게
 * 살구/노란색 배경 (#fff7e6) + 점선 테두리 (#f5a623 / amber-400) + 갈색 텍스트 + 돋보기 아이콘 🔍
 */
function highlightDictionaryWords(text) {
  if (!text) return text;
  let processed = text;

  // 단어 긴 것부터 정렬
  const sorted = [...ALL_WORDS].sort((a, b) => b.word.length - a.word.length);

  sorted.forEach(item => {
    const word = item.word;
    const regex = new RegExp(`(?<![<\\w])(${escapeRegExp(word)})(?![>\\w])`, 'gi');
    processed = processed.replace(regex, (match) => {
      // 사진 속 디자인 그대로 구현:
      return `<button type="button" class="dict-word-btn inline-flex items-center px-2 py-0.5 mx-1 rounded-xl bg-[#fff7e6] hover:bg-[#ffeed0] border-2 border-dashed border-[#e6a23c] text-[#8c4b00] font-extrabold text-base md:text-lg cursor-pointer transition-transform hover:scale-105 shadow-xs align-middle" data-word="${item.word}" title="클릭하면 뜻이 나옵니다"><span>${match}</span><span class="text-sm ml-1 opacity-80">🔍</span></button>`;
    });
  });

  return processed;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findDictionaryWord(query) {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  let match = ALL_WORDS.find(w => w.word.toLowerCase() === q);
  if (match) return match;
  return ALL_WORDS.find(w => q.includes(w.word.toLowerCase()) || w.word.toLowerCase().includes(q)) || null;
}

function analyzeWord(word) {
  const found = findDictionaryWord(word);
  if (found) return found;
  return {
    word: word,
    origin: "세대 표현",
    meaning: `"${word}"에 대한 맞춤형 세대 해석입니다.`,
    easyExplain: `대화 상대방의 세대 말투나 표현이에요. 뜻이 궁금하시면 대화창에 직접 물어보셔도 친절하게 알려드립니다!`,
    example: `상대방에게 물어보기: "방금 '${word}'라고 하셨는데 어떤 뜻인가요?"`,
    equivalent: "문맥에 따른 쉬운 설명"
  };
}

window.GenerationDictionary = {
  data: GENERATION_DICTIONARY,
  all: ALL_WORDS,
  find: findDictionaryWord,
  highlight: highlightDictionaryWords,
  analyze: analyzeWord
};
