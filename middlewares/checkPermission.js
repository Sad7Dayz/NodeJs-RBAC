// 헬퍼 함수 가져오기
const helper = require("../helpers/helper");

// 권한 확인 미들웨어 정의
const checkPermission = async (req, res, next) => {
  try {
    // 사용자가 관리자가 아닌 경우에만 권한 확인
    if (req.user.role != 1) {
      // 현재 요청 경로와 사용자 역할에 대한 라우터 권한 가져오기
      const routerPermission = await helper.getRouterPermission(
        req.path, // 요청 경로
        req.user.role // 사용자 역할
      );

      // 현재 사용자에 대한 권한 정보 가져오기
      const userPermissions = helper.getUserPermissions(req.user._id);

      // 사용자 권한 또는 라우터 권한이 없을 경우 접근 거부
      if (
        userPermissions.permissions.permissions == undefined || // 사용자 권한이 정의되지 않은 경우
        !routerPermission // 라우터 권한이 없는 경우
      ) {
        return res.status(400).json({
          success: false,
          msg: "You haven't permission to access this route!", // 접근 권한 없음 메시지
        });
      }

      // 라우터 권한에서 필요한 권한 이름 및 값 가져오기
      const permission_name = routerPermission.permission_id.permission_name;
      const permission_values = routerPermission.permission;

      // 사용자 권한에서 라우터 권한과 일치하는 권한이 있는지 확인
      const hasPermission = userPermissions.permissions.permissions.some(
        (permission) =>
          permission.permission_name == permission_name && // 권한 이름이 일치하는지 확인
          permission.permission_values.some(
            (value) => permission_values.includes(value) // 권한 값이 포함되어 있는지 확인
          )
      );

      // 권한이 없을 경우 접근 거부
      if (!hasPermission) {
        return res.status(400).json({
          success: false,
          msg: "You haven't permission to access this route!", // 접근 권한 없음 메시지
        });
      }
    }

    // 권한 확인 통과 시 다음 미들웨어로 이동
    return next();
  } catch (error) {
    // 예외 발생 시 에러 메시지 반환
    return res.status(400).json({
      success: false,
      message: "Something went wrong", // 에러 메시지
    });
  }
};

// 미들웨어 내보내기
module.exports = checkPermission;
