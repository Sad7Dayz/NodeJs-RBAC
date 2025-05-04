const { validationResult } = require("express-validator");

const Category = require("../models/categoryModel");

const addCategory = async (req, res) => {
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

    // 요청 데이터에서 카테고리 이름 추출
    const { category_name } = req.body;

    // 카테고리 이름 중복 확인
    const isExists = await Category.findOne({
      name: {
        $regex: category_name, // 대소문자 구분 없이 검색
        $options: "i",
      },
    });

    if (isExists) {
      return res.status(400).json({
        success: false,
        msg: "Category name already exists!", // 중복된 카테고리 이름 메시지 반환
      });
    }

    // 새로운 카테고리 생성
    const category = new Category({
      name: category_name,
    });

    // 카테고리 저장
    const categoryData = await category.save();

    return res.status(200).json({
      suceess: true,
      msg: "Category Created Successfully!", // 카테고리 생성 성공 메시지
      data: categoryData, // 생성된 카테고리 데이터 반환
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

const getCategories = async (req, res) => {
  try {
    // 모든 카테고리 조회
    const categories = await Category.find({});

    return res.status(200).json({
      suceess: true,
      msg: "Categories Fetched Successfully!", // 카테고리 조회 성공 메시지
      data: categories, // 조회된 카테고리 데이터 반환
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

const deleteCategory = async (req, res) => {
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

    // 요청 데이터에서 카테고리 ID 추출
    const { id } = req.body;

    // 카테고리가 존재하는지 확인
    const categoryData = await Category.findOne({ _id: id });
    if (!categoryData) {
      return res.status(400).json({
        success: false,
        msg: "Category Id does not exists!", // 카테고리가 존재하지 않음 메시지
      });
    }

    // 카테고리 삭제
    await Category.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      suceess: true,
      msg: "Category Deleted Successfully!", // 카테고리 삭제 성공 메시지
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

const updateCategory = async (req, res) => {
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

    // 요청 데이터에서 카테고리 ID와 이름 추출
    const { id, category_name } = req.body;

    // 카테고리가 존재하는지 확인
    const categoryData = await Category.findOne({ _id: id });
    if (!categoryData) {
      return res.status(400).json({
        success: false,
        msg: "Category Id does not exists!", // 카테고리가 존재하지 않음 메시지
      });
    }

    // 다른 카테고리에 동일한 이름이 있는지 확인
    const isExists = await Category.findOne({
      _id: { $ne: id }, // 현재 카테고리를 제외
      name: {
        $regex: category_name, // 대소문자 구분 없이 검색
        $options: "i",
      },
    });

    if (isExists) {
      return res.status(400).json({
        success: false,
        msg: "Category name already assigned to another category!", // 중복된 이름 메시지 반환
      });
    }

    // 카테고리 업데이트
    const updateData = await Category.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: category_name, // 새로운 이름 설정
        },
      },
      { new: true } // 업데이트된 데이터 반환 옵션
    );

    return res.status(200).json({
      suceess: true,
      msg: "Category Updated Successfully!", // 카테고리 업데이트 성공 메시지
      data: updateData, // 업데이트된 데이터 반환
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

module.exports = {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
