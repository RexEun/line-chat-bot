// 공지사항 메시지 설정 파일
// 추후 공지 내용이나 조건을 이곳에서 쉽게 수정할 수 있습니다.

module.exports = {
  // 응답을 트리거할 키워드 목록
  triggerKeywords: ['환영', '!환영', '/환영'],

  // 메시지가 키워드와 일치하는지 확인하는 함수
  // 기본: 정확히 키워드와 일치 (앞뒤 공백 무시)
  isTrigger: function (text) {
    if (!text) return false;
    const cleanText = text.trim();
    return this.triggerKeywords.includes(cleanText);
  },

  // 참여자에게 회신할 공지 메시지 내용
  getNoticeMessage: function () {
    return [
      {
        type: 'text',
        text: `📢 [단체방 안내 공지]\n\n우리 방에 오신 것을 진심으로 환영합니다! 🎉\n\n📌 공지사항 및 방 규칙\n1. 서로 배려하고 존중하는 대화를 부탁드립니다.\n2. 광고, 도배, 부적절한 링크 공유는 금지됩니다.\n3. 문의사항이 있으시면 방 관리자에게 갠톡 부탁드립니다.\n\n편안하고 즐거운 시간 되세요! 😊`,
      },
    ];
  },
};
