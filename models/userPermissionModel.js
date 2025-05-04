// Mongoose 모듈 가져오기
const mongoose = require("mongoose");

// 사용자 권한 스키마 정의
const userpermissionSchema = new mongoose.Schema({
  // 사용자 ID
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId 타입
    required: true, // 필수 필드
    ref: "User", // "User" 모델 참조 (User 컬렉션과 관계 설정)
  },
  // 권한 목록
  permissions: [
    {
      permission_name: String, // 권한 이름 (예: "read", "write")
      permission_value: [Number], // 권한 값 배열 (0: create, 1: read, 2: update, 3: delete)
    },
  ],
});

// "UserPermission" 모델 생성 및 내보내기
module.exports = mongoose.model("UserPermission", userpermissionSchema);
