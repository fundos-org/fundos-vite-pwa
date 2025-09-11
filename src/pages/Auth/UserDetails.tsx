import api from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

const UserDetails = ({ onNext, onBack }: UserDetailsProps) => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    father_name: "",
    entity_type: "",
    pan_number: "",
    capital_commitment: "",
    resident: "",
    date_of_birth: "",
    tax_identity_number: "", // Add this field for backend compatibility
  });
  const [userId, setUserId] = useState("");

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";

    // If already in DD/MM/YYYY or DD-MM-YYYY format, return as is
    if (dateString.match(/^\d{2}[/-]\d{2}[/-]\d{4}$/)) {
      return dateString.replace(/-/g, "/");
    }

    // If in YYYY-MM-DD format, convert to DD/MM/YYYY
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }

    // Try to parse as a date and format
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedUserId = sessionStorage.getItem("userId");
      const storedPanNumber = sessionStorage.getItem("panNumber");
      
      if (storedUserId && storedPanNumber) {
        setUserId(storedUserId);

        api
          .get("/onboarding/zoho/details", {
            params: { pan_number: storedPanNumber }
          })
          .then(({ data }) => {
            if (data) {
              const profileData = {
                full_name: data.data.full_name || "",
                email: data.data.email || "",
                phone_number: data.data.phone_number || "",
                address: data.data.address || "",
                father_name: data.data.father_name || "",
                entity_type: data.data.entity_type || "",
                pan_number: data.data.pan_number || "",
                capital_commitment:
                  data.data.capital_commitment?.toString() || "",
                resident: data.data.resident || "",
                date_of_birth: formatDateForDisplay(
                  data.data.date_of_birth || ""
                ),
                tax_identity_number:
                  data.data.tax_identity_number || data.data.pan_number || "", // Use PAN as tax identity
              };

              setUserProfile(profileData);
            }
          })
          .catch((error) => {
            console.error("Error fetching user details from Zoho:", error);
            toast.error("Failed to fetch user details from Zoho");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        toast.error("User ID or PAN number not found. Please complete KYC first.");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSubmit = async () => {
    // Check for empty editable required fields (only address and father_name are editable)
    const editableRequiredFields = ["address", "father_name"];
    const emptyEditableFields = editableRequiredFields.filter(
      (field) => !userProfile[field as keyof typeof userProfile]
    );

    if (emptyEditableFields.length > 0) {
      toast.error("Please fill in the address and father's name fields.");
      return;
    }

    const updateableFields = {
      address: userProfile.address,
      father_name: userProfile.father_name,
    };

    try {
      await api.post("/onboarding/zoho/details/update", {
        user_id: userId,
        ...updateableFields,
      });
      toast.success("Details Updated successfully");
      onNext();
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Failed to update user details");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    { key: "full_name", label: "Full Name", type: "text", editable: false }, // Read-only - prefilled from KYCcd
    { key: "email", label: "Email", type: "email", editable: false }, // Read-only
    {
      key: "phone_number",
      label: "Phone Number",
      type: "tel",
      editable: false,
    }, // Read-only
    { key: "address", label: "Address", type: "textarea", editable: true }, // Editable
    {
      key: "father_name",
      label: "Father's Name",
      type: "text",
      editable: true,
    }, // Editable
    { key: "entity_type", label: "Entity Type", type: "text", editable: false }, // Read-only - prefilled from KYC
    { key: "pan_number", label: "PAN Number", type: "text", editable: false }, // Read-only
    {
      key: "capital_commitment",
      label: "Capital Commitment",
      type: "number",
      editable: false,
    }, // Read-only - prefilled from KYC
    { key: "resident", label: "Resident", type: "text", editable: false }, // Read-only - prefilled from KYC
    {
      key: "date_of_birth",
      label: "Date of Birth (DD/MM/YYYY)",
      type: "text",
      editable: false,
    }, // Read-only - prefilled from KYC
    // tax_identity_number is handled internally, not shown to users like in Android app
  ];

  return (
    <div className="flex-1 bg-white px-6 py-8 flex flex-col gap-4">
      <div className="flex-1">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="text-gray-600 text-2xl mr-4 hover:text-gray-800 transition-colors"
          >
            ←
          </button>
          <h1 className="text-3xl font-bold text-black">
            Review User Details
          </h1>
        </div>

        <p className="text-gray-500 mb-8 text-base">
          Review your KYC details. Only address and father's name can be edited.
          All other information is prefilled from your verification.
        </p>

        <div className="space-y-6">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-black font-medium mb-2 text-base">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={userProfile[field.key as keyof typeof userProfile]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  disabled={!field.editable}
                  placeholder={
                    field.editable ? `Enter ${field.label.toLowerCase()}` : ""
                  }
                  rows={3}
                  className={`w-full px-4 py-3 text-base border rounded-lg outline-none resize-vertical ${
                    field.editable
                      ? "border-gray-300 bg-white text-black cursor-text focus:border-[#4285F4] focus:ring-2 focus:ring-blue-100"
                      : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  }`}
                />
              ) : field.key === "phone_number" ? (
                <div className="flex">
                  <div className="flex items-center px-4 py-3 border border-gray-200 bg-gray-50 rounded-l-lg">
                    <span className="text-gray-700 text-base">+91</span>
                  </div>
                  <input
                    type={field.type}
                    value={userProfile[field.key as keyof typeof userProfile]}
                    disabled={!field.editable}
                    className="flex-1 px-4 py-3 text-base border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed rounded-r-lg outline-none"
                  />
                </div>
              ) : (
                <div className="relative">
                  <input
                    type={field.type}
                    value={userProfile[field.key as keyof typeof userProfile]}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    disabled={!field.editable}
                    placeholder={
                      field.editable ? `Enter ${field.label.toLowerCase()}` : ""
                    }
                    className={`w-full px-4 py-3 text-base border rounded-lg outline-none ${
                      field.editable
                        ? "border-gray-300 bg-white text-black cursor-text focus:border-[#4285F4] focus:ring-2 focus:ring-blue-100"
                        : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    }`}
                  />
                  {field.key === "date_of_birth" && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 px-8 text-base font-semibold rounded-lg transition-all duration-300 bg-[#4285F4] text-white cursor-pointer hover:bg-blue-600"
      >
        Continue
      </button>
    </div>
  );
};

export default UserDetails;
