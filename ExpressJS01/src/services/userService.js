require("dotenv").config();

const User = require("../models/user");
const Otp = require("../models/otp");

const bcrypt = require("bcrypt");

const sendOtpMail = require("./sendMail");

const saltRound = 10;

// gửi otp
const forgotPasswordService = async (
    email
) => {

    try {

        const user =
            await User.findOne({
                email
            });

        if (!user) {

            return {
                EC: 1,
                EM: "Email không tồn tại"
            };
        }

        // tạo otp
        const otp = Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();

        // xóa otp cũ
        await Otp.deleteMany({
            email
        });

        // lưu otp
        await Otp.create({
            email: email,
            otp: otp,

            expiresAt: new Date(
                Date.now()
                + 5 * 60 * 1000
            )
        });

        // gửi mail
        await sendOtpMail(
            email,
            otp
        );

        return {
            EC: 0,
            EM: "Gửi OTP thành công",
            email
        };

    } catch (error) {

        console.log(error);

        return {
            EC: -1,
            EM: "Server error"
        };
    }
};

// reset password
const resetPasswordService = async (
    email,
    otp,
    newPassword
) => {

    try {

        const otpData =
            await Otp.findOne({
                email,
                otp
            });

        if (!otpData) {

            return {
                EC: 1,
                EM: "OTP không đúng"
            };
        }

        // check hết hạn
        if (
            new Date()
            > otpData.expiresAt
        ) {

            return {
                EC: 2,
                EM: "OTP đã hết hạn"
            };
        }

        // hash password mới
        const hashPassword =
            await bcrypt.hash(
                newPassword,
                saltRound
            );

        // update password
        await User.findOneAndUpdate(
            { email },

            {
                password:
                    hashPassword
            }
        );

        // xóa otp
        await Otp.deleteMany({
            email
        });

        return {
            EC: 0,
            EM:
                "Đổi mật khẩu thành công"
        };

    } catch (error) {

        console.log(error);

        return {
            EC: -1,
            EM: "Server error"
        };
    }
};

module.exports = {
    forgotPasswordService,
    resetPasswordService
};