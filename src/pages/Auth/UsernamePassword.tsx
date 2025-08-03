import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type InputsConfig = {
  name: string;
  type: string;
  placeholder: string;
};

const inputsConfig: InputsConfig[] = [
  {
    name: "username",
    type: "text",
    placeholder: "Enter your username",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Enter your password",
  },
  {
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
  },
];

const UsernamePassword = () => {
  const navigate = useNavigate();

  const [userInputs, setUserInputs] = useState<{
    username: string;
    password: string;
    confirmPassword: string;
  }>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({ ...prev, [name]: value }));
  };

  const isInvalidPassword = (): boolean => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return !passwordRegex.test(userInputs.password);
  };

  const handleSubmit = () => {
    if (isInvalidPassword())
      return toast.error(
        "Invalid password format, password should contain at least 8 characters, including 1 capital letter, 1 special character, and one number"
      );

    if (!areBothPasswordSame) return toast.error("Passwords do not match");

    // Proceed to next step if needed

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please try again.");
      return;
    }

    api
      .post(
        "/onboarding/onboarding/create-credentials",
        {},
        {
          params: {
            user_id: userId,
            username: userInputs.username,
            password: userInputs.password,
          },
        }
      )
      .then(({ data }) => {
        if (data.success) {
          sessionStorage.setItem("username", userInputs.username);

          localStorage.setItem("accessToken", data.access_token);
          localStorage.setItem("refreshToken", data.refresh_token);

          toast.success("Credentials created successfully!");
          navigate(eRoutes.EMAIL_AUTH);
        } else {
          toast.error(
            data.message || "Failed to create credentials. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error("Error creating credentials:", error);
        toast.error(
          error?.response?.data?.detail || "Failed to create credentials. Please check your internet connection."
        );
      });
  };

  const areBothPasswordSame =
    userInputs.password === userInputs.confirmPassword;

  const disableSubmission = !areBothPasswordSame || isInvalidPassword();

  const handleCheckboxToggle = () => setShowPassword((prev) => !prev);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div className="flex flex-col gap-4">
        <h1 className="mb-2 text-4xl font-bold">
          Enter desired username and password
        </h1>
        <p className="text-[#00ffcc] mb-8 leading-relaxed text-sm">
          Make sure you remember them. Password should contain at least 8
          characters, including 1 capital letter, 1 special character and one
          number
        </p>

        {inputsConfig.map((input) => (
          <div key={input.name}>
            <input
              type={
                input.type === "password" && showPassword ? "text" : input.type
              }
              name={input.name}
              value={userInputs[input.name as keyof typeof userInputs]}
              onChange={handleChange}
              placeholder={input.placeholder}
              className="w-full p-4 text-base border border-gray-700 bg-gray-700 text-white"
            />
          </div>
        ))}

        <label className="flex items-center gap-2 mt-2 text-[#00ffcc] text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={handleCheckboxToggle}
            className="accent-[#00ffcc]"
          />
          Show Passwords
        </label>
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={disableSubmission}
        className={`w-full py-4 mt-4 text-base font-semibold border-none transition-all duration-300 ${
          !disableSubmission
            ? "bg-[#00fb57] text-[#1a1a1a] cursor-pointer"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default UsernamePassword;
