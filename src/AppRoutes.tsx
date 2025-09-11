import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { eRoutes } from "./RoutesEnum";
import InvestmentDetail from "./pages/Home/InvestmentDetail";
import BankDetails from "./pages/Profile/BankDetails";
import NotificationsSettings from "./pages/Home/NotificationsSettings";
const GetStarted = lazy(() => import("./pages/GetStarted"));
const PhoneNumber = lazy(() => import("./pages/PhoneNumber"));
const VerifyPhoneOTP = lazy(() => import("./pages/VerifyPhoneOtp"));
const EmailInput = lazy(() => import("./pages/Auth/EmailInput"));
const UsernamePassword = lazy(() => import("./pages/Auth/UsernamePassword"));
const ChooseInvestor = lazy(() => import("./pages/Auth/ChooseInvestor"));
const KycStart = lazy(() => import("./pages/Auth/KycStart"));
const KYC = lazy(() => import("./pages/Auth/KYC"));
const AadhaarVerification = lazy(
  () => import("./pages/Auth/AadhaarVerification")
);
const PanVerification = lazy(() => import("./pages/Auth/PanVerification"));
const BankVerification = lazy(() => import("./pages/Auth/BankVerification"));
const ProfessionalBackground = lazy(
  () => import("./pages/Auth/ProfessionalBackground")
);

const UploadPhoto = lazy(() => import("./pages/Auth/UploadPhoto"));
const FinalApproval = lazy(() => import("./pages/Auth/FinalApproval"));
const Dashboard = lazy(() => import("./pages/Home/Dashboard"));
const Home = lazy(() => import("./pages/Home/Home"));
const DashboardHome = lazy(() => import("./pages/Home/DashboardHome"));
const Portfolio = lazy(() => import("./pages/Home/Portfolio"));
const Updates = lazy(() => import("./pages/Home/Updates"));
const Profile = lazy(() => import("./pages/Home/Profile"));
const DealDetails = lazy(() => import("./pages/DealInvestment/DealDetails"));
const CommitInvestment = lazy(
  () => import("./pages/DealInvestment/CommitInvestment")
);
const TermSheet = lazy(() => import("./pages/DealInvestment/TermSheet"));
const DrawDown = lazy(() => import("./pages/DealInvestment/DrawDown"));
const MyProfile = lazy(() => import("./pages/Home/MyProfile"));
const Transactions = lazy(() => import("./pages/Transactions/Transactions"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
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
            <Layout>
              <PhoneNumber />
            </Layout>
          }
        />
        <Route
          path={eRoutes.VERIFY_PHONE_OTP}
          element={
            <Layout>
              <VerifyPhoneOTP />
            </Layout>
          }
        />
        <Route path={eRoutes.AUTH}>
          <Route
            path={eRoutes.EMAIL_AUTH}
            element={
              <Layout backRoute={eRoutes.VERIFY_PHONE_OTP}>
                <EmailInput />
              </Layout>
            }
          />

          <Route
            path={eRoutes.CHOOSE_INVESTOR_AUTH}
            element={
              <Layout>
                <ChooseInvestor />
              </Layout>
            }
          />
          <Route
            path={eRoutes.USERNAME_PASSWORD_AUTH}
            element={
              <Layout backRoute={eRoutes.PHONE_NUMBER}>
                <UsernamePassword />
              </Layout>
            }
          />
          <Route
            path={eRoutes.COMPLETE_KYC_AUTH}
            element={
              <Layout backRoute={eRoutes.CHOOSE_INVESTOR_AUTH}>
                <KycStart />
              </Layout>
            }
          />
          <Route
            path={eRoutes.KYC_AUTH}
            element={
              <Layout>
                <KYC />
              </Layout>
            }
          />
          <Route
            path={eRoutes.AADHAAR_AUTH}
            element={
              <Layout backRoute={eRoutes.CHOOSE_INVESTOR_AUTH}>
                <AadhaarVerification />
              </Layout>
            }
          />
          <Route
            path={eRoutes.PAN_AUTH}
            element={
              <Layout backRoute={eRoutes.CHOOSE_INVESTOR_AUTH}>
                <PanVerification />
              </Layout>
            }
          />
          <Route
            path={eRoutes.BANK_AUTH}
            element={
              <Layout backRoute={eRoutes.PAN_AUTH}>
                <BankVerification />
              </Layout>
            }
          />
          <Route
            path={eRoutes.PROFESSIONAL_BACKGROUND_AUTH}
            element={
              <Layout>
                <ProfessionalBackground />
              </Layout>
            }
          />

          <Route
            path={eRoutes.KYC_AUTH}
            element={
              <Layout>
                <KYC />
              </Layout>
            }
          />
          <Route
            path={eRoutes.UPLOAD_PHOTO_AUTH}
            element={
              <Layout>
                <UploadPhoto />
              </Layout>
            }
          />
          <Route
            path={eRoutes.FINAL_APPROVAL_AUTH}
            element={
              <Layout>
                <FinalApproval />
              </Layout>
            }
          />
        </Route>
        <Route path={eRoutes.HOME}>
          <Route
            path={eRoutes.DASHBOARD_HOME}
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="deals" element={<Home />} />
            <Route path="updates" element={<Updates />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="deals/:dealId" // This now contains the :dealId parameter
              element={<DealDetails />}
            />
            <Route path="deals/:dealId/commit" element={<CommitInvestment />} />
            <Route
              path="portfolio/:investmentId"
              element={<InvestmentDetail />}
            />
            <Route path="profile/me" element={<MyProfile />} />
            <Route path="profile/transactions" element={<Transactions />} />
            <Route path="profile/bank-details" element={<BankDetails />} />
            <Route
              path="profile/notifications-settings"
              element={<NotificationsSettings />}
            />
          </Route>
          <Route
            path={eRoutes.TERM_SHEET_HOME}
            element={
              <Layout>
                <TermSheet />
              </Layout>
            }
          />
          <Route path={eRoutes.DRAW_DOWN_NOTICE_HOME} element={<DrawDown />} />
        </Route>
        <Route path="*" element={<Navigate to="/home/dashboard" />} />
      </Routes>
    </Suspense>
  );
};
export default AppRoutes;
