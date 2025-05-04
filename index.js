// 환경 변수 로드
require("dotenv").config();

// Express 및 Mongoose 모듈 가져오기
const express = require("express");
const mongoose = require("mongoose");

// MongoDB 연결 설정
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, // 새로운 URL 파서를 사용
  useUnifiedTopology: true, // 새로운 서버 디스커버리 및 모니터링 엔진 사용
});

// Express 애플리케이션 생성
const app = express();

// JSON 요청 본문 파싱 미들웨어 추가
app.use(express.json());

// 정적 파일 제공 (public 디렉토리)
app.use(express.static("public"));

// 인증 관련 라우트 설정
const authRoute = require("./routes/authRoute");
app.use("/api", authRoute); // "/api" 경로에 authRoute 연결

// 관리자 관련 라우트 설정
const adminRoute = require("./routes/adminRoute");
app.use("/api/admin", adminRoute); // "/api/admin" 경로에 adminRoute 연결

// 공통 라우트 설정
const commonRoute = require("./routes/commonRoute");
app.use("/api", commonRoute); // "/api" 경로에 commonRoute 연결

// 인증 및 관리자 미들웨어 가져오기
const auth = require("./middlewares/authMiddleware");
const { onlyAdminAccess } = require("./middlewares/adminMiddleware");

// 관리자 라우트 컨트롤러 가져오기
const routerController = require("./controllers/admin/routerController");

// 관리자 전용 라우트: 모든 라우트 정보 가져오기
app.get(
  "/api/admin/all-routes", // 경로
  auth, // 인증 미들웨어
  onlyAdminAccess, // 관리자 권한 확인 미들웨어
  routerController.getAllRoutes // 라우트 컨트롤러 메서드
);

// 서버 포트 설정 (환경 변수 또는 기본값 3000)
const port = process.env.SERVER_PORT || 3000;

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // 서버 실행 메시지 출력
});
