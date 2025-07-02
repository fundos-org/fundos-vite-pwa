import { eRoutes } from "@/RoutesEnum";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        father_name: '',
        entity_type: '',
        pan_number: '',
        capital_commitment: '',
        resident: '',
        date_of_birth: '',
        tax_identity_number: '' // Add this field for backend compatibility
    });
    const [originalProfile, setOriginalProfile] = useState({
        address: '',
        father_name: ''
    });
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
                try {
                    const response = await fetch(`https://api.fundos.services/api/v0/test/user/details?user_id=${storedUserId}`);
                    const data = await response.json();

                    if (data.success) {
                        // Function to format date from various formats to DD/MM/YYYY for display
                        const formatDateForDisplay = (dateString: string) => {
                            if (!dateString) return '';

                            // If already in DD/MM/YYYY or DD-MM-YYYY format, return as is
                            if (dateString.match(/^\d{2}[/-]\d{2}[/-]\d{4}$/)) {
                                return dateString.replace(/-/g, '/');
                            }

                            // If in YYYY-MM-DD format, convert to DD/MM/YYYY
                            if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                const [year, month, day] = dateString.split('-');
                                return `${day}/${month}/${year}`;
                            }

                            // Try to parse as a date and format
                            try {
                                const date = new Date(dateString);
                                const day = date.getDate().toString().padStart(2, '0');
                                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                const year = date.getFullYear();
                                return `${day}/${month}/${year}`;
                            } catch {
                                return dateString; // Return original if parsing fails
                            }
                        };

                        const profileData = {
                            full_name: data.data.full_name || '',
                            email: data.data.email || '',
                            phone_number: data.data.phone_number || '',
                            address: data.data.address || '',
                            father_name: data.data.father_name || '',
                            entity_type: data.data.entity_type || '',
                            pan_number: data.data.pan_number || '',
                            capital_commitment: data.data.capital_commitment?.toString() || '',
                            resident: data.data.resident || '',
                            date_of_birth: formatDateForDisplay(data.data.date_of_birth || ''),
                            tax_identity_number: data.data.tax_identity_number || data.data.pan_number || '' // Use PAN as tax identity
                        };

                        setUserProfile(profileData);
                        // Store original editable values for comparison
                        setOriginalProfile({
                            address: profileData.address,
                            father_name: profileData.father_name
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserDetails();
    }, []);

    const handleSubmit = async () => {

        // Check for empty editable required fields (only address and father_name are editable)
        const editableRequiredFields = ['address', 'father_name'];
        const emptyEditableFields = editableRequiredFields.filter(field => !userProfile[field as keyof typeof userProfile]);

        if (emptyEditableFields.length > 0) {
            toast.error('Please fill in the address and father\'s name fields.');
            return;
        }

        try {
            // Only send editable fields for update (address and father_name)
            const updateableFields = {
                address: userProfile.address,
                father_name: userProfile.father_name
            };

            const response = await fetch('https://api.fundos.services/api/v0/test/user/details/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    ...updateableFields
                }),
            });
            const data = await response.json();

            if (data.success || response.ok) {
                toast.success('Details Updated successfully');
                navigate(eRoutes.CONTRIBUTION_AGREEMENT_AUTH);
            } else {
                toast.error('Failed to update user details');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update user details');
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setUserProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Check if user made changes to editable fields
    const hasChanges = () => {
        return userProfile.address !== originalProfile.address ||
            userProfile.father_name !== originalProfile.father_name;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#374151] border-t-[#00fb57] rounded-full animate-spin mx-auto mb-5"></div>
                    <h2 className="text-4xl font-medium text-[#FDFDFD]">
                        Please Wait...
                    </h2>
                </div>
            </div>
        );
    }

    const fields = [
        { key: 'full_name', label: 'Full Name', type: 'text', editable: false }, // Read-only - prefilled from KYCcd
        { key: 'email', label: 'Email', type: 'email', editable: false }, // Read-only
        { key: 'phone_number', label: 'Phone Number', type: 'tel', editable: false }, // Read-only
        { key: 'address', label: 'Address', type: 'textarea', editable: true }, // Editable
        { key: 'father_name', label: "Father's Name", type: 'text', editable: true }, // Editable
        { key: 'entity_type', label: 'Entity Type', type: 'text', editable: false }, // Read-only - prefilled from KYC
        { key: 'pan_number', label: 'PAN Number', type: 'text', editable: false }, // Read-only
        { key: 'capital_commitment', label: 'Capital Commitment', type: 'number', editable: false }, // Read-only - prefilled from KYC
        { key: 'resident', label: 'Resident', type: 'text', editable: false }, // Read-only - prefilled from KYC
        { key: 'date_of_birth', label: 'Date of Birth (DD/MM/YYYY)', type: 'text', editable: false } // Read-only - prefilled from KYC
        // tax_identity_number is handled internally, not shown to users like in Android app
    ];

    return (

        <>
            <div>
                <h1 className="text-white text-4xl font-bold mb-2.5">
                    User Details
                </h1>

                <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                    Review your KYC details. Only address and father's name can be edited. All other information is prefilled from your verification.
                </p>

                {fields.map((field) => (
                    <div key={field.key} className="mb-4">
                        <label className="block mb-2 text-gray-200 text-sm">
                            {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                            <textarea
                                value={userProfile[field.key as keyof typeof userProfile]}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                disabled={!field.editable}
                                placeholder={field.editable ? `Enter ${field.label.toLowerCase()}` : ''}
                                rows={3}
                                className={`
                                    w-full p-3 text-base 
                                    ${field.editable
                                        ? 'border border-gray-700 bg-gray-700 text-white cursor-text'
                                        : 'border border-gray-600 bg-gray-600 text-gray-400 cursor-not-allowed'}
                                    outline-none resize-vertical
                                `}
                            />
                        ) : (
                            <input
                                type={field.type}
                                value={userProfile[field.key as keyof typeof userProfile]}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                disabled={!field.editable}
                                placeholder={field.editable ? `Enter ${field.label.toLowerCase()}` : ''}
                                className={`
                                    w-full p-3 text-base 
                                    ${field.editable
                                        ? 'border border-gray-700 bg-gray-700 text-white cursor-text'
                                        : 'border border-gray-600 bg-gray-600 text-gray-400 cursor-not-allowed'}
                                    outline-none
                                `}
                            />
                        )}
                    </div>
                ))}
            </div>
            
            <button
                type="submit"
                onClick={handleSubmit}
                className={`
                    bg-[#00fb57] text-[#1a1a1a] border-none py-4 px-8 text-base font-semibold 
                    cursor-pointer w-full mt-4 transition-all duration-300 ease-in-out
                `}
            >
                {hasChanges() ? 'Update Details' : 'Next'}
            </button>
        </>
    );
};

export default UserDetails;