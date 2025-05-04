// Express 모듈 가져오기 및 라우터 생성
const express = require("express");
const router = express(); // Express 애플리케이션 생성

// 인증 미들웨어 가져오기
const auth = require("../middlewares/authMiddleware");

// 인증 관련 컨트롤러 가져오기
const authcontroller = require("../controllers/authcontroller");

// 입력 데이터 검증을 위한 Validator 가져오기
const { registerValidator, loginValidator } = require("../helpers/validator");

// 사용자 등록 라우트
router.post(
  "/register", // 경로
  registerValidator, // 입력 데이터 검증 미들웨어
  authcontroller.registerUser // 사용자 등록 컨트롤러
);

// 사용자 로그인 라우트
router.post(
  "/login", // 경로
  loginValidator, // 입력 데이터 검증 미들웨어
  authcontroller.loginUser // 사용자 로그인 컨트롤러
);

// 사용자 프로필 가져오기 라우트
router.get(
  "/profile", // 경로
  auth, // 인증 미들웨어
  authcontroller.getProfile // 사용자 프로필 컨트롤러
);

// 사용자 권한 새로고침 라우트
router.get(
  "/refresh-permissions", // 경로
  auth, // 인증 미들웨어
  authcontroller.getUserPermissions // 사용자 권한 새로고침 컨트롤러
);

// 라우터 모듈 내보내기
module.exports = router;
