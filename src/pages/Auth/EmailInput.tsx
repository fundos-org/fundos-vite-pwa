import { eRoutes } from "@/RoutesEnum";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EmailInput = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
        if (!isValidEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const response = await fetch('https://api.fundos.services/api/v0/test/user/email/otp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('email', email);
                window.history.pushState({}, '', '/verify-email-otp');
                window.location.reload();
            } else {
                toast.error(data.message || 'Failed to send OTP to email. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to send OTP. Please check your internet connection.');
        }
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <>
            <div>
                <h1 className="mb-2 text-4xl font-bold">
                    Enter your mail ✉️
                </h1>
                <p className="text-[#00ffcc] mb-8 leading-relaxed text-sm">
                    Make sure it's one you check regularly.
                </p>
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full p-4 text-base border border-gray-700 bg-gray-700 text-white"
                    />
                </div>
            </div>

            <button onClick={() => navigate(eRoutes.EMAIL_VERIFY_AUTH)}>Test Next</button>
            <button
                type="submit"
                onClick={handleSubmit}
                disabled={!isValidEmail(email)}
                className={`w-full py-4 text-base font-semibold border-none transition-all duration-300 ${isValidEmail(email)
                        ? 'bg-[#00fb57] text-[#1a1a1a] cursor-pointer'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
            >
                Next
            </button>
        </>
    );
};

export default EmailInput;
