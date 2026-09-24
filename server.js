require('dotenv').config();
const http = require('http');
const webhookHandler = require('./api/webhook');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // 간단한 라우팅
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/webhook' || url.pathname === '/webhook' || url.pathname === '/') {
    // Vercel Serverless Function 헬퍼 메서드 모방 (res.status, res.json, res.send)
    res.status = function (statusCode) {
      this.statusCode = statusCode;
      return this;
    };
    res.send = function (body) {
      if (typeof body === 'object') {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(body));
      } else {
        this.setHeader('Content-Type', 'text/plain; charset=utf-8');
        this.end(body);
      }
      return this;
    };
    res.json = function (jsonObj) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(jsonObj));
      return this;
    };

    webhookHandler(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 LINE Bot 로컬 서버가 시작되었습니다!`);
  console.log(`📡 포트: http://localhost:${PORT}`);
  console.log(`🔗 웹훅 경로: http://localhost:${PORT}/api/webhook`);
  console.log(`=========================================`);
});
