// Express 모듈 가져오기 및 라우터 생성
const express = require("express");
const router = express.Router();

// 인증 미들웨어 가져오기
const auth = require("../middlewares/authMiddleware");

// 관리자 및 사용자 입력 검증을 위한 Validator 가져오기
const {
  categoryAddValidator,
  categoryDeleteValidator,
  categoryUpdateValidator,
  postCreateValidator,
  postUpdateValidator,
  postDeleteValidator,
} = require("../helpers/adminValidator");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  postLikeUnlikeValidator,
  postLikeCountValidator,
} = require("../helpers/validator");

const categoryController = require("../controllers/categoryController");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const likeController = require("../controllers/likeController");

const checkPermission = require("../middlewares/checkPermission");

// 카테고리 추가
router.post(
  "/add-category",
  auth,
  checkPermission,
  categoryAddValidator,
  categoryController.addCategory
);

// 카테고리 목록 가져오기
router.get(
  "/get-categories",
  auth,
  checkPermission,
  categoryController.getCategories
);

// 카테고리 삭제
router.post(
  "/delete-category",
  auth,
  checkPermission,
  categoryDeleteValidator,
  categoryController.deleteCategory
);

// 카테고리 업데이트
router.post(
  "/update-category",
  auth,
  checkPermission,
  categoryUpdateValidator,
  categoryController.updateCategory
);

// 게시물 생성
router.post(
  "/create-post",
  auth,
  checkPermission,
  postCreateValidator,
  postController.createPost
);

// 게시물 목록 가져오기
router.get("/get-posts", auth, checkPermission, postController.getPosts);

// 게시물 업데이트
router.post(
  "/update-post",
  auth,
  checkPermission,
  postUpdateValidator,
  postController.updatePost
);

// 게시물 삭제
router.post(
  "/delete-post",
  auth,
  checkPermission,
  postDeleteValidator,
  postController.deletePost
);

// 사용자 생성
router.post(
  "/create-user",
  auth,
  checkPermission,
  createUserValidator,
  userController.createUser
);

// 사용자 목록 가져오기
router.get("/get-users", auth, checkPermission, userController.getUsers);

// 사용자 업데이트
router.post(
  "/update-user",
  auth,
  checkPermission,
  updateUserValidator,
  userController.updateUser
);

// 사용자 삭제
router.post(
  "/delete-user",
  auth,
  checkPermission,
  deleteUserValidator,
  userController.deleteUser
);

// 게시물 좋아요
router.post(
  "/post-like",
  auth,
  checkPermission,
  postLikeUnlikeValidator,
  likeController.postLike
);

// 게시물 좋아요 취소
router.post(
  "/post-unlike",
  auth,
  checkPermission,
  postLikeUnlikeValidator,
  likeController.postUnLike
);

// 게시물 좋아요 수 가져오기
router.post(
  "/post-like-count",
  auth,
  checkPermission,
  postLikeCountValidator,
  likeController.postLikeCount
);

module.exports = router;
