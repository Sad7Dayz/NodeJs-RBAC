// express-validator에서 validationResult 가져오기
const { validationResult } = require("express-validator");

// 필요한 모델 가져오기
const User = require("../models/userModel");
const Permission = require("../models/permissionModel");
const UserPermission = require("../models/userPermissionModel");

// 필요한 라이브러리 가져오기
const bcrypt = require("bcrypt"); // 비밀번호 해싱을 위한 라이브러리
const randomstring = require("randomstring"); // 랜덤 문자열 생성 라이브러리
const { sendMail } = require("../helpers/mailer"); // 이메일 전송 헬퍼
const mongoose = require("mongoose"); // MongoDB와 상호작용하기 위한 라이브러리

// 사용자 생성 함수
const createUser = async (req, res) => {
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

    // 요청 데이터에서 이름과 이메일 추출
    const { name, email } = req.body;

    // 이메일 중복 확인
    const exists = await User.findOne({
      email: { $regex: email, $options: "i" }, // 대소문자 구분 없이 이메일 검색
    });
    if (exists) {
      return res.status(400).json({
        success: false,
        msg: "email is already exists", // 이메일 중복 메시지 반환
      });
    }

    // 랜덤 비밀번호 생성 및 해싱
    const password = randomstring.generate(6); // 6자리 랜덤 비밀번호 생성
    const hashPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱

    // 사용자 객체 생성
    var obj = { name, email, password: hashPassword };

    // 관리자를 생성하려는 경우 요청 차단
    if (req.body.role && req.body.role == 1) {
      return res.status(400).json({
        success: false,
        msg: "You can't create Admin!", // 관리자 생성 차단 메시지
      });
    } else if (req.body.role) {
      obj.role = req.body.role; // 역할 설정
    }

    // 사용자 저장
    const user = new User(obj);
    const userData = await user.save();

    // 권한이 요청에 포함된 경우 권한 저장
    if (req.body.permissions != undefined && req.body.permissions.length > 0) {
      const addPermission = req.body.permissions;
      const permissionArray = [];
      await Promise.all(
        addPermission.map(async (permission) => {
          const permissionData = await Permission.findOne({
            _id: permission.id, // 권한 ID로 권한 데이터 조회
          });

          permissionArray.push({
            permission_name: permissionData.permission_name, // 권한 이름
            permission_value: permission.permission_value, // 권한 값
          });
        })
      );

      const userPermission = new UserPermission({
        user_id: userData._id, // 사용자 ID
        permissions: permissionArray, // 권한 배열
      });

      await userPermission.save(); // 사용자 권한 저장
    }

    // 생성된 비밀번호를 포함한 이메일 전송
    const content = `
      <p>Hi <b>${userData.name}</b>,</p>
      <p>Your account has been created successfully. Below are your account details:</p>
      <table style="border: 1px solid #ddd; border-collapse: collapse; width: 100%;">
        <tr>
          <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Name</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${userData.name}</td>
        </tr>
        <tr>
          <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Email</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${userData.email}</td>
        </tr>
        <tr>
          <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Password</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
        </tr>
      </table>
      <p>You can now log in to your account. Thank you!</p>
    `;

    const mailResult = await sendMail(
      userData.email,
      "Account Created",
      content
    );

    if (!mailResult.success) {
      return res.status(500).json({
        success: false,
        msg: "User created, but failed to send email: " + mailResult.message, // 이메일 전송 실패 메시지
      });
    }

    return res.status(200).json({
      success: true,
      msg: "User created successfully", // 사용자 생성 성공 메시지
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

// 사용자 목록 조회 함수
const getUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(req.user._id) }, // 현재 사용자 제외
        },
      },
      {
        $lookup: {
          from: "userpermissions", // 권한 정보 연결
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
              if: { $isArray: "$permissions" },
              then: { $arrayElemAt: ["$permissions", 0] },
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          permissions: {
            permissions: "$permissions.permissions",
          },
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      msg: "users fetched successfully", // 사용자 목록 조회 성공 메시지
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

// 사용자 업데이트 함수
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(), // 검증 실패 시 에러 반환
      });
    }

    const { id, name } = req.body;
    const isexists = await User.findOne({ _id: id });
    if (!isexists) {
      return res.status(400).json({
        success: false,
        msg: "User not exists", // 사용자 존재하지 않음 메시지
      });
    }

    var updateObj = { name };
    if (req.body.role != undefined) {
      updateObj.role = req.body.role; // 역할 업데이트
    }

    const updatedData = await User.findByIdAndUpdate(
      { _id: id },
      { $set: updateObj },
      { new: true }
    );

    if (req.body.permissions != undefined && req.body.permissions.length > 0) {
      const addPermission = req.body.permissions;
      const permissionArray = [];
      await Promise.all(
        addPermission.map(async (permission) => {
          const permissionData = await Permission.findOne({
            _id: permission.id,
          });

          permissionArray.push({
            permission_name: permissionData.permission_name,
            permission_value: permission.permission_value,
          });
        })
      );

      await UserPermission.findOneAndUpdate(
        { user_id: updatedData._id },
        { permissions: permissionArray },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return res.status(200).json({
      success: true,
      msg: "User Updated successfully!", // 사용자 업데이트 성공 메시지
      data: updatedData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

// 사용자 삭제 함수
const deleteUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(), // 검증 실패 시 에러 반환
      });
    }

    const { id } = req.body;
    const isexists = await User.findOne({ _id: id });
    if (!isexists) {
      return res.status(400).json({
        success: false,
        msg: "User not found", // 사용자 존재하지 않음 메시지
      });
    }

    await User.findByIdAndDelete({ _id: id }); // 사용자 삭제
    return res.status(200).json({
      success: true,
      msg: "User deleted successfully!", // 사용자 삭제 성공 메시지
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message, // 에러 메시지 반환
    });
  }
};

// 모듈 내보내기
module.exports = { createUser, getUsers, updateUser, deleteUser };
