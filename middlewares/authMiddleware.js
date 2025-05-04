// express-validator에서 header 유효성 검사기 가져오기 (현재 사용되지 않음)
const { header } = require("express-validator");

// JSON Web Token(JWT) 라이브러리 가져오기
const jwt = require("jsonwebtoken");

// 토큰 검증 미들웨어 정의
const verifyToken = (req, res, next) => {
  // 요청에서 토큰 가져오기 (body, query, headers에서 확인)
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  // 토큰이 없는 경우 인증 실패 응답 반환
  if (!token) {
    return res.status(400).json({
      success: false,
      msg: "A token is required for authentication", // 인증 토큰 필요 메시지
    });
  }

  try {
    // Bearer 토큰 형식 처리
    const bearer = token.split(" "); // "Bearer <token>" 형식 분리
    const bearerToken = bearer[1]; // 실제 토큰 값 추출

    // JWT 토큰 검증
    const decodedData = jwt.verify(
      bearerToken, // 추출된 토큰
      process.env.ACCESS_SECRET_TOKEN // 비밀 키
    );

    // 검증된 사용자 정보를 요청 객체(req)에 추가
    req.user = decodedData.user;
  } catch (error) {
    // 토큰 검증 실패 시 응답 반환
    return res.status(400).json({
      success: false,
      msg: "Invalid Token", // 유효하지 않은 토큰 메시지
    });
  }

  // 토큰 검증 성공 시 다음 미들웨어로 이동
  return next();
};

// 미들웨어 내보내기
module.exports = verifyToken;
