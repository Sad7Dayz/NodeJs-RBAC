// Express 모듈 가져오기 및 라우터 생성
const express = require("express");
const router = express(); // Express 애플리케이션 생성

// 인증 미들웨어 가져오기
const auth = require("../middlewares/authMiddleware");

// 관리자 관련 컨트롤러 가져오기
const permissionController = require("../controllers/admin/permissionController");
const roleController = require("../controllers/admin/roleController");
const routerController = require("../controllers/admin/routerController");

// 관리자 권한 확인 미들웨어 가져오기
const { onlyAdminAccess } = require("../middlewares/adminMiddleware");

// 입력 데이터 검증을 위한 Validator 가져오기
const {
  permissionAddValidator,
  permissionDeleteValidator,
  permissionUpdateValidator,
  storeRoleValidator,
  addRouterPermissionValidator,
  getRouterPermissionValidator,
} = require("../helpers/adminValidator");

// 권한 추가 라우트
router.post(
  "/add-permission", // 경로
  auth, // 인증 미들웨어
  onlyAdminAccess, // 관리자 권한 확인 미들웨어
  permissionAddValidator, // 입력 데이터 검증 미들웨어
  permissionController.addPermission // 권한 추가 컨트롤러
);

// 권한 목록 가져오기 라우트
router.get(
  "/get-permissions", // 경로
  auth, // 인증 미들웨어
  onlyAdminAccess, // 관리자 권한 확인 미들웨어
  permissionController.getPermission // 권한 목록 가져오기 컨트롤러
);

// 권한 삭제 라우트
router.post(
  "/delete-permission", // 경로
  auth, // 인증 미들웨어
  onlyAdminAccess, // 관리자 권한 확인 미들웨어
  permissionDeleteValidator, // 입력 데이터 검증 미들웨어
  permissionController.deletePermission // 권한 삭제 컨트롤러
);

// 권한 업데이트 라우트
router.post(
  "/update-permission", // 경로
  auth, // 인증 미들웨어
  onlyAdminAccess, // 관리자 권한 확인 미들웨어
  permissionUpdateValidator, // 입력 데이터 검증 미들웨어
  permissionController.updatePermission // 권한 업데이트 컨트롤러
);

// 역할 저장 라우트
router.post(
  "/store-role", // 경로
  auth, // 인증 미들웨어
  onlyAdminAccess, // 관리자 권한 확인 미들웨어
  storeRoleValidator, // 입력 데이터 검증 미들웨어
  roleController.storeRole // 역할 저장 컨트롤러
);

// 역할 목록 가져오기 라우트
router.get(
  "/get-roles", // 경로
  auth, // 인증 미들웨어
  onlyAdminAccess, // 관리자 권한 확인 미들웨어
  storeRoleValidator, // 입력 데이터 검증 미들웨어
  roleController.getRoles // 역할 목록 가져오기 컨트롤러
);

// 라우터 권한 추가 라우트
router.post(
  "/add-router-permission", // 경로
  auth, // 인증 미들웨어
  onlyAdminAccess, // 관리자 권한 확인 미들웨어
  addRouterPermissionValidator, // 입력 데이터 검증 미들웨어
  routerController.addRouterPermission // 라우터 권한 추가 컨트롤러
);

// 라우터 권한 가져오기 라우트
router.post(
  "/get-router-permission", // 경로
  auth, // 인증 미들웨어
  onlyAdminAccess, // 관리자 권한 확인 미들웨어
  getRouterPermissionValidator, // 입력 데이터 검증 미들웨어
  routerController.getRouterPermission // 라우터 권한 가져오기 컨트롤러
);

// 라우터 모듈 내보내기
module.exports = router;
