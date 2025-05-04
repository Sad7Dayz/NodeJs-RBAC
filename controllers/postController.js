const { validationResult } = require("express-validator");

const Post = require("../models/postModel");
const { post } = require("../routes/commonRoute");

const createPost = async (req, res) => {
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

    // 요청 데이터에서 제목과 설명 추출
    const { title, description } = req.body;

    // 게시물 객체 생성
    var obj = {
      title,
      description,
    };

    // 카테고리가 요청에 포함된 경우 추가
    if (req.body.categories) {
      obj.categories = req.body.categories;
    }

    // 게시물 저장
    const post = new Post(obj);
    const postData = await post.save();

    // 저장된 게시물 데이터를 카테고리와 함께 조회
    const postFullDate = await Post.findOne({ _id: postData._id }).populate(
      "categories"
    );

    return res.status(200).json({
      succeess: true,
      msg: "Post Created Successfully!", // 게시물 생성 성공 메시지
      data: postFullDate, // 생성된 게시물 데이터 반환
    });
  } catch (error) {
    return res.status(400).json({
      succeess: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

const getPosts = async (req, res) => {
  try {
    // 모든 게시물을 조회하고 카테고리 데이터를 함께 가져옴
    const posts = await Post.find({}).populate("categories");

    return res.status(200).json({
      succeess: true,
      msg: "Post Fetched Successfully!", // 게시물 조회 성공 메시지
      data: posts, // 조회된 게시물 데이터 반환
    });
  } catch (error) {
    return res.status(400).json({
      succeess: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

const updatePost = async (req, res) => {
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

    // 요청 데이터에서 ID, 제목, 설명 추출
    const { id, title, description } = req.body;

    // 게시물이 존재하는지 확인
    const isExists = await Post.findOne({ _id: id });
    if (!isExists) {
      return res.status(400).json({
        succeess: false,
        msg: "Post doesn't exists!", // 게시물이 존재하지 않음 메시지
      });
    }

    // 업데이트할 데이터 객체 생성
    var updateObj = {
      title,
      description,
    };

    // 카테고리가 요청에 포함된 경우 추가
    if (req.body.categories) {
      updateObj.categories = req.body.categories;
    }

    // 게시물 업데이트
    await Post.findByIdAndUpdate(
      { _id: id },
      {
        $set: updateObj, // 업데이트할 데이터 설정
      },
      { new: true } // 업데이트된 데이터 반환 옵션
    );

    return res.status(200).json({
      succeess: true,
      msg: "Post Updated Successfully!", // 게시물 업데이트 성공 메시지
      data: updateObj, // 업데이트된 데이터 반환
    });
  } catch (error) {
    return res.status(400).json({
      succeess: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

const deletePost = async (req, res) => {
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

    // 요청 데이터에서 ID 추출
    const { id } = req.body;

    // 게시물이 존재하는지 확인
    const isExists = await Post.findOne({ _id: id });
    if (!isExists) {
      return res.status(400).json({
        succeess: false,
        msg: "Post doesn't exists!", // 게시물이 존재하지 않음 메시지
      });
    }

    // 게시물 삭제
    await Post.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      succeess: true,
      msg: "Post Deleted Successfully!", // 게시물 삭제 성공 메시지
    });
  } catch (error) {
    return res.status(400).json({
      succeess: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
};
