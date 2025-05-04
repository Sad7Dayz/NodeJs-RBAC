// Mongoose 모듈 가져오기
const mongoose = require("mongoose");

// 좋아요(Like) 스키마 정의
const likeSchema = new mongoose.Schema({
  // 사용자 ID
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId 타입
    required: true, // 필수 필드
    ref: "User", // "User" 모델 참조 (User 컬렉션과 관계 설정)
  },
  // 게시물 ID
  post_id: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId 타입
    required: true, // 필수 필드
    ref: "Post", // "Post" 모델 참조 (Post 컬렉션과 관계 설정)
  },
});

// "Like" 모델 생성 및 내보내기
module.exports = mongoose.model("Like", likeSchema);
