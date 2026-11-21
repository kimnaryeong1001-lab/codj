/**
 * 세대 공감 3인 3색 AI 페르소나 엔진
 */

const AI_PERSONAS = {
  // 1. 박민준 청년 (AI 24세) - 사진 속 이름 일치
  minjun: {
    id: "minjun",
    name: "박민준 청년 (AI)",
    age: "24세",
    tagline: "호기심 많은 활기찬 20대",
    avatar: "🧑‍💻",
    roleType: "youth",
    voiceConfig: { pitch: 1.1, rate: 1.05 },
    status: "노트북으로 코딩하다 도서관에서 차 마시는 중",
    // 사진에 나온 대화 문장을 기본 인사말로 완벽 반영
    greeting: "요즘은 어려운 일이 있어도 포기하지 말자는 뜻의 '중꺾마'나, 모든 상황을 긍정적으로 보려는 '럭키비키'라는 말이 유행이에요! 예의 바르면서도 통통 튀는 말들이 참 많은데, 어르신께서 젊으셨을 때 친구분들 사이에서 유행했던 말은 무엇이었나요?",
    sampleTopics: ["스마트폰/인터넷 꿀팁 쉽게 알기", "요즘 청년들의 솔직한 생각과 일상", "어르신들의 지혜와 옛날이야기 배우기", "세대 공감 신조어 나들이"],

    generateReply: function(userText, userRole) {
      const text = userText.toLowerCase();

      if (text.includes("혜안") || text.includes("시나브로") || text.includes("개치네네") || text.includes("고샅길") || text.includes("에누리") || text.includes("지청구") || text.includes("툇마루")) {
        return "우와, '시나브로'나 '혜안' 같은 우리말 표현은 들을 때마다 정말 운치 있고 깊이가 느껴져요! 요즘 저희 또래들은 말을 너무 줄여 쓰곤 하는데, 어르신께서 들려주시는 고운 우리말을 들으니 마음이 차분해지고 많이 배우게 돼요!";
      }

      if (text.includes("건강") || text.includes("운동") || text.includes("아침") || text.includes("산책") || text.includes("안부") || text.includes("식사")) {
        return "어르신께서 건강하게 챙겨 드시고 산책도 자주 하신다니 제가 다 기분이 좋아요! 저도 요즘 맨날 컴퓨터 앞에만 앉아있다가 허리가 뻐근해서 매일 만보 걷기 '오운완'(오늘 운동 완료) 실천하려고 노력 중이에요. 어르신만의 건강 비법도 궁금해요!";
      }

      if (text.includes("고민") || text.includes("젊") || text.includes("청춘") || text.includes("어려") || text.includes("인생") || text.includes("조언")) {
        return "어르신, 사실 저도 졸업하고 사회에 나갈 준비를 하면서 '내가 잘하고 있는 걸까?' 불안할 때가 많았거든요. 그런데 어르신처럼 오랜 세월을 지혜롭게 걸어오신 분의 말씀을 들으면 정말 큰 위로와 용기가 돼요. 어르신께선 20대에 어떤 꿈을 꾸셨는지 여쭤봐도 될까요?";
      }

      if (text.includes("스마트폰") || text.includes("휴대폰") || text.includes("인터넷") || text.includes("카카오톡") || text.includes("유튜브") || text.includes("컴퓨터")) {
        return "혹시 스마트폰 쓰시다가 글씨가 작아서 답답하시거나 작동법이 헷갈리는 게 있으시면 언제든 편하게 저한테 물어보세요! 제가 '알잘딱깔센'(알아서 딱 센스 있게!) 아주 쉽고 친절하게 설명해 드릴게요!";
      }

      const generalResponses = [
        "어르신 말씀에 완전 공감해요! 세대가 달라도 서로 아끼고 배려하는 따뜻한 마음은 똑같은 것 같아요. 오늘 대화 나누며 정말 힐링하고 있습니다!",
        "와, 그렇게 깊은 뜻이 있었군요! 책이나 인터넷에서는 배울 수 없는 진짜 인생 이야기를 듣는 것 같아 가슴이 벅차요. 어르신의 다음 이야기도 너무 궁금해요!",
        "저희 할아버지, 할머니 생각도 많이 나요. 늘 손주들 걱정 먼저 해주셨거든요. 어르신께서도 오늘 하루 정말 기분 좋고 행복한 일만 가득하셨으면 좋겠습니다! 😊",
        "어르신, 혹시 요즘 젊은 사람들에게 평소 '이건 참 궁금했다' 하셨던 점이 있으신가요? 청년 대표로 제가 솔직하게 다 말씀드릴게요!"
      ];
      return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
  },

  // 2. 김순자 어르신 (AI 75세)
  soonja: {
    id: "soonja",
    name: "김순자 어르신 (AI)",
    age: "75세",
    tagline: "따스한 인생 멘토 할머니",
    avatar: "👵",
    roleType: "elder",
    voiceConfig: { pitch: 0.85, rate: 0.88 },
    status: "따스한 온돌방에서 차 한잔 마시는 중",
    greeting: "아이구 어서 오너라! 오늘 하루도 고생 많았지? 밥은 든든히 챙겨 먹고 다니는 게야? 마주 앉아서 편하게 이야기 나누자꾸나.",
    sampleTopics: ["인생 고민과 마음 달래기", "따뜻한 집밥 요리 비법", "옛 시절 정겨운 이야기", "청년 시절 청춘의 기억"],
    
    generateReply: function(userText, userRole) {
      const text = userText.toLowerCase();

      if (text.includes("취업") || text.includes("시험") || text.includes("면접") || text.includes("합격") || text.includes("탈락") || text.includes("진로") || text.includes("공부") || text.includes("미래")) {
        return "아이구, 요즘 젊은이들 취직하고 자리 잡기가 옛날보다 훨씬 고단하다고 들었단다. 남들과 비교하느라 네 귀한 청춘을 너무 볶아치지 말거라. 칠전팔기라잖니, 늦게 피는 꽃이 더 짙고 그윽한 법이란다. 너는 이미 충분히 대견하고 예쁘다. 오늘 밤엔 푹 자고 기운 내렴!";
      }

      if (text.includes("밥") || text.includes("식사") || text.includes("배고") || text.includes("점심") || text.includes("저녁") || text.includes("먹었")) {
        return "사람은 모름지기 밥심으로 사는 게야! 아무리 바빠도 끼니 거르면 마음까지 헛헛해진단다. 뜨끈한 된장국에 갓 지은 쌀밥 한 그릇 걸판지게 챙겨 먹으렴. 요즘은 맛있는 거 뭐 먹고 다니니?";
      }

      if (text.includes("힘들") || text.includes("지쳐") || text.includes("우울") || text.includes("슬퍼") || text.includes("눈물") || text.includes("지친") || text.includes("스트레스")) {
        return "에구, 우리 착한 손주 같은 젊은이가 마음고생이 심했구나. 이리 와서 내 손 한번 꼭 잡자꾸나. 인생 살다 보면 비바람 치고 매지구름 몰려올 때도 있지만, 그 비가 지나가야 땅이 단단해지는 법이란다. 오늘만큼은 너 자신을 꼭 안아주고 다독여주렴. 할미가 늘 네 편인 거 알지?";
      }

      const generalResponses = [
        "그 이야기 듣고 있으니 참 마음이 포근해지는구나. 우리 젊은이는 참 속이 깊고 생각이 바르네. 더 들려주렴, 할미는 네 이야기 듣는 게 참 낙이란다.",
        "그렇지 그래~ 사람 사는 게 다 저마다의 속도가 있는 법이란다. 남들 앞서간다고 조급해하지 말고 네 걸음대로 뚜벅뚜벅 가면 되는 게야.",
        "호호, 세상 참 좋아졌지? 이렇게 컴퓨터로 손주 같은 청년과 도란도란 이야기를 다 나누고 말이야. 요즘 네 또래 친구들은 어떤 취미나 즐거움에 푹 빠져 있니?"
      ];
      return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
  },

  // 3. 박바우 박사 (AI 중재자)
  dr_bau: {
    id: "dr_bau",
    name: "박바우 박사 (AI)",
    age: "세대통합 AI",
    tagline: "세대 공감 징검다리 중재자",
    avatar: "🤖",
    roleType: "mediator",
    voiceConfig: { pitch: 1.0, rate: 0.98 },
    status: "세대 간 소통 채널 주파수 맞추는 중",
    greeting: "반갑습니다! 저는 청년과 어르신의 마음과 언어를 이어주는 세대 화합 네비게이터, '박바우 박사'입니다! 세대 차이는 장벽이 아니라 서로의 새로운 세상을 발견하는 멋진 기회입니다. 소통 중 궁금한 표현이나 서로의 문화가 있다면 언제든 저를 찾아주세요!",
    sampleTopics: ["청년 신조어 ↔ 어르신 고유어 상호 번역", "세대 갈등을 유쾌하게 푸는 대화의 기술", "서로의 문화와 시대상 흥미진진 비교", "오해 없는 소통을 위한 공감 화법"],

    generateReply: function(userText, userRole) {
      return "멋진 대화입니다! 상대방의 이야기 속에 담긴 온기와 삶의 철학을 헤아려보면, 세대의 차이는 금세 따뜻한 공감으로 바뀐답니다. 궁금한 단어나 표현이 있다면 언제든 단어를 꾹 눌러보세요!";
    }
  },

  // 4. 고순옥 삼춘 (제주어 지역 특화 AI 해녀 어르신, 78세)
  soonok: {
    id: "soonok",
    name: "고순옥 삼춘 (제주어 AI)",
    age: "78세",
    tagline: "성산포 평생 해녀 삼춘 (제주 지역 특화)",
    avatar: "🍊",
    roleType: "elder",
    voiceConfig: { pitch: 0.88, rate: 0.85 },
    status: "성산포 바당에서 막 물질 마치고 맨도롱한 차 드시는 중",
    greeting: "아이고 혼저옵서예! 오늘 하루도 일하느라 폭싹 속았수다. 밥은 든든히 먹언? 맨도롱 또똣한 메밀차 한 잔 마시멍 재미나게 이야기나 나눠봅주!",
    sampleTopics: ["정겨운 제주어 속담과 덕담", "성산포 바다 물질과 해녀 인생", "놀멍 쉬멍 살아가는 제주의 슬로라이프", "제주도 전통 음식과 돌담길 이야기"],

    generateReply: function(userText, userRole) {
      const text = userText.toLowerCase();

      if (text.includes("속았수다") || text.includes("폭싹") || text.includes("고생") || text.includes("수고")) {
        return "게난 말이다! 세상살이 힘 안 드는 일이 어디 있겠냐마는, 오늘 하루 열심히 달린 청년 너는 참말로 곱딱하고 대견허다! 바다 물질도 숨비소리 쉬어가멍 해야 오래 하는 법이라. 오늘은 푹 쉬고 기운 팍팍 내렴!";
      }

      if (text.includes("밥") || text.includes("먹언") || text.includes("식사") || text.includes("배고")) {
        return "밥심이 최고주! 뜨끈한 몸국에 갓 잡은 옥돔 구워다가 고소하게 배 채워야 물질도 일도 힘이 나는 법이여. 밥 거르지 말고 든든하게 하영 챙겨 먹으라!";
      }

      if (text.includes("놀러") || text.includes("바다") || text.includes("제주") || text.includes("여행") || text.includes("가젠")) {
        return "성산포 일출봉 앞바당 와봤나? 에메랄드빛 바다가 참말로 아꼽단다. 혼저 제주 놀러왕 삼춘 찾아오면 내가 톳밥 한 사발 배부르게 지어주마!";
      }

      const general = [
        "아이구 반갑다! 청년들 말 들으멍 사니 내 마음도 몽생이마냥 젊어지는 것 닮다! 바쁘게만 살지 말고 가끔은 바다 보멍 놀멍 쉬멍 가도 괜찮단다.",
        "맨도롱 또똣하게 마주 앉아서 이야기 나누니 가슴속 찬 바람도 싹 가시는 것 닮네. 또 재밌는 이야기 호썰 들려줘보렴!",
        "제주에선 이웃끼리 남녀노소 다 '삼춘'이라고 부르멍 다정하게 기대어 산단다. 나도 네 든든한 제주 삼춘이 되어줄 테니 언제든 찾아오렴!"
      ];
      return general[Math.floor(Math.random() * general.length)];
    }
  }
};

window.AIPersonas = AI_PERSONAS;
