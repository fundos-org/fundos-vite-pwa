import { eRoutes } from "@/RoutesEnum";
import { useState } from "react";
import { toast } from "react-hot-toast/headless";
import { useNavigate } from "react-router-dom";

const VerifyEmailOtp = () => {
    const navigate = useNavigate();
    const [otp, setOTP] = useState(['', '', '', '', '', '']);
    const email = sessionStorage.getItem('email') || '';
    const userId = sessionStorage.getItem('userId') || '';

    const handleOTPChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOTP = [...otp];
            newOTP[index] = value;
            setOTP(newOTP);

            if (value && index < 5) {
                const nextInput = document.getElementById(`email-otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`email-otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            toast.error('Please enter complete 6-digit OTP');
            return;
        }

        try {
            const response = await fetch('https://api.fundos.services/api/v0/test/user/email/otp/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    email: email,
                    otp: otpValue,
                }),
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Email Verified Successfully');
                navigate(eRoutes.CHOOSE_INVESTOR_AUTH);
            } else {
                toast.error('Failed to verify OTP. Please try again.');
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
                    Verify your Email
                </h1>

                <p className="text-[#00ffcc] mb-8 leading-relaxed text-sm">
                    We have sent a verification code to your email.
                </p>

                <div className="mb-8">
                    <label className="block mb-4 text-gray-200 text-sm">
                        Enter 6-digit verification code
                    </label>
                    <div className="flex gap-2 justify-start">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`email-otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={digit}
                                onChange={(e) => handleOTPChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength={1}
                                className="w-12 h-12 text-center text-lg border border-gray-700 bg-gray-700 text-white outline-none"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                onClick={handleSubmit}
                disabled={otp.join('').length !== 6}
                className={`w-full flex items-center justify-center gap-2 font-semibold transition-all duration-300 px-8 py-4 text-base ${otp.join('').length === 6
                    ? 'bg-[#00fb57] text-[#1a1a1a] cursor-pointer'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
            >
                Verify →
            </button>
        </>

    );
};

export default VerifyEmailOtp;
