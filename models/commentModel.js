// Mongoose 모듈 가져오기
const mongoose = require("mongoose");

// 댓글(Comment) 스키마 정의
const commentSchema = new mongoose.Schema({
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
  // 댓글 내용
  comment: {
    type: String, // 문자열 타입
    required: true, // 필수 필드
  },
});

// "Comment" 모델 생성 및 내보내기
module.exports = mongoose.model("Comment", commentSchema);
