// Mongoose 모듈 가져오기
const mongoose = require("mongoose");

// 게시물(Post) 스키마 정의
const postSchema = new mongoose.Schema({
  // 게시물 제목
  title: {
    type: String, // 문자열 타입
    required: true, // 필수 필드
  },
  // 게시물 설명
  description: {
    type: String, // 문자열 타입
    required: true, // 필수 필드
  },
  // 카테고리 목록
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId 타입
      ref: "Category", // "Category" 모델 참조 (Category 컬렉션과 관계 설정)
      required: false, // 필수 필드는 아님
    },
  ],
});

// "Post" 모델 생성 및 내보내기
module.exports = mongoose.model("Post", postSchema);
