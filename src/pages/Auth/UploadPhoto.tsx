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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
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

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div>
        <h1 className="text-white text-4xl font-bold mb-2.5">Upload Photo</h1>

        <p className="text-teal-300 text-sm mb-8 leading-relaxed">
          Please upload a clear photo of yourself for verification purposes.
        </p>

        {
          <div className="mb-6">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageSelect}
              className={`w-full p-4 text-base border border-gray-700 bg-gray-700 text-white outline-none ${
                selectedImage ? "hidden" : "block"
              }`}
            />
          </div>
        }

        {selectedImage && (
          <label
            className="mb-6 flex flex-col items-center justify-center"
            htmlFor="image-upload"
          >
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="max-w-[300px] max-h-[300px] border border-gray-700 block"
            />
            <p className="text-gray-400 text-sm mt-2 text-center">
              {selectedImage.name}
            </p>
          </label>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!selectedImage || uploading}
        className={`w-full border-none p-4 text-base font-semibold transition-all duration-300 ${
          selectedImage && !uploading
            ? "bg-green-400 text-gray-900 cursor-pointer"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>
    </div>
  );
};

export default UploadPhoto;
