import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { eRoutes } from "./RoutesEnum";
const PhoneNumber = lazy(() => import("./pages/PhoneNumber"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const VerifyPhoneOTP = lazy(() => import("./pages/VerifyPhoneOtp"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route
                    path="/" element={
                        <Layout>
                            <GetStarted />
                        </Layout>
                    }
                />
                <Route
                    path={eRoutes.GET_STARTED}
                    element={
                        <Layout>
                            <GetStarted />
                        </Layout>
                    }
                />
                <Route
                    path={eRoutes.PHONE_NUMBER}
                    element={
                        <Layout backRoute={eRoutes.GET_STARTED}>
                            <PhoneNumber />
                        </Layout>
                    }
                />
                <Route
                    path={eRoutes.VERIFY_PHONE_OTP}
                    element={
                        <Layout backRoute={eRoutes.PHONE_NUMBER}>
                            <VerifyPhoneOTP />
                        </Layout>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
};
export default AppRoutes;