require("dotenv").config();
const User = require("../models/user");
const Otp = require("../models/otp"); // ++ thêm từ file trên
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtpMail = require("./sendMail"); // ++ thêm từ file trên
const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      console.log(`>>> user exist, chon 1 email khac: ${email}`);
      return null;
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);
    let result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "User",
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginService = async (email1, password) => {
  try {
    const user = await User.findOne({ email: email1 });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "Email/Password khong hop le",
        };
      } else {
        const payload = {
          _id: user._id,
          email: user.email,
          name: user.name,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          EC: 0,
          access_token,
          user: {
            email: user.email,
            name: user.name,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password khong hop le",
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserService = async () => {
  try {
    let result = await User.find({}).select("-password");
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getProfileService = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return {
        EC: 1,
        EM: "User not found",
      };
    }
    return {
      EC: 0,
      data: user,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: "Error fetching profile",
    };
  }
};

const updateProfileService = async (userId, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");
    if (!user) {
      return {
        EC: 1,
        EM: "User not found",
      };
    }
    return {
      EC: 0,
      EM: "Profile updated successfully",
      data: user,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: "Error updating profile",
    };
  }
};

// ++ thay thế forgotPasswordService cũ bằng logic OTP đầy đủ từ file trên
const forgotPasswordService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        EC: 1,
        EM: "Email không tồn tại",
      };
    }

    // tạo otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // xóa otp cũ
    await Otp.deleteMany({ email });

    // lưu otp mới kèm thời gian hết hạn 5 phút
    await Otp.create({
      email: email,
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // gửi mail
    await sendOtpMail(email, otp);

    return {
      EC: 0,
      EM: "Gửi OTP thành công",
      email,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Server error",
    };
  }
};

// ++ thêm resetPasswordService từ file trên
const resetPasswordService = async (email, otp, newPassword) => {
  try {
    const otpData = await Otp.findOne({ email, otp });
    if (!otpData) {
      return {
        EC: 1,
        EM: "OTP không đúng",
      };
    }

    // check hết hạn
    if (new Date() > otpData.expiresAt) {
      return {
        EC: 2,
        EM: "OTP đã hết hạn",
      };
    }

    // hash password mới
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);

    // update password
    await User.findOneAndUpdate({ email }, { password: hashPassword });

    // xóa otp
    await Otp.deleteMany({ email });

    return {
      EC: 0,
      EM: "Đổi mật khẩu thành công",
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Server error",
    };
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  getProfileService,
  updateProfileService,
  forgotPasswordService,
  resetPasswordService, // ++ export thêm
};