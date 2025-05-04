// Mongoose 모듈 가져오기
const mongoose = require("mongoose");

// 라우터 권한 스키마 정의
const routerpermissionSchema = new mongoose.Schema({
  // 라우터 엔드포인트
  router_endpoint: {
    type: String, // 문자열 타입
    required: true, // 필수 필드
  },
  // 역할 (Role)
  role: {
    type: Number, // 숫자 타입
    required: true, // 필수 필드
    // 역할 정의:
    // 0 -> 일반 사용자 (Normal user)
    // 1 -> 관리자 (Admin)
    // 2 -> 부관리자 (Sub-Admin)
    // 3 -> 편집자 (Editor)
  },
  // 권한 ID
  permission_id: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId 타입
    required: true, // 필수 필드
    ref: "Permission", // "Permission" 모델 참조 (Permission 컬렉션과 관계 설정)
  },
  // 권한 값
  permission: {
    type: Array, // 배열 타입 (권한 값 목록)
    required: true, // 필수 필드
    // 권한 값 정의:
    // 0 -> 생성(Create)
    // 1 -> 읽기(Read)
    // 2 -> 업데이트(Update)
    // 3 -> 삭제(Delete)
  },
});

// "RouterPermission" 모델 생성 및 내보내기
module.exports = mongoose.model("RouterPermission", routerpermissionSchema);
