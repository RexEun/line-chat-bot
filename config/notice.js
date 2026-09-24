// 트리거 키워드별 응답 메시지 설정 파일
// 추후 키워드나 안내 문구를 이곳에서 자유롭게 추가 및 수정할 수 있습니다.

const responses = {
  환영: [
    {
      type: 'text',
      text: `📢 환영 메시지 예시입니다.\n\n우리 방에 오신 것을 진심으로 환영합니다! 🎉`,
    },
  ],
  인증1: [
    {
      type: 'text',
      text: `📢 인증1 메시지 예시입니다.\n\n인증 1단계 관련 안내 및 절차 설명입니다.`,
    },
  ],
  인증2: [
    {
      type: 'text',
      text: `📢 인증2 메시지 예시입니다.\n\n인증 2단계 관련 안내 및 절차 설명입니다.`,
    },
  ],
  인증3: [
    {
      type: 'text',
      text: `📢 인증3 메시지 예시입니다.\n\n인증 3단계 관련 안내 및 절차 설명입니다.`,
    },
  ],
};

module.exports = {
  // 사용자의 메시지와 일치하는 응답 메시지 반환 (일치하지 않으면 null 반환)
  getResponseMessage: function (text) {
    if (!text) return null;
    const cleanText = text.trim();

    if (responses[cleanText]) {
      return responses[cleanText];
    }
    return null;
  },

  // 전체 응답 데이터
  responses,
};
