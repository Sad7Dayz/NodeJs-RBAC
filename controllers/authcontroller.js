const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Permission = require("../models/permissionModel");
const UserPermission = require("../models/userPermissionModel");
const helper = require("../helpers/helper");

const registerUser = async (req, res) => {
  try {
    // 요청 데이터 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        suceess: false,
        msg: "Errors",
        errors: errors.array(), // 검증 실패 시 에러 반환
      });
    }

    // 요청 데이터에서 이름, 이메일, 비밀번호 추출
    const { name, email, password } = req.body;

    // 이메일 중복 확인
    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      return res.status(200).json({
        suceess: false,
        msg: "Email already exists!", // 중복된 이메일 메시지 반환
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 객체 생성
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 사용자 저장
    const userData = await user.save();

    // 기본 권한 조회
    const defaultPermission = await Permission.find({
      is_default: 1, // 기본 권한만 조회
    });

    // 기본 권한이 있는 경우 사용자 권한 저장
    if (defaultPermission.length > 0) {
      const permissionArray = [];
      defaultPermission.forEach((permission) => {
        permissionArray.push({
          permission_name: permission.permission_name,
          permission_value: [0, 1, 2, 3], // 기본 권한 값 설정
        });
      });

      const userPermission = new UserPermission({
        user_id: userData._id, // 사용자 ID
        permissions: permissionArray, // 권한 배열
      });

      await userPermission.save(); // 사용자 권한 저장
    }

    return res.status(200).json({
      suceess: true,
      msg: "Registered Successfully!", // 사용자 등록 성공 메시지
      data: userData, // 저장된 사용자 데이터 반환
    });
  } catch (error) {
    return res.status(400).json({ suceess: false, msg: error.message }); // 에러 메시지 반환
  }
};

const generateAccessToken = async (user) => {
  const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {
    expiresIn: "2h", // 토큰 만료 시간 설정
  });
  return token; // 생성된 토큰 반환
};

const loginUser = async (req, res) => {
  try {
    // 요청 데이터 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        suceess: false,
        msg: "Errors",
        errors: errors.array(), // 검증 실패 시 에러 반환
      });
    }

    // 요청 데이터에서 이메일과 비밀번호 추출
    const { email, password } = req.body;

    // 사용자 데이터 조회
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({
        suceess: false,
        msg: "Email & Password is incorrect!", // 잘못된 이메일 또는 비밀번호 메시지 반환
      });
    }

    // 비밀번호 일치 여부 확인
    const isPasswordMatch = await bcrypt.compare(password, userData.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        suceess: false,
        msg: "Email & Password is incorrect!", // 잘못된 이메일 또는 비밀번호 메시지 반환
      });
    }

    // 액세스 토큰 생성
    const accessToken = await generateAccessToken({ user: userData });

    // 사용자 데이터와 권한 정보 조회
    const result = await User.aggregate([
      {
        $match: { email: userData.email }, // 이메일로 사용자 필터링
      },
      {
        $lookup: {
          from: "userpermissions", // 사용자 권한 정보 연결
          localField: "_id",
          foreignField: "user_id",
          as: "permissions",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          permissions: {
            $cond: {
              if: { $isArray: "$permissions" }, // 권한이 배열인지 확인
              then: { $arrayElemAt: ["$permissions", 0] }, // 첫 번째 권한 가져오기
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          permissions: {
            permissions: "$permissions.permissions", // 권한 필드 추가
          },
        },
      },
    ]);

    return res.status(200).json({
      suceess: true,
      msg: "Login Successfully!", // 로그인 성공 메시지
      accessToken: accessToken, // 생성된 액세스 토큰 반환
      tokentype: "Bearer",
      data: result[0], // 사용자 데이터 반환
    });
  } catch (error) {
    return res.status(400).json({ suceess: false, msg: error.message }); // 에러 메시지 반환
  }
};

const getProfile = async (req, res) => {
  try {
    const user_id = req.user._id; // 요청에서 사용자 ID 추출
    const userData = await User.findOne({ _id: user_id }); // 사용자 데이터 조회
    return res.status(200).json({
      suceess: true,
      msg: "",
      data: userData, // 사용자 데이터 반환
    });
  } catch (error) {
    return res.status(200).json({
      suceess: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

const getUserPermissions = async (req, res) => {
  try {
    const user_id = req.user._id; // 요청에서 사용자 ID 추출
    const userPermissions = await helper.getUserPermissions(user_id); // 헬퍼 함수로 권한 조회
    return res.status(200).json({
      suceess: true,
      msg: "User Permissions", // 권한 조회 성공 메시지
      data: userPermissions, // 권한 데이터 반환
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getUserPermissions,
};
