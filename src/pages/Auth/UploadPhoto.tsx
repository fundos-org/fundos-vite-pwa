import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import portfolioService from "@/lib/portfolioService";

const UploadPhoto = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("image", selectedImage); // API expects 'image' field name

    api
      .post("/onboarding/user/upload-photo", formData)
      .then(async ({ data }) => {
        toast.success(data.message || "Photo uploaded successfully");
        
        // Refresh portfolio data after successful photo upload (onboarding completion)
        await portfolioService.updatePortfolioData();
        
        navigate(eRoutes.FINAL_APPROVAL_AUTH);
      })
      .catch((error) => {
        console.error("Error uploading photo:", error);
        toast.error("Failed to upload photo. Please try again.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleSkip = () => {
    navigate(eRoutes.FINAL_APPROVAL_AUTH);
  };

  return (
    <div className="flex flex-col h-full w-full min-h-screen">
      {/* Header section with blue background */}
      <div className="relative bg-[#4285F4] text-white px-6 py-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          ></div>
          {/* Scattered dots */}
          <div className="absolute inset-0">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Header content */}
        <div className="relative z-10">
          {/* Back arrow and logo */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)} className="text-white text-2xl">
              ←
            </button>
            <div className="text-2xl font-bold">
              <span className="text-white">Fund</span>
              <span className="text-orange-400">OS</span>
            </div>
            <div className="w-6"></div>
          </div>

          {/* Progress indicator */}
          <div className="text-center mb-4">
            <p className="text-white text-sm mb-2">Step 5 of 6</p>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-[#FF9635] h-2 rounded-full transition-all duration-300"
                style={{ width: "83.33%" }} // 5/6 = 83.33%
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 bg-white px-6 py-8 flex flex-col">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-black mb-4">Upload Photo</h1>
          
          <p className="text-gray-500 mb-8 text-base">
            Please upload a clear photo of yourself for verification purposes.
          </p>

          {/* Upload area */}
          <div className="mb-8">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  {/* Cloud upload icon */}
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  
                  <label
                    htmlFor="image-upload"
                    className="text-blue-600 underline cursor-pointer text-base font-medium mb-2"
                  >
                    Choose a file
                  </label>
                  
                  <p className="text-gray-500 text-sm">
                    JPEG, PNG formats, up to 5 MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <div className="text-center mt-4">
                  <label
                    htmlFor="image-upload"
                    className="text-blue-600 underline cursor-pointer text-sm"
                  >
                    Change photo
                  </label>
                </div>
              </div>
            )}
            
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleUpload}
            disabled={!selectedImage || uploading}
            className={`w-full py-4 px-8 text-base font-semibold rounded-lg transition-all duration-300 ${
              selectedImage && !uploading
                ? "bg-[#4285F4] text-white cursor-pointer hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
          
          <button
            onClick={handleSkip}
            className="w-full py-3 px-8 text-base font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;
