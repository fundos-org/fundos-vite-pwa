import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { eRoutes } from "./RoutesEnum";
const GetStarted = lazy(() => import("./pages/GetStarted"));
const PhoneNumber = lazy(() => import("./pages/PhoneNumber"));
const VerifyPhoneOTP = lazy(() => import("./pages/VerifyPhoneOtp"));
const EmailInput = lazy(() => import("./pages/Auth/EmailInput"));
const VerifyEmailOtp = lazy(() => import("./pages/Auth/VerifyEmailOtp"));
const ChooseInvestor = lazy(() => import("./pages/Auth/ChooseInvestor"));
const KycStart = lazy(() => import("./pages/Auth/KycStart"));
const AadhaarVerification = lazy(() => import("./pages/Auth/AadhaarVerification"));
const PanVerification = lazy(() => import("./pages/Auth/PanVerification"));
const BankVerification = lazy(() => import("./pages/Auth/BankVerification"));
const ProfessionalBackground = lazy(() => import("./pages/Auth/ProfessionalBackground"));
const UserDetails = lazy(() => import("./pages/Auth/UserDetails"));
const ContributionAgreement = lazy(() => import("./pages/Auth/ContributionAgreement"));
const UploadPhoto = lazy(() => import("./pages/Auth/UploadPhoto"));
const FinalApproval = lazy(() => import("./pages/Auth/FinalApproval"));
const Dashboard = lazy(() => import("./pages/Home/Dashboard"));
const DealDetails = lazy(() => import("./pages/DealInvestment/DealDetails"));
const CommitInvestment = lazy(() => import("./pages/DealInvestment/CommitInvestment"));
const TermSheet = lazy(() => import("./pages/DealInvestment/TermSheet"));

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
                    <Route path={eRoutes.PROFESSIONAL_BACKGROUND_AUTH} element={
                        <Layout backRoute={eRoutes.BANK_AUTH}>
                            <ProfessionalBackground />
                        </Layout>
                    } />
                    <Route path={eRoutes.USER_DETAILS_AUTH} element={
                        <Layout backRoute={eRoutes.PROFESSIONAL_BACKGROUND_AUTH}>
                            <UserDetails />
                        </Layout>
                    } />
                    <Route path={eRoutes.CONTRIBUTION_AGREEMENT_AUTH} element={
                        <Layout backRoute={eRoutes.USER_DETAILS_AUTH}>
                            <ContributionAgreement />
                        </Layout>
                    } />
                    <Route path={eRoutes.UPLOAD_PHOTO_AUTH} element={
                        <Layout backRoute={eRoutes.CONTRIBUTION_AGREEMENT_AUTH}>
                            <UploadPhoto />
                        </Layout>
                    } />
                    <Route path={eRoutes.FINAL_APPROVAL_AUTH} element={
                        <Layout backRoute={eRoutes.UPLOAD_PHOTO_AUTH}>
                            <FinalApproval />
                        </Layout>
                    } />
                </Route>
                <Route path={eRoutes.HOME}>
                    <Route path={eRoutes.DASHBOARD_HOME} element={
                        <Layout backRoute={eRoutes.PHONE_NUMBER}>
                            <Dashboard />
                        </Layout>
                    } />
                    <Route path={eRoutes.DEAL_DETAILS_HOME} element={
                        <Layout backRoute={eRoutes.DASHBOARD_HOME}>
                            <DealDetails />
                        </Layout>
                    } />
                    <Route path={eRoutes.COMMIT_INVESTMENT_HOME} element={
                        <Layout backRoute={eRoutes.DEAL_DETAILS_HOME}>
                            <CommitInvestment />
                        </Layout>
                    } />
                    <Route path={eRoutes.TERM_SHEET_HOME} element={
                        <Layout backRoute={eRoutes.COMMIT_INVESTMENT_HOME}>
                            <TermSheet />
                        </Layout>
                    } />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
};
export default AppRoutes;