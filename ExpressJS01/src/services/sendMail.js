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
        from: process.env.EMAIL_USER,

        to: email,

        subject: "Forgot Password OTP",

        html: `
            <h2>Mã OTP của bạn</h2>
            <h1>${otp}</h1>
            <p>OTP có hiệu lực trong 5 phút</p>
        `
    });
};

module.exports = sendOtpMail;