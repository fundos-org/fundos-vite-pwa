import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { eRoutes } from "./RoutesEnum";
const GetStarted = lazy(() => import("./pages/GetStarted"));
const PhoneNumber = lazy(() => import("./pages/PhoneNumber"));
const VerifyPhoneOTP = lazy(() => import("./pages/VerifyPhoneOtp"));
const EmailInput = lazy(() => import("./pages/EmailInput"));
const VerifyEmailOtp = lazy(() => import("./pages/VerifyEmailOtp"));
const ChooseInvestor = lazy(() => import("./pages/ChooseInvestor"));
const KycStart = lazy(() => import("./pages/KycStart"));
const AadhaarVerification = lazy(() => import("./pages/AadhaarVerification"));
const PanVerification = lazy(() => import("./pages/PanVerification"));
const BankVerification = lazy(() => import("./pages/BankVerification"));

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
                <Route path={eRoutes.AUTH}>
                    <Route path={eRoutes.EMAIL_AUTH} element={
                        <Layout backRoute={eRoutes.VERIFY_PHONE_OTP}>
                            <EmailInput />
                        </Layout>
                    } />
                    <Route path={eRoutes.EMAIL_VERIFY_AUTH} element={
                        <Layout backRoute={eRoutes.EMAIL_AUTH}>
                            <VerifyEmailOtp />
                        </Layout>
                    } />
                    <Route path={eRoutes.CHOOSE_INVESTOR_AUTH} element={
                        <Layout backRoute={eRoutes.EMAIL_VERIFY_AUTH}>
                            <ChooseInvestor />
                        </Layout>
                    } />
                    <Route path={eRoutes.COMPLETE_KYC_AUTH} element={
                        <Layout backRoute={eRoutes.CHOOSE_INVESTOR_AUTH}>
                            <KycStart />
                        </Layout>
                    } />
                    <Route path={eRoutes.AADHAAR_AUTH} element={
                        <Layout backRoute={eRoutes.CHOOSE_INVESTOR_AUTH}>
                            <AadhaarVerification />
                        </Layout>
                    } />
                    <Route path={eRoutes.PAN_AUTH} element={
                        <Layout backRoute={eRoutes.AADHAAR_AUTH}>
                            <PanVerification />
                        </Layout>
                    } />
                    <Route path={eRoutes.BANK_AUTH} element={
                        <Layout backRoute={eRoutes.PAN_AUTH}>
                            <BankVerification />
                        </Layout>
                    } />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
};
export default AppRoutes;