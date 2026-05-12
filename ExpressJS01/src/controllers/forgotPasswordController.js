const {

    forgotPasswordService,
    resetPasswordService

} = require(
    "../services/userService"
);

// gửi otp
const forgotPassword = async (
    req,
    res
) => {

    const { email } = req.body;

    let result =
        await forgotPasswordService(
            email
        );

    return res.status(200).json(
        result
    );
};

// reset password
const resetPassword = async (
    req,
    res
) => {

    const {
        email,
        otp,
        newPassword
    } = req.body;

    let result =
        await resetPasswordService(
            email,
            otp,
            newPassword
        );

    return res.status(200).json(
        result
    );
};

module.exports = {
    forgotPassword,
    resetPassword
};