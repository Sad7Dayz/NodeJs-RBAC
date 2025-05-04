// express-validator에서 check 함수 가져오기
const { check } = require("express-validator");

// 사용자 등록 요청 검증
exports.registerValidator = [
  check("name", "Name is required").not().isEmpty(), // 이름 필드가 비어 있지 않은지 확인
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true, // Gmail 주소에서 점 제거
  }), // 유효한 이메일 형식인지 확인
  check("password", "password is required").not().isEmpty(), // 비밀번호 필드가 비어 있지 않은지 확인
];

// 사용자 로그인 요청 검증
exports.loginValidator = [
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true, // Gmail 주소에서 점 제거
  }), // 유효한 이메일 형식인지 확인
  check("password", "password is required").not().isEmpty(), // 비밀번호 필드가 비어 있지 않은지 확인
];

// 사용자 생성 요청 검증
exports.createUserValidator = [
  check("name", "Name is required").not().isEmpty(), // 이름 필드가 비어 있지 않은지 확인
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true, // Gmail 주소에서 점 제거
  }), // 유효한 이메일 형식인지 확인
];

// 사용자 업데이트 요청 검증
exports.updateUserValidator = [
  check("id", "id is required").not().isEmpty(), // 사용자 ID 필드가 비어 있지 않은지 확인
  check("name", "name is required").not().isEmpty(), // 이름 필드가 비어 있지 않은지 확인
];

// 사용자 삭제 요청 검증
exports.deleteUserValidator = [
  check("id", "id is required").not().isEmpty(), // 사용자 ID 필드가 비어 있지 않은지 확인
];

// 게시물 좋아요/좋아요 취소 요청 검증
exports.postLikeUnlikeValidator = [
  check("user_id", "user_id is required").not().isEmpty(), // 사용자 ID 필드가 비어 있지 않은지 확인
  check("post_id", "post_id is required").not().isEmpty(), // 게시물 ID 필드가 비어 있지 않은지 확인
];

// 게시물 좋아요 수 요청 검증
exports.postLikeCountValidator = [
  check("post_id", "post_id is required").not().isEmpty(), // 게시물 ID 필드가 비어 있지 않은지 확인
];
