import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfessionalBackground = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    occupation: "",
    income_source: "",
    annual_income: "",
    capital_commitment: "",
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking on dropdown button or option
      if (openDropdown && !target.closest("[data-dropdown]")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const options = {
    occupation: [
      { label: "Founder", value: "founder" },
      { label: "Employee", value: "employee" },
      { label: "Self-employed", value: "self_employed" },
      { label: "Other", value: "other" },
    ],
    income_source: [
      { label: "Business", value: "business" },
      { label: "Salary", value: "salary" },
      { label: "Investments", value: "investments" },
      { label: "Other", value: "other" },
    ],
    annual_income: [
      { label: "25L - 50L", value: "2500000" },
      { label: "50L - 1Cr", value: "5000000" },
      { label: "1Cr - 5Cr", value: "10000000" },
      { label: ">5Cr", value: "50000000" },
    ],
    capital_commitment: [
      { label: "25L - 50L", value: "2500000" },
      { label: "50L - 1Cr", value: "5000000" },
      { label: "1Cr - 5Cr", value: "10000000" },
      { label: ">5Cr", value: "50000000" },
    ],
  };

  const handleSubmit = async () => {
    if (
      !formData.occupation ||
      !formData.income_source ||
      !formData.annual_income ||
      !formData.capital_commitment
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    api
      .post("/onboarding/onboarding/professional-background", {
        occupation: formData.occupation,
        income_source: formData.income_source,
        annual_income: parseInt(formData.annual_income),
        capital_commitment: parseInt(formData.capital_commitment),
      })
      .then(({ data }) => {
        sessionStorage.setItem(
          "professionalBackground",
          JSON.stringify(formData)
        );
        toast.success(
          data.message || "Professional background submitted successfully!"
        );
        navigate(eRoutes.USER_DETAILS_AUTH);
      })
      .catch((error) => {
        console.error("Error submitting professional background:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to submit professional background. Please try again."
        );
      });
  };

  const renderDropdown = (name: keyof typeof options, label: string) => {
    const isOpen = openDropdown === name;
    const selectedOption = options[name].find(
      (opt) => opt.value === formData[name]
    );

    const handleOptionSelect = (value: string) => {
      setFormData({ ...formData, [name]: value });
      setOpenDropdown(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpenDropdown(isOpen ? null : name);
      } else if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    return (
      <div className="mb-6 relative" data-dropdown>
        <label className="block text-gray-400 mb-2 text-sm">{label}</label>
        <div className="relative" data-dropdown>
          {/* Custom Dropdown Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(isOpen ? null : name);
            }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            className={`
          w-full py-4 px-6 text-base border border-gray-700 bg-gray-700
          ${selectedOption ? "text-white" : "text-gray-400"}
          outline-none cursor-pointer text-left flex items-center justify-between
        `}
          >
            <span>{selectedOption ? selectedOption.label : `${label}`}</span>
            <span
              className={`
            text-gray-400 text-base transition-transform duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
            >
              ▼
            </span>
          </button>

          {/* Custom Dropdown Options */}
          {isOpen && (
            <div
              className="
            absolute top-full left-0 right-0 z-50 bg-gray-700 border border-gray-600 mt-1 max-h-52 overflow-y-auto shadow-lg
          "
              data-dropdown
            >
              {options[name].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionSelect(option.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOptionSelect(option.value);
                    }
                  }}
                  className={`
              w-full py-3 px-4 text-base text-left border-none cursor-pointer
              transition-colors duration-200
              ${
                formData[name] === option.value
                  ? "bg-gray-600 text-white"
                  : "bg-transparent text-white hover:bg-gray-600"
              }
            `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div>
        <h1 className="text-white text-4xl font-bold mb-2.5">
          Professional Background
        </h1>

        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Share your occupation details to help us better understand your
          background
        </p>

        {renderDropdown("occupation", "Occupation")}
        {renderDropdown("income_source", "Income Source")}
        {renderDropdown("annual_income", "Annual Income")}
        {renderDropdown(
          "capital_commitment",
          "Capital Commitment (Over 5 Years)"
        )}
      </div>
      {/* <button onClick={() => navigate(eRoutes.USER_DETAILS_AUTH)}>test next</button> */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={
          !formData.occupation ||
          !formData.income_source ||
          !formData.annual_income ||
          !formData.capital_commitment
        }
        className={`w-full py-4 px-8 text-base font-semibold transition-all duration-300
                    ${
                      formData.occupation &&
                      formData.income_source &&
                      formData.annual_income &&
                      formData.capital_commitment
                        ? "bg-[#00fb57] text-[#1a1a1a] cursor-pointer"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }
                `}
      >
        Next
      </button>
    </div>
  );
};

export default ProfessionalBackground;
