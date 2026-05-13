import { useState } from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    useNavigate
} from "react-router-dom";

import {
    setLoading,
    setMessage
} from "../../redux/forgotPasswordSlice";

import {
    forgotPasswordApi
} from "../../services/authApi";

const ForgotPasswordForm = () => {

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [sentEmail, setSentEmail] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        loading,
        message
    } = useSelector((state) => state.forgotPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        setSentEmail("");

        try {
            dispatch(setLoading(true));
            const response = await forgotPasswordApi(email);
            dispatch(setMessage(response.data.EM));

            if (response.data.EC === 0) {
                setStatus("success");
                setSentEmail(response.data.email || email);
            } else {
                setStatus("error");
            }
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
                    <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
                        Quên mật khẩu
                    </span>
                    <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
                        Gửi mã OTP về email của bạn
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        Nhập email để nhận mã đặt lại mật khẩu. Kiểm tra hộp thư đến hoặc thư mục spam.
                    </p>
                </div>

                {message && (
                    <div
                        className={`mb-6 mx-auto max-w-xl rounded-3xl border px-4 py-4 text-sm font-medium text-center ring-1 ${
                            status === "success"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800 ring-emerald-200"
                                : "border-rose-200 bg-rose-50 text-rose-800 ring-rose-200"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Email</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:bg-slate-400"
                    >
                        {loading ? "Đang gửi..." : "Gửi mã OTP"}
                    </button>
                </form>

                {status === "success" && sentEmail && (
                    <button
                        type="button"
                        onClick={() => navigate(`/reset-password?email=${encodeURIComponent(sentEmail)}`)}
                        className="mt-4 w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Sang trang reset mật khẩu
                    </button>
                )}
            </div>
        </div>
    );
};

export default
ForgotPasswordForm;