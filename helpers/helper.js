// 필요한 모델 및 라이브러리 가져오기
const User = require("../models/userModel"); // 사용자 모델
const RouterPermission = require("../models/userPermissionModel"); // 사용자 권한 모델
const mongoose = require("mongoose"); // MongoDB와 상호작용하기 위한 Mongoose 라이브러리

// 특정 사용자의 권한 정보를 가져오는 함수
const getUserPermissions = async (user_id) => {
  try {
    // MongoDB Aggregation Pipeline을 사용하여 사용자 권한 조회
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user_id), // 사용자 ID로 필터링
        },
      },
      {
        $lookup: {
          from: "userpermissions", // 연결할 컬렉션 이름
          localField: "_id", // User 모델의 필드
          foreignField: "user_id", // UserPermission 모델의 필드
          as: "permissions", // 결과를 저장할 필드 이름
        },
      },
      {
        $project: {
          _id: 1, // 사용자 ID 포함
          role: 1, // 사용자 역할 포함
          permissions: {
            $cond: {
              if: { $isArray: "$permissions" }, // permissions가 배열인지 확인
              then: { $arrayElemAt: ["$permissions", 0] }, // 첫 번째 요소 가져오기
              else: null, // 배열이 아니면 null
            },
          },
        },
      },
      {
        $addFields: {
          permissions: {
            permissions: "$permissions.permissions", // permissions 필드 추가
          },
        },
      },
    ]);

    return user[0]; // 첫 번째 사용자 반환
  } catch (error) {
    console.log(error.message); // 에러 메시지 출력
    throw error; // 에러 다시 던지기
  }
};

// 특정 라우터와 역할에 대한 권한 정보를 가져오는 함수
const getRouterPermission = async (router, role) => {
  try {
    // RouterPermission 컬렉션에서 라우터와 역할에 해당하는 권한 조회
    const routerPermission = await RouterPermission.findOne({
      router_endpoint: router, // 라우터 엔드포인트
      role: role, // 사용자 역할
    }).populate("permission_id"); // permission_id 필드의 참조 데이터 가져오기
    return routerPermission; // 조회된 권한 반환
  } catch (error) {
    console.log(error.message); // 에러 메시지 출력
    return null; // 에러 발생 시 null 반환
  }
};

// 함수 내보내기
module.exports = {
  getUserPermissions, // 사용자 권한 조회 함수
  getRouterPermission, // 라우터 권한 조회 함수
};
