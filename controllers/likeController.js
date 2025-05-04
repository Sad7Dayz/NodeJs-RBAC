const { validationResult } = require("express-validator");

const Like = require("../models/likeModel");

const postLike = async (req, res) => {
  try {
    // 요청 데이터 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(), // 검증 실패 시 에러 반환
      });
    }

    // 요청 데이터에서 사용자 ID와 게시물 ID 추출
    const { user_id, post_id } = req.body;

    // 이미 좋아요를 눌렀는지 확인
    const isLiked = await Like.findOne({ user_id, post_id });
    if (isLiked) {
      return res.status(400).json({
        success: false,
        msg: "Already liked!", // 이미 좋아요를 누른 경우 메시지 반환
      });
    }

    // 좋아요 데이터 생성
    const like = new Like({
      user_id,
      post_id,
    });

    // 좋아요 데이터 저장
    const likeData = await like.save();

    return res.status(200).json({
      success: true,
      msg: "Post liked successfully!", // 좋아요 성공 메시지
      data: likeData, // 저장된 좋아요 데이터 반환
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

const postUnLike = async (req, res) => {
  try {
    // 요청 데이터 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(), // 검증 실패 시 에러 반환
      });
    }

    // 요청 데이터에서 사용자 ID와 게시물 ID 추출
    const { user_id, post_id } = req.body;

    // 좋아요가 존재하는지 확인
    const isLiked = await Like.findOne({ user_id, post_id });
    if (!isLiked) {
      return res.status(400).json({
        success: false,
        msg: "you have not liked!", // 좋아요를 누르지 않은 경우 메시지 반환
      });
    }

    // 좋아요 데이터 삭제
    await Like.deleteOne({ user_id, post_id });

    return res.status(200).json({
      success: true,
      msg: "Post unliked!", // 좋아요 취소 성공 메시지
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

const postLikeCount = async (req, res) => {
  try {
    // 요청 데이터 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(), // 검증 실패 시 에러 반환
      });
    }

    // 요청 데이터에서 게시물 ID 추출
    const { post_id } = req.body;

    // 게시물의 좋아요 개수 조회
    const likeCount = await Like.find({ post_id }).countDocuments();

    return res.status(200).json({
      success: true,
      msg: "Post Like Count!", // 좋아요 개수 조회 성공 메시지
      count: likeCount, // 좋아요 개수 반환
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

module.exports = { postLike, postUnLike, postLikeCount };
