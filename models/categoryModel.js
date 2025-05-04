// Mongoose 모듈 가져오기
const mongoose = require("mongoose");

// 카테고리(Category) 스키마 정의
const categorySchema = new mongoose.Schema({
  // 카테고리 이름
  name: {
    type: String, // 문자열 타입
    required: true, // 필수 필드
  },
});

// "Category" 모델 생성 및 내보내기
module.exports = mongoose.model("Category", categorySchema);
