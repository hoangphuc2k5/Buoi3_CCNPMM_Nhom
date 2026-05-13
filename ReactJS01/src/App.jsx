import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import ForgotPassword
from "./pages/forgotPassword";

import ResetPassword
from "./pages/resetPassword";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/forgot-password" />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<Navigate replace to="/forgot-password" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;