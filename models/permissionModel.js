// Mongoose 모듈 가져오기
const mongoose = require("mongoose");

// 권한(Permission) 스키마 정의
const permissionSchema = new mongoose.Schema({
  // 권한 이름
  permission_name: {
    type: String, // 문자열 타입
    required: true, // 필수 필드
  },
  // 기본 권한 여부
  is_default: {
    type: Number, // 숫자 타입
    default: 0, // 기본값: 0 (기본 권한 아님)
    // 값 정의:
    // 0 -> 기본 권한 아님 (Not default)
    // 1 -> 기본 권한 (Default)
  },
});

// "Permission" 모델 생성 및 내보내기
module.exports = mongoose.model("Permission", permissionSchema);
