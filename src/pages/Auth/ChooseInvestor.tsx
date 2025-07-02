import { eRoutes } from '@/RoutesEnum';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ChooseInvestor = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const userId = localStorage.getItem('userId') || '';

    const investorOptions = [
        {
            value: 'individual',
            label: 'Individual Investor',
            description: "I'm investing as a person using my personal capital",
        },
    ];

    const handleNext = async () => {
        if (!selectedType) {
            toast.error('Please select an investor type');
            return;
        }

        if (!userId) {
            toast.error('User ID not found. Please login again.');
            return;
        }

        try {
            const response = await fetch('https://api.fundos.services/api/v0/test/user/choose-investor-type', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    investor_type: selectedType,
                    user_id: userId,
                }),
            });

            const data = await response.json();

            if (response.ok && data) {
                setShowModal(true);
            } else {
                toast.error('Failed to choose investor type. Please try again.');
            }
        } catch {
            toast.error('Failed to choose investor type. Please try again.');
        }
    };

    const handleDeclaration = async () => {
        if (!isChecked) {
            toast.error('Please confirm that you qualify as an Angel Investor before proceeding.');
            return;
        }

        try {
            const response = await fetch('https://api.fundos.services/api/v0/test/user/declaration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    declaration_accepted: isChecked,
                    user_id: userId,
                }),
            });

            const data = await response.json();

            if (response.ok && data) {
                if (data.message) {
                    toast.success(data.message);
                }
                setShowModal(false);
                navigate(eRoutes.COMPLETE_KYC_AUTH); // Assuming you have a Navigate function to redirect
            } else {
                toast.error('Failed to apply for declarations. Please try again.');
            }
        } catch {
            toast.error('Failed to apply for declarations. Please try again.');
        }
    };

    return (
        <>
            <div>
                <h1 className="mb-4 text-2xl font-bold">Choose Investor Type</h1>
                <p className="text-[#00fb57] mb-8 leading-relaxed text-sm">
                    Make sure you select a correct type.
                </p>

                <div className="mb-8">
                    {investorOptions.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => setSelectedType(option.value)}
                            className={`border-2 p-4 mb-4 cursor-pointer transition-all ${selectedType === option.value
                                ? 'border-[#00fb57] bg-[#00fb571a]'
                                : 'border-gray-700 bg-transparent'
                                }`}
                        >
                            <div className="flex items-center mb-2">
                                <div
                                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selectedType === option.value
                                        ? 'border-[#00fb57]'
                                        : 'border-gray-400'
                                        }`}
                                >
                                    {selectedType === option.value && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#00fb57]" />
                                    )}
                                </div>
                                <h3
                                    className={`m-0 text-base font-semibold ${selectedType === option.value ? 'text-[#00fb57]' : 'text-white'
                                        }`}
                                >
                                    {option.label}
                                </h3>
                            </div>
                            <p className="text-gray-400 m-0 text-sm ml-11">{option.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={() => navigate(eRoutes.COMPLETE_KYC_AUTH)}>test next</button>
            <button
                disabled={!selectedType}
                onClick={handleNext}
                className={`w-full py-4 text-base font-semibold border-none transition-all duration-150 ${selectedType
                    ? 'bg-[#00fb57] text-[#1a1a1a] cursor-pointer'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
            >
                Next
            </button>

            {/* Modal for Declaration */}
            {showModal && (
                <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[1000] h-screen w-screen text-white p-4 overflow-hidden box-border">
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-transparent border-none text-gray-400 text-2xl cursor-pointer absolute top-4 right-4 z-10"
                    >
                        ✕
                    </button>

                    <div className="flex-1 flex flex-col justify-center p-8 max-h-full overflow-y-auto w-full max-w-xl">
                        <h2 className="text-white mb-8 text-2xl font-bold">Declaration</h2>

                        <p className="text-gray-200 mb-6 leading-relaxed">
                            I am an individual investor who has net tangible assets of at least two crore rupees excluding value of my principal residence, and:
                        </p>

                        <div className="mb-8">
                            <p className="text-gray-200 my-2">
                                1. Have Early-Stage Investment Experience, or
                            </p>
                            <p className="text-gray-200 my-2">
                                2. Have Experience As A Serial Entrepreneur, or
                            </p>
                            <p className="text-gray-200 my-2">
                                3. Am A Senior Management Professional(s) With At Least Ten Years Of Experience.
                            </p>
                        </div>

                        <div
                            onClick={() => setIsChecked(!isChecked)}
                            className="flex items-start cursor-pointer mb-8 gap-3"
                        >
                            <div
                                className={`min-w-[22px] min-h-[22px] w-[22px] h-[22px] border-2 rounded-full flex items-center justify-center mt-[2px] flex-shrink-0 ${isChecked ? 'border-[#00fb57] bg-[#00fb57]' : 'border-gray-400 bg-transparent'
                                    }`}
                            >
                                {isChecked && <span className="text-[#1a1a1a] text-xs">✓</span>}
                            </div>
                            <div>
                                <span className="text-gray-200 leading-snug">
                                    I Confirm That I Qualify As An Angel Investor Based On The Above Condition(s)
                                    <span className="text-red-500">*</span>
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleDeclaration}
                            disabled={!isChecked}
                            className={`${isChecked
                                ? 'bg-[#00fb57] text-[#1a1a1a] cursor-pointer'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                } border-none py-4 px-8 text-base font-semibold w-full transition-all flex items-center justify-center gap-2`}
                        >
                            Agree and continue →
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChooseInvestor;
