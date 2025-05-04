// Mongoose 모듈 가져오기
const mongoose = require("mongoose");

// 역할(Role) 스키마 정의
const roleSchema = new mongoose.Schema({
  // 역할 이름
  role_name: {
    type: String, // 문자열 타입
    required: true, // 필수 필드
  },
  // 역할 값
  value: {
    type: Number, // 숫자 타입
    required: true, // 필수 필드
    // 역할 값 정의:
    // 0 -> 일반 사용자 (Normal user)
    // 1 -> 관리자 (Admin)
    // 2 -> 부관리자 (Sub-Admin)
    // 3 -> 편집자 (Editor)
  },
});

// "Role" 모델 생성 및 내보내기
module.exports = mongoose.model("role", roleSchema);
