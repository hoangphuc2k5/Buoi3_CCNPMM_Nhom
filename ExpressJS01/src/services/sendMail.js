const nodemailer = require("nodemailer");

const transporter =
    nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

const sendOtpMail = async (
    email,
    otp
) => {

    await transporter.sendMail({
        from: `"Hệ thống" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Mã OTP đặt lại mật khẩu',
            html: `
                <h2>Mã OTP của bạn là:</h2>
                <h1 style="letter-spacing: 8px; color: #2563eb;">${otp}</h1>
                <p>Mã có hiệu lực trong <b>5 phút</b>.</p>
            `
    });
};

module.exports = sendOtpMail;