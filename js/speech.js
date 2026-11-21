/**
 * 음성 입출력 매니저 (STT: 음성인식 / TTS: 음성합성)
 * Web Speech API 기반 완벽 지원
 */

class SpeechManager {
  constructor() {
    this.isRecording = false;
    this.autoReadEnabled = false;
    this.recognition = null;
    this.synth = window.speechSynthesis;
    this.koreanVoices = [];
    
    this.initSTT();
    this.initTTS();
  }

  /**
   * 음성 인식 (STT) 초기화
   */
  initSTT() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("현재 브라우저는 Web Speech API 음성 인식을 지원하지 않습니다. (Chrome, Edge 등 Chromium 브라우저 권장)");
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'ko-KR';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.isRecording = true;
        if (this.onRecordingStateChange) {
          this.onRecordingStateChange(true, "듣고 있어요... 편하게 말씀하세요!");
        }
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        if (this.onSpeechResult) {
          this.onSpeechResult(currentText, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event) => {
        console.error("음성 인식 오류:", event.error);
        this.isRecording = false;
        if (this.onRecordingStateChange) {
          let errorMsg = "음성 인식 중 오류가 발생했습니다.";
          if (event.error === 'not-allowed') {
            errorMsg = "마이크 사용 권한이 차단되어 있습니다. 브라우저 주소창 좌측 자물쇠 아이콘에서 마이크를 허용해주세요.";
          } else if (event.error === 'no-speech') {
            errorMsg = "목소리가 들리지 않았습니다. 마이크를 확인하고 다시 말씀해주세요.";
          }
          this.onRecordingStateChange(false, errorMsg);
        }
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        if (this.onRecordingStateChange) {
          this.onRecordingStateChange(false, "음성 인식이 완료되었습니다.");
        }
      };
    } catch (e) {
      console.error("STT 초기화 실패:", e);
    }
  }

  /**
   * 음성 합성 (TTS) 보이스 로드
   */
  initTTS() {
    if (!this.synth) return;

    const loadVoices = () => {
      const voices = this.synth.getVoices();
      this.koreanVoices = voices.filter(v => v.lang.startsWith('ko') || v.lang.includes('KR'));
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  /**
   * 마이크 녹음 토글
   */
  toggleRecording() {
    if (!this.recognition) {
      alert("현재 브라우저는 마이크 음성 인식을 지원하지 않습니다. 구글 크롬(Chrome)이나 엣지(Edge) 브라우저를 이용해주세요!");
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
    } else {
      try {
        this.synth.cancel(); // 말하고 있던 TTS 중지
        this.recognition.start();
      } catch (e) {
        console.warn("녹음 시작 재시도:", e);
        this.recognition.stop();
        setTimeout(() => this.recognition.start(), 200);
      }
    }
  }

  /**
   * 텍스트를 음성으로 낭독 (TTS)
   * @param {string} text - 읽을 내용
   * @param {object} options - pitch, rate, role 등
   */
  speak(text, options = {}) {
    if (!this.synth) {
      console.warn("TTS가 지원되지 않습니다.");
      return;
    }

    // 기존 음성 중지
    this.synth.cancel();

    if (!text || text.trim() === '') return;

    // 마크다운, 이모지, HTML 태그 및 특수문자 정제
    const cleanText = text
      .replace(/<[^>]*>/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[#*_~`]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';

    // 기본 피치 및 속도
    let pitch = options.pitch || 1.0;
    let rate = options.rate || 0.95;

    // 화자에 따른 음성 맞춤 설정
    if (options.role === 'soonja' || options.role === 'elder') {
      pitch = 0.88;
      rate = 0.86; // 어르신 톤: 살짝 낮고 차분하며 또렷하게
    } else if (options.role === 'minjun' || options.role === 'youth') {
      pitch = 1.12;
      rate = 1.02; // 청년 톤: 밝고 경쾌하게
    } else if (options.role === 'dr_bau') {
      pitch = 1.0;
      rate = 0.95; // 중재자 톤: 신뢰감 있는 표준 톤
    }

    utterance.pitch = pitch;
    utterance.rate = rate;

    // 한국어 목소리가 있으면 적용
    if (this.koreanVoices.length > 0) {
      utterance.voice = this.koreanVoices[0];
    }

    if (this.onSpeakingStateChange) {
      this.onSpeakingStateChange(true);
    }

    utterance.onend = () => {
      if (this.onSpeakingStateChange) {
        this.onSpeakingStateChange(false);
      }
    };

    utterance.onerror = (err) => {
      console.error("TTS 에러:", err);
      if (this.onSpeakingStateChange) {
        this.onSpeakingStateChange(false);
      }
    };

    this.synth.speak(utterance);
  }

  /**
   * 음성 낭독 중지
   */
  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      if (this.onSpeakingStateChange) {
        this.onSpeakingStateChange(false);
      }
    }
  }
}

window.SpeechManager = SpeechManager;
