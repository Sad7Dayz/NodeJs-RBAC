// 관리자 전용 접근 미들웨어 정의
const onlyAdminAccess = async (req, res, next) => {
  try {
    // 요청한 사용자의 역할(role)이 관리자가 아닌 경우
    if (req.user.role != 1) {
      return res.status(400).json({
        success: false,
        msg: "You haven't permission to access this route!", // 접근 권한 없음 메시지
      });
    }
  } catch (error) {
    // 예외 발생 시 에러 메시지 반환
    return res.status(400).json({
      success: false,
      msg: "Something went wrong!", // 일반적인 에러 메시지
    });
  }

  // 관리자인 경우 다음 미들웨어로 이동
  return next();
};

// 미들웨어 내보내기
module.exports = { onlyAdminAccess };
