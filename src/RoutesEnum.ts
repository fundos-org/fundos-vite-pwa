export enum eRoutes {
    ROOT = "/",
    GET_STARTED = "/get-started",
    PHONE_NUMBER = "/phone-number",
    VERIFY_PHONE_OTP = "/verify-phone-otp",

    HOME = "/home",
    DASHBOARD_HOME = "/home/dashboard",
    DASHBOARD_PORTFOLIO = "/home/dashboard/portfolio",
    DASHBOARD_UPDATES = "/home/dashboard/updates",
    DASHBOARD_PROFILE = "/home/dashboard/profile",
    DEAL_DETAILS_HOME = "/home/deal-details",
    COMMIT_INVESTMENT_HOME = "/home/commit-investment",
    TERM_SHEET_HOME = "/home/term-sheet",
    DRAW_DOWN_NOTICE_HOME = "/home/draw-down-notice",

    AUTH = "/auth",
    EMAIL_AUTH = "/auth/email",
    EMAIL_VERIFY_AUTH = "/auth/email-verify",
    CHOOSE_INVESTOR_AUTH = "/auth/choose-investor",
    USERNAME_PASSWORD_AUTH = "/auth/username-password",
    COMPLETE_KYC_AUTH = "/auth/complete-kyc",
    AADHAAR_AUTH = "/auth/aadhaar",
    PAN_AUTH = "/auth/pan",
    BANK_AUTH = "/auth/bank",
    PROFESSIONAL_BACKGROUND_AUTH = "/auth/professional-background",
    USER_DETAILS_AUTH = "/auth/user-details",
    CONTRIBUTION_AGREEMENT_AUTH = "/auth/contribution-agreement",
    UPLOAD_PHOTO_AUTH = "/auth/upload-photo",
    FINAL_APPROVAL_AUTH = "/auth/final-approval",
    VERIFY_DETAILS_AUTH = "/auth/verify-details",
    PORTFOLIO = "/portfolio",
    PORTFOLIO_DETAIL = "/portfolio/:investmentId",
    MY_PROFILE = "/profile/me",
    TRANSACTIONS = "/profile/transactions",
    BANK_DETAILS = "/profile/bank-details"
}

// /term-sheet?dealId=${dealId}&investmentAmount=${investmentAmount}