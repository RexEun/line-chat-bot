# 🤖 LINE 단체방 자동응답 봇 (Vercel 배포용)

단체 라인방에 사용자가 **"환영"**이라고 입력하면, 방 안내 및 공지사항을 자동으로 전송하는 봇입니다.  
Vercel Serverless Function 기반으로 동작하며, 추후 단독 서버(Node.js / Express / Docker 등)로 쉽게 이전할 수 있도록 설계되었습니다.

---

## 📁 프로젝트 구조

```
Line-Chat-Bot/
├── api/
│   └── webhook.js       # Vercel Serverless Webhook 엔드포인트 (/api/webhook)
├── config/
│   └── notice.js        # 공지사항 문구 및 트리거 키워드 설정 파일
├── server.js            # 로컬 테스트 및 독립 서버용 Node.js 실행기
├── vercel.json          # Vercel 라우팅 설정 파일
├── .env.example         # 환경 변수 설정 템플릿
├── package.json
└── README.md
```

---

## 🛠️ 1단계: LINE Developers 설정

1. **[LINE Developers Console](https://developers.line.biz/)**에 로그인합니다.
2. 새 **Provider**를 만들거나 기존 것을 선택한 뒤, **Create a Messaging API channel**을 클릭합니다.
3. 생성된 채널 설정에서 아래 두 가지를 확인 및 발급받습니다:
   - **Channel secret**: `Basic settings` 탭 아래쪽
   - **Channel access token (long-lived)**: `Messaging API` 탭 맨 아래 `Issue` 클릭하여 발급
4. **단체방 허용 및 자동응답 끄기 (필수)**:
   - `Messaging API` 탭 ➡️ **LINE Official Account features** ➡️ `Edit` 클릭
   - **Allow bot to join group chats**: **Enabled(허용)**로 변경
   - **Auto-reply messages**: **Disabled(사용 안 함)**로 변경 (라인 자체 기본 응답 끄기)

---

## 🚀 2단계: Vercel 배포하기

### 방법 A: GitHub 연동 배포 (추천)
1. 이 프로젝트 코드를 GitHub 리포지토리에 푸시합니다:
   ```bash
   git init
   git add .
   git commit -m "feat: LINE auto reply bot"
   git remote add origin <깃허브_주소>
   git push -u origin main
   ```
2. **[Vercel 대시보드](https://vercel.com)**에서 `Add New...` ➡️ `Project`를 누르고 리포지토리를 가져옵니다.
3. **Environment Variables (환경 변수)**에 아래 두 개를 등록합니다:
   - `LINE_CHANNEL_SECRET`: 발급받은 Channel secret
   - `LINE_CHANNEL_ACCESS_TOKEN`: 발급받은 Channel access token
4. **Deploy** 버튼을 누르면 배포 완료!  
   (예: `https://my-line-bot.vercel.app` 형태의 도메인이 생성됩니다.)

### 방법 B: Vercel CLI로 배포
```bash
npm i -g vercel
vercel
# 환경 변수 추가
vercel env add LINE_CHANNEL_SECRET
vercel env add LINE_CHANNEL_ACCESS_TOKEN
vercel --prod
```

---

## 🔗 3단계: LINE에 Webhook 등록

1. **LINE Developers Console** ➡️ 생성한 채널 ➡️ `Messaging API` 탭으로 이동합니다.
2. **Webhook URL** 항목에 배포된 Vercel 주소를 입력합니다:
   - 예: `https://<내-버셀-프로젝트-도메인>/api/webhook`
3. **Use webhook** 토글 스위치를 **ON**으로 켭니다.
4. **Verify** 버튼을 클릭하여 `Success`가 뜨는지 확인합니다.

---

## 💬 4단계: 단체방에 봇 초대 및 테스트

1. 채널의 QR 코드를 스캔하여 내 라인 계정으로 봇을 친구 추가합니다.
2. 봇을 단체 채팅방에 초대합니다.
3. 채팅방에서 **"환영"**을 입력하면 봇이 공지 메시지를 자동으로 전송합니다.

---

## ⚙️ 공지사항 내용 및 키워드 변경 방법

`config/notice.js` 파일을 열어 언제든 내용을 바꿀 수 있습니다:

```javascript
module.exports = {
  // 응답할 키워드 (기본: "환영", "!환영", "/환영")
  triggerKeywords: ['환영', '!환영', '/환영'],

  // 전송할 공지 메시지
  getNoticeMessage: function () {
    return [
      {
        type: 'text',
        text: `📢 [단체방 공지]\n원하시는 문구로 자유롭게 수정하세요!`,
      },
    ];
  },
};
```
> 수정 후 GitHub에 push하면 Vercel이 수 초 내로 자동 재배포합니다.

---

## 💻 로컬에서 테스트하기 (ngrok 이용)

1. `.env` 파일 생성:
   ```bash
   cp .env.example .env
   # .env 파일에 실제 토큰과 시크릿 키 입력
   ```
2. 로컬 서버 실행:
   ```bash
   npm run dev
   # http://localhost:3000 에서 실행됨
   ```
3. 별도 터미널에서 ngrok 실행:
   ```bash
   ngrok http 3000
   ```
4. 생성된 `https://xxxx.ngrok-free.app/api/webhook` 주소를 LINE Developers의 Webhook URL에 입력하여 테스트할 수 있습니다.
