// Mongoose 모듈 가져오기
const mongoose = require("mongoose");

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
  // 사용자 이름
  name: {
    type: String, // 문자열 타입
    required: true, // 필수 필드
  },
  // 사용자 이메일
  email: {
    type: String, // 문자열 타입
    required: true, // 필수 필드
  },
  // 사용자 비밀번호
  password: {
    type: String, // 문자열 타입
    required: true, // 필수 필드
  },
  // 사용자 역할
  role: {
    type: Number, // 숫자 타입
    default: 0, // 기본값: 0 (일반 사용자)
    // 역할 정의:
    // 0 -> 일반 사용자 (Normal user)
    // 1 -> 관리자 (Admin)
    // 2 -> 부관리자 (Sub-Admin)
    // 3 -> 편집자 (Editor)
  },
});

// "User" 모델 생성 및 내보내기
module.exports = mongoose.model("User", userSchema);
