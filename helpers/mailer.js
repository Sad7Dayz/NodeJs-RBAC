// Nodemailer 라이브러리 가져오기
const nodemailer = require("nodemailer");

// Nodemailer를 사용하여 이메일 전송을 위한 SMTP 설정
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // SMTP 서버 호스트 (환경 변수에서 가져옴)
  port: process.env.SMTP_PORT, // SMTP 서버 포트 (환경 변수에서 가져옴)
  secure: false, // 보안 연결 여부 (false: TLS 사용)
  requireTLS: true, // TLS 연결 요구
  auth: {
    user: process.env.SMTP_MAIL, // SMTP 인증 사용자 (환경 변수에서 가져옴)
    pass: process.env.SMTP_PASSWORD, // SMTP 인증 비밀번호 (환경 변수에서 가져옴)
  },
});

// 이메일 전송 함수 정의
const sendMail = async (email, subject, content) => {
  try {
    // 이메일 옵션 설정
    const mailOptions = {
      from: process.env.SMTP_MAIL, // 발신자 이메일 주소
      to: email, // 수신자 이메일 주소
      subject: subject, // 이메일 제목
      html: content, // 이메일 본문 (HTML 형식)
    };

    // 이메일 전송 및 결과 반환
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail has been sent", info.messageId); // 전송 성공 메시지 출력

    return {
      success: true, // 전송 성공 여부
      message: "Mail sent successfully", // 성공 메시지
      messageId: info.messageId, // 전송된 이메일의 고유 ID
    };
  } catch (error) {
    // 전송 실패 시 에러 메시지 출력 및 반환
    console.error("Failed to send email:", error.message);
    return {
      success: false, // 전송 실패 여부
      message: error.message, // 실패 메시지
    };
  }
};

// sendMail 함수 내보내기
module.exports = { sendMail };
