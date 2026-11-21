/**
 * 메인 애플리케이션 제어 스크립트 (방 코드 & 음성지원 최적화)
 */

class GenerationApp {
  constructor() {
    this.currentUser = null;
    this.currentRoomCode = '7788';
    this.elderMode = false;
    
    this.speechManager = new SpeechManager();
    this.chatManager = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initSpeechCallbacks();
    this.checkSavedSession();
  }

  /**
   * 이벤트 리스너 등록
   */
  bindEvents() {
    // 1. 역할 선택 버튼 (청년 / 어르신)
    const selectYouthBtn = document.getElementById('selectYouthBtn');
    const selectElderBtn = document.getElementById('selectElderBtn');
    if (selectYouthBtn && selectElderBtn) {
      selectYouthBtn.addEventListener('click', () => this.setRoleSelection('youth'));
      selectElderBtn.addEventListener('click', () => this.setRoleSelection('elder'));
    }

    // 2. 새 방 코드 랜덤 생성 버튼
    const generateCodeBtn = document.getElementById('generateRandomCodeBtn');
    const roomCodeInput = document.getElementById('inputRoomCode');
    if (generateCodeBtn && roomCodeInput) {
      generateCodeBtn.addEventListener('click', () => {
        const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
        roomCodeInput.value = randomCode;
        roomCodeInput.classList.add('ring-2', 'ring-indigo-500');
        setTimeout(() => roomCodeInput.classList.remove('ring-2', 'ring-indigo-500'), 500);
      });
    }

    // 3. 로그인 폼 제출
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // 4. 헤더 방 코드 복사
    const headerRoomBadge = document.getElementById('headerRoomBadge');
    if (headerRoomBadge) {
      headerRoomBadge.addEventListener('click', () => {
        navigator.clipboard.writeText(this.currentRoomCode).then(() => {
          alert(`방 코드 [${this.currentRoomCode}]가 복사되었습니다!\n상대방에게 전달해주세요.`);
        }).catch(() => {
          prompt("아래 방 코드를 복사하여 상대방에게 알려주세요:", this.currentRoomCode);
        });
      });
    }

    // 5. 방 변경 버튼
    const changeRoomBtn = document.getElementById('changeRoomBtn');
    if (changeRoomBtn) {
      changeRoomBtn.addEventListener('click', () => {
        const newCode = prompt("참여할 대화방 코드를 입력하세요 (예: 7788):", this.currentRoomCode);
        if (newCode && newCode.trim() !== '') {
          this.currentRoomCode = newCode.trim().toUpperCase();
          localStorage.setItem('gen_room_code', this.currentRoomCode);
          this.updateRoomCodeUI();
          if (this.chatManager) {
            this.chatManager.setRoomCode(this.currentRoomCode);
          }
        }
      });
    }

    // 6. 로그아웃 버튼
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // 7. 어르신 큰 글씨 모드 토글 버튼
    const toggleElderModeBtn = document.getElementById('toggleElderModeBtn');
    if (toggleElderModeBtn) {
      toggleElderModeBtn.addEventListener('click', () => this.toggleElderMode());
    }

    // 8. 대화 상대 탭 클릭 (1:1 방 / 김순자 / 이민준 / 박바우)
    const partnerTabs = document.querySelectorAll('.partner-tab');
    partnerTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        partnerTabs.forEach(t => t.classList.remove('active', 'border-indigo-600', 'text-indigo-600', 'bg-indigo-50/70'));
        tab.classList.add('active', 'border-indigo-600', 'text-indigo-600', 'bg-indigo-50/70');
        
        const targetId = tab.getAttribute('data-target');
        if (this.chatManager) {
          this.chatManager.switchChatTarget(targetId);
          this.updateChatHeaderInfo(targetId);
        }
      });
    });

    // 9. 메시지 전송 폼
    const chatInputForm = document.getElementById('chatInputForm');
    const chatTextInput = document.getElementById('chatTextInput');
    if (chatInputForm && chatTextInput) {
      chatInputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatTextInput.value.trim();
        if (text && this.chatManager) {
          this.chatManager.sendMessage(text);
          chatTextInput.value = '';
          chatTextInput.focus();
        }
      });

      chatTextInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          chatInputForm.dispatchEvent(new Event('submit'));
        }
      });
    }

    // 10. 마이크 음성 입력 버튼 (STT)
    const micRecordBtn = document.getElementById('micRecordBtn');
    if (micRecordBtn) {
      micRecordBtn.addEventListener('click', () => {
        this.speechManager.toggleRecording();
      });
    }

    // 11. 단어 사전 모달 닫기
    const closeWordModalBtn = document.getElementById('closeWordModalBtn');
    const wordModalBackdrop = document.getElementById('wordModalBackdrop');
    if (closeWordModalBtn) {
      closeWordModalBtn.addEventListener('click', () => this.closeWordModal());
    }
    if (wordModalBackdrop) {
      wordModalBackdrop.addEventListener('click', () => this.closeWordModal());
    }

    // 12. 단어 사전 검색
    const dictSearchInput = document.getElementById('dictSearchInput');
    const dictSearchBtn = document.getElementById('dictSearchBtn');
    if (dictSearchBtn && dictSearchInput) {
      const doSearch = () => {
        const query = dictSearchInput.value.trim();
        if (query) {
          this.openWordModal(query);
          dictSearchInput.value = '';
        }
      };
      dictSearchBtn.addEventListener('click', doSearch);
      dictSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSearch();
      });
    }

    // 13. 대화 지우기 버튼
    const clearChatBtn = document.getElementById('clearChatBtn');
    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', () => {
        if (this.chatManager) this.chatManager.clearChat();
      });
    }
  }

  /**
   * 음성 인식 콜백 등록 (음성으로 채팅 쓰기 지원)
   */
  initSpeechCallbacks() {
    const micBtn = document.getElementById('micRecordBtn');
    const micLabel = document.getElementById('micButtonLabel');
    const micStatus = document.getElementById('micStatusText');
    const chatInput = document.getElementById('chatTextInput');

    this.speechManager.onRecordingStateChange = (isRecording, message) => {
      if (micBtn) {
        if (isRecording) {
          micBtn.classList.add('mic-active', 'bg-red-500', 'text-white', 'border-red-600');
          micBtn.classList.remove('bg-indigo-50', 'text-indigo-700', 'border-indigo-200');
          if (micLabel) micLabel.textContent = '말씀하세요...';
        } else {
          micBtn.classList.remove('mic-active', 'bg-red-500', 'text-white', 'border-red-600');
          micBtn.classList.add('bg-indigo-50', 'text-indigo-700', 'border-indigo-200');
          if (micLabel) micLabel.textContent = '말로 쓰기';
        }
      }
      if (micStatus) {
        micStatus.style.display = isRecording ? 'block' : 'none';
      }
    };

    this.speechManager.onSpeechResult = (transcript, isFinal) => {
      if (chatInput) {
        chatInput.value = transcript;
        chatInput.scrollTop = chatInput.scrollHeight;

        // 음성으로 "전송" 또는 "보내기"라고 말하면 자동 전송
        const trimmed = transcript.trim();
        if (isFinal && (trimmed.endsWith('전송') || trimmed.endsWith('보내기') || trimmed === '전송' || trimmed === '보내기')) {
          const sendText = trimmed.replace(/(전송|보내기)$/, '').trim();
          if (sendText && this.chatManager) {
            this.chatManager.sendMessage(sendText);
            chatInput.value = '';
          }
        }
      }
    };
  }

  /**
   * 역할 선택 시 UI 토글
   */
  setRoleSelection(role) {
    const youthBtn = document.getElementById('selectYouthBtn');
    const elderBtn = document.getElementById('selectElderBtn');
    const nameInput = document.getElementById('loginNickname');
    const roleInput = document.getElementById('loginRoleInput');

    roleInput.value = role;

    if (role === 'youth') {
      youthBtn.classList.add('border-indigo-600', 'bg-indigo-50', 'ring-2', 'ring-indigo-500');
      elderBtn.classList.remove('border-amber-600', 'bg-amber-50', 'ring-2', 'ring-amber-500');
      if (!nameInput.value || nameInput.value.includes('어르신')) {
        nameInput.value = '열정 청년';
      }
    } else {
      elderBtn.classList.add('border-amber-600', 'bg-amber-50', 'ring-2', 'ring-amber-500');
      youthBtn.classList.remove('border-indigo-600', 'bg-indigo-50', 'ring-2', 'ring-indigo-500');
      if (!nameInput.value || nameInput.value.includes('청년')) {
        nameInput.value = '지혜로운 어르신';
      }
    }
  }

  /**
   * 로그인 및 방 입장 처리
   */
  handleLogin() {
    const role = document.getElementById('loginRoleInput').value;
    const nickname = document.getElementById('loginNickname').value.trim() || (role === 'youth' ? '푸른 청년' : '인자한 어르신');
    const roomCode = document.getElementById('inputRoomCode').value.trim().toUpperCase() || '7788';
    const avatar = role === 'youth' ? '🧑' : '👵';

    this.currentUser = {
      id: 'usr_' + Date.now(),
      name: nickname,
      role: role,
      avatar: avatar
    };
    this.currentRoomCode = roomCode;

    localStorage.setItem('gen_current_user', JSON.stringify(this.currentUser));
    localStorage.setItem('gen_room_code', this.currentRoomCode);

    if (role === 'elder') {
      this.elderMode = true;
      document.body.classList.add('elder-mode-active');
    }

    this.showChatScreen();
  }

  /**
   * 시작 시 항상 홈 화면(역할 선택 & 코드 입력창)을 먼저 표시
   */
  checkSavedSession() {
    // 기존 자동 직행 로직을 제거하고 항상 홈(로그인/코드입력) 화면으로 시작
    const saved = localStorage.getItem('gen_current_user');
    const savedRoom = localStorage.getItem('gen_room_code');

    if (savedRoom) {
      this.currentRoomCode = savedRoom;
      const roomInput = document.getElementById('inputRoomCode');
      if (roomInput) roomInput.value = savedRoom;
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name) {
          const nickInput = document.getElementById('loginNickname');
          if (nickInput) nickInput.value = parsed.name;
        }
        if (parsed.role) {
          this.setRoleSelection(parsed.role);
        }
      } catch (e) {}
    }

    // 언제 접속하든 항상 첫 화면(홈)이 먼저 뜨도록 보장
    this.showLoginScreen();
  }

  showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('chatScreen').classList.add('hidden');
    this.setRoleSelection('youth');
  }

  showChatScreen() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('chatScreen').classList.remove('hidden');

    const userBadge = document.getElementById('currentUserBadge');
    if (userBadge) {
      const isElder = this.currentUser.role === 'elder';
      userBadge.innerHTML = `
        <span class="text-base">${this.currentUser.avatar}</span>
        <span class="font-bold ${isElder ? 'text-amber-800' : 'text-indigo-800'}">${this.currentUser.name}</span>
        <span class="text-[11px] px-2 py-0.2 rounded-full ${isElder ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'}">
          ${isElder ? '어르신' : '청년'}
        </span>
      `;
    }

    this.updateRoomCodeUI();

    if (!this.chatManager) {
      this.chatManager = new ChatManager(this);
    }
    this.chatManager.setRoomCode(this.currentRoomCode);
    this.updateChatHeaderInfo('room');
    this.renderPopularWordChips();
  }

  updateRoomCodeUI() {
    const displayEl = document.getElementById('displayHeaderRoomCode');
    const tabTitleEl = document.getElementById('partnerTabRoomTitle');
    if (displayEl) displayEl.textContent = this.currentRoomCode;
    if (tabTitleEl) tabTitleEl.textContent = `1:1 연결 대화방 [${this.currentRoomCode}]`;
  }

  handleLogout() {
    if (confirm("대화방에서 나가시겠습니까?")) {
      localStorage.removeItem('gen_current_user');
      this.currentUser = null;
      this.showLoginScreen();
    }
  }

  /**
   * 큰 글씨 모드 토글
   */
  toggleElderMode() {
    this.elderMode = !this.elderMode;
    if (this.elderMode) {
      document.body.classList.add('elder-mode-active');
    } else {
      document.body.classList.remove('elder-mode-active');
    }

    const btn = document.getElementById('toggleElderModeBtn');
    if (btn) {
      btn.innerHTML = this.elderMode ? '👓 보통 글씨' : '🔍 어르신 큰글씨';
    }
  }

  /**
   * 대화 상대 헤더 정보 업데이트
   */
  updateChatHeaderInfo(targetId) {
    const avatarEl = document.getElementById('chatPartnerAvatar');
    const nameEl = document.getElementById('chatPartnerName');
    const descEl = document.getElementById('chatPartnerDesc');

    if (targetId === 'room') {
      avatarEl.textContent = '💬';
      nameEl.textContent = `1:1 연결 대화방 [코드: ${this.currentRoomCode}]`;
      descEl.textContent = `• 상대방에게 방 코드 [${this.currentRoomCode}]를 알려주시면 이 방에서 둘이 이야기할 수 있습니다.`;
    } else if (window.AIPersonas && window.AIPersonas[targetId]) {
      const p = window.AIPersonas[targetId];
      avatarEl.textContent = p.avatar;
      nameEl.textContent = `${p.name} (${p.age})`;
      descEl.textContent = `${p.tagline} • ${p.status}`;
    }
  }

  /**
   * 인기 단어 칩 렌더링
   */
  renderPopularWordChips() {
    const youthContainer = document.getElementById('popularYouthWords');
    const elderContainer = document.getElementById('popularElderWords');

    if (youthContainer && window.GenerationDictionary) {
      youthContainer.innerHTML = '';
      window.GenerationDictionary.data.youth.slice(0, 8).forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer font-medium';
        btn.textContent = '#' + item.word;
        btn.addEventListener('click', () => this.openWordModal(item.word));
        youthContainer.appendChild(btn);
      });
    }

    if (elderContainer && window.GenerationDictionary) {
      elderContainer.innerHTML = '';
      window.GenerationDictionary.data.elder.slice(0, 8).forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer font-medium';
        btn.textContent = '#' + item.word;
        btn.addEventListener('click', () => this.openWordModal(item.word));
        elderContainer.appendChild(btn);
      });
    }
  }

  /**
   * 단어 뜻 모달 열기
   */
  openWordModal(word) {
    const modal = document.getElementById('wordDetailModal');
    if (!modal) return;

    const wordInfo = window.GenerationDictionary ? window.GenerationDictionary.analyze(word) : { word: word, meaning: '해당 단어 정보를 불러오는 중입니다.' };

    document.getElementById('modalWordTitle').textContent = wordInfo.word;
    document.getElementById('modalWordOrigin').textContent = wordInfo.origin || '세대 어휘';
    document.getElementById('modalWordMeaning').textContent = wordInfo.meaning || wordInfo.easyExplain;
    document.getElementById('modalWordEasyExplain').textContent = wordInfo.easyExplain || wordInfo.meaning;
    document.getElementById('modalWordExample').textContent = wordInfo.example || `예문: "${wordInfo.word}의 뜻을 알고 나니 대화가 한결 편안해졌어요!"`;

    const eqDiv = document.getElementById('modalWordEquivalent');
    if (eqDiv) {
      const eqText = wordInfo.elderEquivalent || wordInfo.youthEquivalent || "쉬운 표현으로 바꿔 말하기";
      eqDiv.textContent = eqText;
    }

    const speakBtn = document.getElementById('modalSpeakWordBtn');
    if (speakBtn) {
      speakBtn.onclick = () => {
        const speakText = `${wordInfo.word}. 뜻은, ${wordInfo.easyExplain}`;
        this.speechManager.speak(speakText);
      };
    }

    modal.classList.remove('hidden');
    modal.querySelector('.modal-content-box').classList.add('modal-enter');
  }

  closeWordModal() {
    const modal = document.getElementById('wordDetailModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new GenerationApp();
});
