export enum eRoutes {
    ROOT = "/",
    GET_STARTED = "/get-started",
    PHONE_NUMBER = "/phone-number",
    VERIFY_PHONE_OTP = "/verify-phone-otp",

    HOME = "/home",
    DASHBOARD_HOME = "/home/dashboard",
    DEAL_DETAILS_HOME = "/home/deal-details/:dealId",
    COMMIT_INVESTMENT_HOME = "/home/commit/:dealId",
    TERM_SHEET_HOME = "/home/term-sheet",
    DRAW_DOWN_NOTICE_HOME = "/home/draw-down-notice",

    AUTH = "/auth",
    EMAIL_AUTH = "/auth/email",
    EMAIL_VERIFY_AUTH = "/auth/email-verify",
    CHOOSE_INVESTOR_AUTH = "/auth/choose-investor",
    COMPLETE_KYC_AUTH = "/auth/complete-kyc",
    AADHAAR_AUTH = "/auth/aadhaar",
    PAN_AUTH = "/auth/pan",
    BANK_AUTH = "/auth/bank",
    PROFESSIONAL_BACKGROUND_AUTH = "/auth/professional-background",
    USER_DETAILS_AUTH = "/auth/user-details",
    CONTRIBUTION_AGREEMENT_AUTH = "/auth/contribution-agreement",
    UPLOAD_PHOTO_AUTH = "/auth/upload-photo",
    FINAL_APPROVAL_AUTH = "/auth/final-approval",
}

// /term-sheet?dealId=${dealId}&investmentAmount=${investmentAmount}