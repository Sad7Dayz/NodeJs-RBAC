// express-validator에서 check 함수 가져오기
const { check } = require("express-validator");

// 권한 추가 요청 검증
exports.permissionAddValidator = [
  check("permission_name", "Permission Name is required").not().isEmpty(), // 권한 이름 필드가 비어 있지 않은지 확인
];

// 권한 삭제 요청 검증
exports.permissionDeleteValidator = [
  check("id", "ID is required").not().isEmpty(), // ID 필드가 비어 있지 않은지 확인
];

// 권한 업데이트 요청 검증
exports.permissionUpdateValidator = [
  check("id", "ID is required").not().isEmpty(), // ID 필드가 비어 있지 않은지 확인
  check("permission_name", "Permission Name is required").not().isEmpty(), // 권한 이름 필드가 비어 있지 않은지 확인
];

// 카테고리 추가 요청 검증
exports.categoryAddValidator = [
  check("category_name", "category_name is required").not().isEmpty(), // 카테고리 이름 필드가 비어 있지 않은지 확인
];

// 카테고리 삭제 요청 검증
exports.categoryDeleteValidator = [
  check("id", "ID is required").not().isEmpty(), // ID 필드가 비어 있지 않은지 확인
];

// 카테고리 업데이트 요청 검증
exports.categoryUpdateValidator = [
  check("id", "ID is required").not().isEmpty(), // ID 필드가 비어 있지 않은지 확인
  check("category_name", "category Name is required").not().isEmpty(), // 카테고리 이름 필드가 비어 있지 않은지 확인
];

// 게시물 생성 요청 검증
exports.postCreateValidator = [
  check("title", "title is required").not().isEmpty(), // 제목 필드가 비어 있지 않은지 확인
  check("description", "description is required").not().isEmpty(), // 설명 필드가 비어 있지 않은지 확인
];

// 게시물 삭제 요청 검증
exports.postDeleteValidator = [
  check("id", "id is required").not().isEmpty(), // ID 필드가 비어 있지 않은지 확인
];

// 게시물 업데이트 요청 검증
exports.postUpdateValidator = [
  check("id", "id is required").not().isEmpty(), // ID 필드가 비어 있지 않은지 확인
  check("title", "title is required").not().isEmpty(), // 제목 필드가 비어 있지 않은지 확인
  check("description", "description is required").not().isEmpty(), // 설명 필드가 비어 있지 않은지 확인
];

// 역할 저장 요청 검증
exports.storeRoleValidator = [
  check("role_name", "role_name is required").not().isEmpty(), // 역할 이름 필드가 비어 있지 않은지 확인
  check("value", "value is required").not().isEmpty(), // 역할 값 필드가 비어 있지 않은지 확인
];

// 라우터 권한 추가 요청 검증
exports.addRouterPermissionValidator = [
  check("router_endpoint", "router_endpoint is required").not().isEmpty(), // 라우터 엔드포인트 필드가 비어 있지 않은지 확인
  check("role", "role is required").not().isEmpty(), // 역할 필드가 비어 있지 않은지 확인
  check("permission", "permission is must be an array").isArray(), // 권한 필드가 배열인지 확인
];

// 라우터 권한 조회 요청 검증
exports.getRouterPermissionValidator = [
  check("router_endpoint", "router_endpoint is required").not().isEmpty(), // 라우터 엔드포인트 필드가 비어 있지 않은지 확인
];
