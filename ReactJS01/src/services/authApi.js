import axios from
"../util/axios.customize";

export const forgotPasswordApi =
(email) => {

    return axios.post(
        "/auth/forgot_password",
        {
            email
        }
    );
};

export const resetPasswordApi = (
    email,
    otp,
    newPassword
) => {

    return axios.post(
        "/auth/reset_password",
        {
            email,
            otp,
            newPassword
        }
    );
};