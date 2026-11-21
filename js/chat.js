/**
 * 채팅 및 방 코드 기반 실시간 세대 소통 관리자
 * (사용자 업로드 사진 UI 디자인 100% 반영)
 */

class ChatManager {
  constructor(app) {
    this.app = app;
    this.messages = [];
    this.currentChatTarget = 'room'; // 'room' (코드 대화방), 'minjun', 'soonja', 'dr_bau'
    this.currentRoomCode = '7788';
    this.broadcastChannel = null;

    this.initBroadcastChannel();
    this.loadHistory();
  }

  /**
   * 방 코드별 독립된 브라우저 탭 간 실시간 통신 (BroadcastChannel API)
   */
  initBroadcastChannel() {
    if (this.broadcastChannel) {
      try { this.broadcastChannel.close(); } catch (e) {}
    }

    try {
      // 코드가 같은 사람끼리만 통신하는 전용 채널
      const channelName = `generation_matched_room_${this.currentRoomCode}`;
      this.broadcastChannel = new BroadcastChannel(channelName);
      this.broadcastChannel.onmessage = (event) => {
        const data = event.data;
        // 코드가 일치하는 방의 메시지만 수신
        if (data && data.type === 'ROOM_CHAT_MSG' && data.roomCode === this.currentRoomCode) {
          this.receiveMessage(data.message, false);
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel 미지원 환경:", e);
    }
  }

  /**
   * 방 코드 설정 및 방 입장
   */
  setRoomCode(code) {
    this.currentRoomCode = code.trim().toUpperCase();
    this.currentChatTarget = 'room';
    this.initBroadcastChannel();
    this.loadHistory();
    this.renderMessages();
  }

  loadHistory() {
    const storageKey = this.currentChatTarget === 'room'
      ? `gen_history_code_${this.currentRoomCode}`
      : `gen_history_ai_${this.currentChatTarget}`;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        this.messages = JSON.parse(saved);
      } else {
        this.messages = [];
        this.insertInitialGreeting();
      }
    } catch (e) {
      this.messages = [];
      this.insertInitialGreeting();
    }
  }

  saveHistory() {
    const storageKey = this.currentChatTarget === 'room'
      ? `gen_history_code_${this.currentRoomCode}`
      : `gen_history_ai_${this.currentChatTarget}`;

    try {
      localStorage.setItem(storageKey, JSON.stringify(this.messages));
    } catch (e) {}
  }

  /**
   * 대화방 초기 인사말
   */
  insertInitialGreeting() {
    if (this.currentChatTarget === 'room') {
      this.messages.push({
        id: 'sys_' + Date.now(),
        sender: 'system',
        senderName: '방 연결 안내',
        senderRole: 'system',
        avatar: '🏷️',
        text: `대화방(코드: ${this.currentRoomCode})에 입장하셨습니다. 상대방에게도 방 코드 [${this.currentRoomCode}]를 알려주세요. 코드가 일치하는 사람끼리만 1:1로 실시간 대화가 연결됩니다!`,
        timestamp: this.formatTime(new Date())
      });
    } else if (window.AIPersonas && window.AIPersonas[this.currentChatTarget]) {
      const persona = window.AIPersonas[this.currentChatTarget];
      this.messages.push({
        id: 'ai_init_' + Date.now(),
        sender: persona.id,
        senderName: persona.name,
        senderRole: persona.roleType,
        avatar: persona.avatar,
        text: persona.greeting,
        timestamp: this.formatTime(new Date())
      });
    }
  }

  switchChatTarget(targetId) {
    this.currentChatTarget = targetId;
    this.loadHistory();
    this.renderMessages();
  }

  /**
   * 메시지 전송
   */
  sendMessage(text) {
    if (!text || text.trim() === '') return;

    const user = this.app.currentUser;
    const roleLabel = user.role === 'youth' ? '청년' : '어르신';
    const newMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      sender: user.id,
      senderName: `${user.name} (${roleLabel})`,
      senderRole: user.role,
      avatar: user.avatar,
      text: text.trim(),
      timestamp: this.formatTime(new Date())
    };

    this.messages.push(newMessage);
    this.saveHistory();
    this.renderMessages();

    // 1. 방 코드 모드: 동일한 코드를 가진 방에만 브로드캐스트
    if (this.currentChatTarget === 'room' && this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'ROOM_CHAT_MSG',
        roomCode: this.currentRoomCode,
        message: newMessage
      });
    }

    // 2. AI 모드: 해당 AI 답변 자동 생성
    if (this.currentChatTarget !== 'room' && window.AIPersonas && window.AIPersonas[this.currentChatTarget]) {
      this.triggerAIResponse(text.trim());
    }
  }

  receiveMessage(msg, save = true) {
    this.messages.push(msg);
    if (save) this.saveHistory();
    this.renderMessages();
  }

  triggerAIResponse(userText) {
    const persona = window.AIPersonas[this.currentChatTarget];
    if (!persona) return;

    this.showTypingIndicator(persona);

    const delay = 1000 + Math.random() * 800;
    setTimeout(() => {
      this.hideTypingIndicator();

      const replyText = persona.generateReply(userText, this.app.currentUser.role);
      const aiMessage = {
        id: 'ai_' + Date.now(),
        sender: persona.id,
        senderName: persona.name,
        senderRole: persona.roleType,
        avatar: persona.avatar,
        text: replyText,
        timestamp: this.formatTime(new Date())
      };

      this.messages.push(aiMessage);
      this.saveHistory();
      this.renderMessages();
    }, delay);
  }

  showTypingIndicator(persona) {
    const container = document.getElementById('chatMessagesContainer');
    if (!container) return;

    const existing = document.getElementById('aiTypingIndicator');
    if (existing) existing.remove();

    const indicator = document.createElement('div');
    indicator.id = 'aiTypingIndicator';
    indicator.className = 'mb-6 max-w-3xl';
    indicator.innerHTML = `
      <div class="text-xs font-bold text-slate-500 mb-1.5 pl-1">${persona.name}</div>
      <div class="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm text-slate-500 text-sm flex items-center gap-2 w-fit">
        <span>말씀 생각 중...</span>
        <span class="inline-flex gap-1">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style="animation-delay: 0.15s"></span>
          <span class="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style="animation-delay: 0.3s"></span>
        </span>
      </div>
    `;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
  }

  hideTypingIndicator() {
    const existing = document.getElementById('aiTypingIndicator');
    if (existing) existing.remove();
  }

  /**
   * 메시지 렌더링
   * (사용자 사진 속의 레이아웃 완벽 구현!)
   */
  renderMessages() {
    const container = document.getElementById('chatMessagesContainer');
    if (!container) return;

    container.innerHTML = '';
    const myId = this.app.currentUser.id;

    this.messages.forEach(msg => {
      const isSystem = msg.sender === 'system';

      if (isSystem) {
        const sysDiv = document.createElement('div');
        sysDiv.className = 'flex justify-center my-4';
        sysDiv.innerHTML = `
          <div class="bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl px-5 py-3 max-w-xl text-center text-sm shadow-xs leading-relaxed font-medium">
            <span>📢 ${msg.text}</span>
          </div>
        `;
        container.appendChild(sysDiv);
        return;
      }

      const isMe = msg.sender === myId;
      // 사진과 동일한 단어 하이라이트 (중꺾마 🔍 등)
      const highlightedText = window.GenerationDictionary ? window.GenerationDictionary.highlight(this.escapeHtml(msg.text)) : this.escapeHtml(msg.text);

      const msgCard = document.createElement('div');

      if (isMe) {
        // ================= 카카오톡 스타일: 내가 보낸 메시지 (오른쪽 정렬) =================
        msgCard.className = 'flex justify-end mb-6';
        msgCard.innerHTML = `
          <div class="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
            
            <!-- 시간 표시 (말풍선 왼쪽 아래) -->
            <div class="text-[11px] text-slate-400 whitespace-nowrap mb-1">
              ${msg.timestamp}
            </div>

            <!-- 내 말풍선 (카카오톡 느낌의 화사한 옐로우/앰버 카드) -->
            <div class="bg-[#fee500] border border-[#f2d800] text-slate-900 rounded-3xl rounded-tr-none p-4 md:p-5 shadow-sm">
              <!-- 메시지 내용 (단어 누르면 뜻 풀이) -->
              <div class="text-base md:text-lg font-medium leading-relaxed">
                ${highlightedText}
              </div>

              <!-- 하단 바: 읽어주기 -->
              <div class="flex items-center justify-end mt-2 pt-2 border-t border-amber-300/40 text-xs">
                <button type="button" class="speak-btn px-2.5 py-1 rounded-xl text-amber-950 hover:bg-amber-400/40 font-bold flex items-center gap-1 transition-all cursor-pointer" data-text="${this.escapeAttr(msg.text)}" data-role="${msg.senderRole}" title="이 메시지를 음성으로 듣기">
                  <span>📢</span>
                  <span>읽어주기</span>
                </button>
              </div>
            </div>

          </div>
        `;
      } else {
        // ================= 카카오톡 스타일: 상대방/AI가 보낸 메시지 (왼쪽 정렬 - 사진 속 디자인 완벽 일치) =================
        msgCard.className = 'flex justify-start mb-6';
        msgCard.innerHTML = `
          <div class="max-w-[90%] md:max-w-[75%]">
            
            <!-- 상단 발신자 이름 (사진: 박민준 청년 (AI)) -->
            <div class="text-xs md:text-sm font-bold text-slate-500 mb-1.5 pl-1 flex items-center gap-1.5">
              <span>${msg.senderName}</span>
            </div>

            <div class="flex items-end gap-2">
              <!-- 메인 말풍선 카드 (사진 속 흰색 라운드 박스) -->
              <div class="bg-white border border-slate-200 rounded-3xl rounded-tl-none p-5 md:p-6 shadow-sm flex-1">
                
                <!-- 본문 메시지 텍스트 (단어 누르면 뜻 풀이) -->
                <div class="text-slate-800 text-lg md:text-xl font-normal leading-relaxed md:leading-loose">
                  ${highlightedText}
                </div>

                <!-- 하단 유틸 바: [✨ AI 문장 맥락 통역] & [📢 읽어주기] (사진 그대로 구현) -->
                <div class="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs md:text-sm">
                  
                  <!-- 좌측: AI 문장 맥락 통역 버튼 -->
                  <button type="button" class="translate-btn px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs" data-text="${this.escapeAttr(msg.text)}" data-role="${msg.senderRole}">
                    <span>✨ AI 문장 맥락 통역</span>
                  </button>

                  <!-- 우측: 누르면 읽어주는 버튼 (사진: 📢 읽어주기) -->
                  <button type="button" class="speak-btn px-3 py-1.5 rounded-xl text-slate-600 hover:text-indigo-700 hover:bg-slate-100 font-semibold flex items-center gap-1.5 transition-all cursor-pointer" data-text="${this.escapeAttr(msg.text)}" data-role="${msg.senderRole}" title="이 메시지를 음성으로 듣기">
                    <span class="text-base">📢</span>
                    <span>읽어주기</span>
                  </button>

                </div>

                <!-- 통역 펼침 영역 -->
                <div class="translate-result-box hidden mt-3 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-sm text-indigo-900 leading-relaxed font-medium"></div>

              </div>

              <!-- 하단 타임스탬프 (사진: 14:31) -->
              <div class="text-[11px] text-slate-400 whitespace-nowrap mb-1">
                ${msg.timestamp}
              </div>
            </div>

          </div>
        `;
      }

      container.appendChild(msgCard);
    });

    container.scrollTop = container.scrollHeight;

    // 1. 단어 클릭 이벤트 (사진 속 단어 누르면 뜻 팝업)
    container.querySelectorAll('.dict-word-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const word = btn.getAttribute('data-word');
        this.app.openWordModal(word);
      });
    });

    // 2. 📢 읽어주기 버튼 이벤트
    container.querySelectorAll('.speak-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        const role = btn.getAttribute('data-role');
        
        btn.classList.add('text-indigo-600', 'font-black');
        setTimeout(() => btn.classList.remove('text-indigo-600', 'font-black'), 1000);

        this.app.speechManager.speak(text, { role: role });
      });
    });

    // 3. ✨ AI 문장 맥락 통역 버튼 이벤트 (Gemini API + 로컬 사전 하이브리드)
    container.querySelectorAll('.translate-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const card = btn.closest('.bg-white') || btn.closest('.chat-bubble') || btn.parentElement;
        const resultBox = card.querySelector('.translate-result-box');
        if (!resultBox) return;

        if (!resultBox.classList.contains('hidden')) {
          resultBox.classList.add('hidden');
          return;
        }

        const rawText = btn.getAttribute('data-text') || '';
        const role = btn.getAttribute('data-role') || '';

        // 로딩 상태 표시
        resultBox.innerHTML = `
          <div class="flex items-center gap-2 text-indigo-700 font-bold text-xs py-1">
            <svg class="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>구글 Gemini AI가 세대 맥락과 속뜻을 분석 중입니다...</span>
          </div>
        `;
        resultBox.classList.remove('hidden');

        const targetLabel = (role === 'youth') ? "어르신 눈높이 쉬운 통역" : "청년 눈높이 쉬운 통역";

        // Gemini AI 통역 시도
        try {
          const apiKey = ((localStorage.getItem('gemini_api_key') || '').trim()) || "AQ.Ab8RN6K2-As_sbIa7FmlDELNkr_CbysgIASZ5VfBJKtjGnHp6w";
          const prompt = `당신은 청년과 노인의 세대 소통을 돕는 '다정다감 AI 세대 맥락 통역사'입니다.
특히 제주도 지역 방언(제주어, 삼춘들의 구어체, ~젠? ~언? ~수과? 등)과 청년 줄임말/신조어(버정, 긔?, 스벅, 피방, 중꺾마 등)를 완벽히 꿰뚫고 있습니다.
다음 문장을 상대방 세대가 오해 없이 편안하고 다정하게 받아들일 수 있도록 쉬운 우리말 문장과 진짜 속뜻을 풀어주세요.
문장: "${rawText}"
대상: ${targetLabel}

반드시 마크다운 백틱 없이 순수 JSON만 출력하세요:
{
  "translated": "상대방 세대가 이해하기 쉬운 자연스러운 우리말 완성형 문장",
  "summary": "이 말에 담긴 속뜻, 뉘앙스, 진짜 의도에 대한 따뜻한 해설 (1~2문장)"
}`;

          const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-flash-lite-latest", "gemini-flash-latest"];
          let apiResText = null;

          for (const m of candidateModels) {
            try {
              const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
              const resp = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: { temperature: 0.2, maxOutputTokens: 600, responseMimeType: "application/json" }
                })
              });
              if (resp.ok) {
                const j = await resp.json();
                apiResText = j.candidates?.[0]?.content?.parts?.[0]?.text;
                if (apiResText) break;
              }
            } catch (err) {}
          }

          if (apiResText) {
            let clean = apiResText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const m = clean.match(/\{[\s\S]*\}/);
            if (m) clean = m[0];
            const parsed = JSON.parse(clean);

            resultBox.innerHTML = `
              <div class="flex items-center gap-1.5 font-bold mb-1 text-indigo-800 text-xs">
                <span>✨ 구글 Gemini AI ${targetLabel}:</span>
              </div>
              <div class="text-slate-800 font-bold text-sm mb-1">"${parsed.translated}"</div>
              <div class="text-xs text-indigo-700 bg-indigo-50/80 p-2 rounded-lg border border-indigo-100 mt-1">
                💡 <strong>속뜻/의도:</strong> ${parsed.summary}
              </div>
            `;
            return;
          }
        } catch (e) {
          console.warn("Gemini API 통역 실패, 로컬 사전으로 변환:", e);
        }

        // 로컬 정밀 통역 엔진 (Gemini 실패 시에도 '버정 긔?' -> '버스정류장 갈래?' 완벽 지원)
        const localTranslated = this.translateContext(rawText, role);
        resultBox.innerHTML = `
          <div class="flex items-center gap-1.5 font-bold mb-1 text-indigo-800 text-xs">
            <span>✨ AI 세대 맞춤 통역:</span>
          </div>
          <div>${localTranslated}</div>
        `;
      });
    });
  }

  /**
   * 문장 맥락 통역기 (청년 말 <-> 어르신 말 변환 + 제주어 특화)
   */
  translateContext(text, role) {
    let raw = (text || '').trim();
    let translated = raw;
    let summary = "";

    const replacements = [
      { reg: /놀러가젠\?/gi, to: "놀러 갈까요?", explain: "'놀러 가자'고 제안하는 친근한 구어체 표현" },
      { reg: /놀러가젠/gi, to: "놀러 가자", explain: "'놀러 가자'의 친근한 줄임 표현" },
      { reg: /버정\s*긔\?/gi, to: "버스정류장에 가실래요?", explain: "'버스정류장에 가자/갈래?'라는 줄임말 질문" },
      { reg: /버정\s*긔/gi, to: "버스정류장 가자", explain: "버스정류장에 가자는 뜻" },
      { reg: /버정/gi, to: "버스정류장", explain: "버스정류장의 줄임말" },
      { reg: /스벅\s*긔\?/gi, to: "스타벅스 카페에 갈까요?", explain: "스타벅스 카페에 가자는 질문" },
      { reg: /스벅/gi, to: "스타벅스 카페", explain: "스타벅스 커피점의 줄임말" },
      { reg: /카공/gi, to: "카페에서 공부하기", explain: "카페에서 공부한다는 줄임말" },
      { reg: /피방/gi, to: "PC방(컴퓨터 게임방)", explain: "PC방의 줄임말" },
      { reg: /노방/gi, to: "노래방", explain: "노래방의 줄임말" },
      { reg: /편점/gi, to: "편의점", explain: "편의점의 줄임말" },
      { reg: /맥날/gi, to: "맥도날드", explain: "맥도날드 햄버거점의 줄임말" },
      { reg: /배라|베라/gi, to: "배스킨라빈스 아이스크림", explain: "배스킨라빈스 아이스크림 가게의 줄임말" },
      { reg: /치맥/gi, to: "치킨과 맥주", explain: "치킨과 맥주의 줄임말" },
      { reg: /([가-힣]+)가젠\?/gi, to: "$1 가자고?", explain: "'가자'는 제안을 묻는 구어체" },
      { reg: /([가-힣]+)먹젠\?/gi, to: "$1 먹자고?", explain: "'먹자'는 제안을 묻는 구어체" },
      { reg: /([가-힣]+)하젠\?/gi, to: "$1 하자고?", explain: "'하자'는 제안을 묻는 구어체" },
      { reg: /([가-힣]+)\s*긔\?/gi, to: "$1에 가실래요?", explain: "'~갈래? / 가실래요?'라는 뜻의 인터넷 줄임말" },
      { reg: /([가-힣]+)\s*ㄱ\?/gi, to: "$1에 갈까요?", explain: "'Go(가자)'를 초성으로 묻는 질문" },
      { reg: /중꺾마/gi, to: "포기하지 않는 굳센 마음", explain: "중요한 것은 꺾이지 않는 마음" },
      { reg: /럭키비키/gi, to: "모든 것을 긍정적으로 보는 마음", explain: "어떤 상황도 복으로 여기는 긍정적 사고" },
      { reg: /알잘딱깔센/gi, to: "알아서 눈치 빠르고 야무지게", explain: "알아서 잘 딱 깔끔하고 센스있게" },
      { reg: /갓생/gi, to: "부지런하고 성실한 삶", explain: "성실하고 모범적으로 사는 삶" },
      { reg: /오운완/gi, to: "오늘의 운동 완료", explain: "오늘 목표한 운동을 마침" },
      { reg: /혼저옵서예|혼저옵서/gi, to: "어서 오세요(반갑게 환영합니다)", explain: "제주도 대표 환영 인사말" },
      { reg: /폭싹\s*속았수다|속았수다/gi, to: "정말 대단히 수고 많으셨습니다", explain: "고생 많으셨습니다라는 뜻의 제주 덕담" },
      { reg: /밥은?\s*먹언\?/gi, to: "식사는 하셨나요(밥 먹었니)?", explain: "끼니를 챙겨 묻는 정겨운 제주의 안부 인사" },
      { reg: /맨도롱\s*또똣|멘도롱\s*또똣/gi, to: "기분 좋게 따뜻하고 알맞은", explain: "따뜻하고 훈훈하다는 뜻의 제주어" },
      { reg: /지꺼지게/gi, to: "기쁘고 즐겁게", explain: "기쁘고 신명난다는 뜻의 제주어" },
      { reg: /호썰만?\s*기둘립서/gi, to: "조금만 기다려 주세요", explain: "잠시만 기다려 달라는 정중한 제주어 표현" }
    ];

    replacements.forEach(item => {
      translated = translated.replace(item.reg, item.to);
    });

    const lower = raw.toLowerCase();
    if (lower.includes("버정") || lower.includes("버스정류장")) {
      summary = "버스정류장으로 함께 가자는 의미예요.";
    } else if (lower.includes("놀러") || lower.includes("가젠") || lower.includes("놀자")) {
      summary = "오늘 함께 밖으로 놀러 가자는 제안의 의미예요.";
    } else if (lower.includes("속았수다") || lower.includes("폭싹")) {
      summary = "상대방의 노고에 감사하며 '정말 고생 많으셨습니다'라고 깊이 위로하는 제주의 덕담이에요.";
    } else if (lower.includes("혼저옵서")) {
      summary = "상대방을 두 팔 벌려 반갑게 맞이하는 제주의 따뜻한 환영 의미예요.";
    } else if (lower.includes("또똣") || lower.includes("맨도롱")) {
      summary = "온기 가득하고 편안한 마음을 나누자는 훈훈한 의미예요.";
    } else if (lower.includes("스벅") || lower.includes("카페")) {
      summary = "카페에 함께 가서 차를 마시며 대화하자는 의미예요.";
    } else if (lower.includes("피방") || lower.includes("노방")) {
      summary = "함께 여가나 오락을 즐기러 가자는 의미예요.";
    } else if (raw.includes("?")) {
      summary = "상대방의 생각이나 일정을 친근하게 묻는 질문의 의미예요.";
    } else {
      summary = "서로의 세대 경험과 마음을 진솔하게 나누며 공감하려는 따뜻한 이야기예요.";
    }

    const title = (role === 'youth') ? "어르신 맞춤 해설" : "청년 맞춤 해설";
    return `<strong>[${title}]:</strong> "${translated}"<br><span class="text-xs text-indigo-700 mt-1 block">💡 <strong>속뜻:</strong> ${summary}</span>`;
  }

  clearChat() {
    if (confirm("현재 대화방의 대화 내용을 모두 지우시겠습니까?")) {
      this.messages = [];
      this.insertInitialGreeting();
      this.saveHistory();
      this.renderMessages();
    }
  }

  formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const strHours = hours < 10 ? '0' + hours : hours;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${strHours}:${strMinutes}`;
  }

  escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  escapeAttr(text) {
    if (!text) return '';
    return text.replace(/"/g, '&quot;');
  }
}

window.ChatManager = ChatManager;
