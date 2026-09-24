const { messagingApi, validateSignature } = require('@line/bot-sdk');
const notice = require('../config/notice');

// Vercel에서 원본 Request Body 버퍼를 읽기 위한 설정
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

// Request stream에서 raw body 버퍼 추출 유틸리티
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (err) => reject(err));
  });
}

module.exports = async (req, res) => {
  // GET 요청(헬스체크용)인 경우
  if (req.method === 'GET') {
    return res.status(200).send('LINE Bot Webhook Server is running.');
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!channelSecret || !channelAccessToken) {
    console.error('환경 변수(LINE_CHANNEL_SECRET 또는 LINE_CHANNEL_ACCESS_TOKEN)가 설정되지 않았습니다.');
    return res.status(500).send('Server environment variable configuration error');
  }

  try {
    // 1. Raw body 수신
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-line-signature'];

    // 2. LINE 서명 검증
    if (!signature || !validateSignature(rawBody, channelSecret, signature)) {
      console.warn('서명 검증 실패: 유효하지 않은 요청입니다.');
      return res.status(403).send('Invalid signature');
    }

    // 3. JSON 파싱
    const body = JSON.parse(rawBody.toString('utf-8'));
    const events = body.events || [];

    // LINE Console의 "Verify" 버튼 테스트 시 events는 빈 배열입니다.
    if (events.length === 0) {
      return res.status(200).json({ status: 'ok', message: 'Webhook verified successfully' });
    }

    // 4. LINE Messaging API 클라이언트 초기화
    const client = new messagingApi.MessagingApiClient({
      channelAccessToken: channelAccessToken,
    });

    // 5. 이벤트 처리
    await Promise.all(
      events.map(async (event) => {
        // 텍스트 메시지 이벤트인지 확인
        if (event.type === 'message' && event.message && event.message.type === 'text') {
          const userMessage = event.message.text;
          const replyMessages = notice.getResponseMessage(userMessage);

          // 일치하는 키워드가 있을 경우 응답 메시지 발송
          if (replyMessages) {
            console.log(`[트리거 감지] 사용자 메시지: "${userMessage}" -> 응답 발송`);
            
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: replyMessages,
            });
          }
        }
      })
    );

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('웹훅 처리 중 오류 발생:', error);
    // LINE 서버가 재전송(재시도) 루프에 빠지지 않도록 기본 응답을 처리
    return res.status(500).send('Internal Server Error');
  }
};
