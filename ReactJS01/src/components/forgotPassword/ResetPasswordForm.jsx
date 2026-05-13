import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setMessage } from "../../Redux/forgotPasswordSlice"; // sửa chữ hoa R
import { resetPasswordApi } from "../../services/authApi";

const ResetPasswordForm = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialEmail = searchParams.get("email") || "";

    const dispatch = useDispatch();
    const { loading, message } = useSelector((state) => state.forgotPassword);
    const [status, setStatus] = useState("");
    const [formData, setFormData] = useState({
        email: initialEmail,
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            dispatch(setMessage("Mật khẩu xác nhận không khớp"));
            setStatus("error");
            return;
        }
        try {
            setStatus("");
            dispatch(setLoading(true));
            const response = await resetPasswordApi(
                formData.email,
                formData.otp,
                formData.newPassword
            );
            dispatch(setMessage(response.EM)); // bỏ .data
            setStatus(response.EC === 0 ? "success" : "error"); // bỏ .data
        } catch (error) {
            console.error(error);
            dispatch(setMessage("Có lỗi xảy ra"));
            setStatus("error");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg rounded-[32px] bg-white p-8 shadow-[0_28px_60px_-30px_rgba(15,23,42,0.4)] ring-1 ring-slate-200">
                <div className="mb-8 text-center">
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                        Đặt lại mật khẩu
                    </span>
                    <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
                        Nhập thông tin để reset mật khẩu
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        Điền email, mã OTP và mật khẩu mới để hoàn tất thay đổi.
                    </p>
                </div>

                {message && (
                    <div className={`mb-6 mx-auto max-w-xl rounded-3xl border px-4 py-4 text-sm font-medium text-center ring-1 ${
                        status === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800 ring-emerald-200"
                            : "border-rose-200 bg-rose-50 text-rose-800 ring-rose-200"
                    }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Email</span>
                        <input type="email" name="email" placeholder="Nhập email"
                            value={formData.email} onChange={handleChange}
                            className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Mã OTP</span>
                        <input type="text" name="otp" placeholder="Nhập OTP"
                            value={formData.otp} onChange={handleChange}
                            className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Mật khẩu mới</span>
                        <input type="password" name="newPassword" placeholder="Mật khẩu mới"
                            value={formData.newPassword} onChange={handleChange}
                            className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Xác nhận mật khẩu</span>
                        <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu"
                            value={formData.confirmPassword} onChange={handleChange}
                            className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </label>
                    <button type="submit" disabled={loading}
                        className="flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-400"
                    >
                        {loading ? "Đang xử lý..." : "Reset mật khẩu"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;