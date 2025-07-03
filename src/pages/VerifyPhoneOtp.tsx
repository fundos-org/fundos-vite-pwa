import { eRoutes } from "@/RoutesEnum";
import { FC, useState } from "react";
import { toast } from "react-hot-toast/headless";
import { useNavigate } from "react-router-dom";

const VerifyPhoneOTP: FC = () => {
    const navigate = useNavigate();
    const [otp, setOTP] = useState(['', '', '', '']);
    const phoneNumber = sessionStorage.getItem('phoneNumber') || '';
    const invitationCode = sessionStorage.getItem('invitationCode') || '';

    const handleOTPChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOTP = [...otp];
            newOTP[index] = value;
            setOTP(newOTP);

            if (value && index < 3) {
                const nextInput = document.getElementById(`phone-otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`phone-otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 4) {
            toast.error('Please enter complete 4-digit OTP');
            return;
        }

        try {
            const response = await fetch(
                `https://api.fundos.services/api/v0/test/user/phone/otp/verify?phone_number=${phoneNumber}&otp=${otpValue}&invite_code=${invitationCode}`
            );
            const data = await response.json();

            if (!data) {
                toast.error('Failed to verify OTP. Please try again.');
                return;
            }

            if (!data.success) {
                toast.error(data.message || 'Failed to verify OTP. Please try again.');
                return;
            }

            if (data.message) {
                toast.success(data.message);
            }

            if (data.success) {
                sessionStorage.setItem('userId', data?.user_id);
                sessionStorage.setItem('subAdminId', data?.subadmin_id);

                if (data.onboarding_status === 'Completed') {
                    toast.success('Welcome back! Redirecting to dashboard...');
                    navigate(eRoutes.DASHBOARD_HOME)
                } else {
                    toast.error('Please complete your email verification to continue');
                    navigate(eRoutes.EMAIL_AUTH);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to verify OTP. Please check your internet connection.');
        }
    };

    return (
        <>
            <div>
                <h1 className="mb-4 text-4xl font-bold">
                    Verify your number
                </h1>
                <p className="text-[#00ffcc] mb-8 leading-relaxed text-sm">
                    We have sent a verification code to your number +91-{phoneNumber}.
                </p>
                <div className="mb-8">
                    <label className="block mb-4 text-gray-200 text-sm">
                        Enter 4-digit verification code
                    </label>
                    <div className="flex gap-5 justify-between">
                        {otp.map((digit: string | number | readonly string[] | undefined, index: number) => (
                            <input
                                key={index}
                                id={`phone-otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={digit}
                                onChange={(e) => handleOTPChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength={1}
                                className="w-1/4 h-17 text-center text-lg border border-gray-700 bg-gray-700 text-white outline-none"
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            <button
                type="submit"
                disabled={otp.join('').length !== 4}
                onClick={handleSubmit}
                className={`w-full border-none py-4 px-8 text-base font-semibold transition-all duration-300 ${
                    otp.join('').length === 4
                        ? 'bg-[#00fb57] text-[#1a1a1a] cursor-pointer'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
                Verify
            </button>
        </>
    );
};

export default VerifyPhoneOTP;
