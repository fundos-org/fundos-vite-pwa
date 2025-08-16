import { eRoutes } from "@/RoutesEnum";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/lib/axiosInstance";
import { useHomeContext } from "@/Shared/useLocalContextState";

function DrawDown() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { localContextState } = useHomeContext();
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const paymentWindowRef = useRef<Window | null>(null);
  const paymentCheckIntervalRef = useRef<number | null>(null);

  // Function to open popup window centered on screen
  const openCenteredPopup = (url: string, title: string, w: number, h: number) => {
    // Calculate the position of the popup
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
    
    const width = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const height = window.innerHeight || document.documentElement.clientHeight || screen.height;
    
    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;
    
    // Open the popup with specified dimensions and position
    const popup = window.open(
      url,
      title,
      `
        scrollbars=yes,
        width=${w / systemZoom},
        height=${h / systemZoom},
        top=${top},
        left=${left}
      `
    );
    
    // Focus the popup
    if (popup) popup.focus();
    
    return popup;
  };

  // Monitor payment window status
  useEffect(() => {
    // Cleanup function to handle component unmount
    return () => {
      if (paymentCheckIntervalRef.current) {
        clearInterval(paymentCheckIntervalRef.current);
      }
    };
  }, []);

  const handleGeneratePaymentLink = async () => {
    try {
      setPaymentProcessing(true);
      
      // Generate a unique idempotency key for this payment request
      const idempotencyKey = crypto.randomUUID();
      
      const response = await api.post("/payment/create/url", {
        user_id: localContextState.userId,
        deal_id: localContextState.dealId,
        amount: Number(localContextState.investmentAmount),
      }, {
        headers: {
          "Idempotency-Key": idempotencyKey,
        }
      });

      if (response.status === 200 && response.data) {
        // Get the payment URL from the response
        const paymentUrlFromResponse = response.data.payment_url || response.data;
        setPaymentUrl(paymentUrlFromResponse);
        sessionStorage.setItem("idempotencyKey", idempotencyKey);
        
        // Open payment in centered popup window
        const paymentWindow = openCenteredPopup(
          paymentUrlFromResponse,
          "Payment",
          800,  // Width
          700   // Height
        );
        
        if (paymentWindow) {
          // Store reference to the window
          paymentWindowRef.current = paymentWindow;
          
          // Start monitoring the popup window status
          if (paymentCheckIntervalRef.current) {
            clearInterval(paymentCheckIntervalRef.current);
          }
          
          paymentCheckIntervalRef.current = window.setInterval(() => {
            // Check if window was closed
            if (paymentWindowRef.current && paymentWindowRef.current.closed) {
              // Clean up
              clearInterval(paymentCheckIntervalRef.current!);
              paymentCheckIntervalRef.current = null;
              
              // Update UI
              setPaymentProcessing(false);
              toast.success("Payment window closed");
            }
          }, 1000); // Check every second
          
        } else {
          // If popup is blocked
          setPaymentProcessing(false);
          toast.error("Payment popup was blocked. Please allow popups and try again.");
        }
      } else {
        throw new Error("Invalid response from payment service");
      }
    } catch (error) {
      console.error("Payment link generation failed:", error);
      toast.error("Failed to generate payment link. Please try again.");
      setPaymentProcessing(false);
    }
  };

  // Handle retry if popup was blocked
  const handleRetryPayment = () => {
    if (paymentUrl) {
      const paymentWindow = openCenteredPopup(
        paymentUrl,
        "Payment",
        800,
        700
      );
      
      if (paymentWindow) {
        paymentWindowRef.current = paymentWindow;
      } else {
        toast.error("Popup still blocked. Please check your browser settings.");
      }
    }
  };

  useEffect(() => {
    const s3Key = sessionStorage.getItem("s3_key");

    if (!s3Key) {
      toast.error(
        "No drawdown notice found. Please complete the previous step."
      );
      navigate(eRoutes.TERM_SHEET_HOME);
      return;
    }

    const fetchPresignedUrl = async () => {
      try {
        const response = await api.get(
          `/utils/presigned-url?s3_key=${encodeURIComponent(s3Key)}`
        );

        if (response.status === 200) {
          setPresignedUrl(response.data);
        } else {
          throw new Error("Failed to fetch presigned URL");
        }
      } catch (error) {
        console.error("Error fetching presigned URL:", error);
        toast.error("Failed to load drawdown notice. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPresignedUrl();
  }, [navigate]);

  return (
    <div className="flex flex-col w-full max-w-4xl justify-between h-[calc(100vh)] bg-white/5 border border-white/10 p-7 shadow-lg">
      <h1 className="text-white text-[1.8rem] font-bold mb-4">
        Drawdown notice
      </h1>

      <button
        type="button"
        onClick={() => navigate("/home/dashboard")}
        className="self-start mb-4 text-white border border-white/30 hover:border-white px-4 py-2 rounded"
      >
        Go back to home
      </button>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-center">
            Generating your drawdown notice. Please wait...
          </p>
        </div>
      ) : presignedUrl ? (
        <div className="flex flex-col flex-grow overflow-auto">
          <div
            className="w-full bg-gray-800 rounded-lg overflow-hidden mb-4"
            style={{ height: "60vh" }}
          >
            <iframe
              ref={iframeRef}
              src={presignedUrl}
              title="Drawdown Notice"
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg">
            <input
              type="checkbox"
              id="confirmDrawdown"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-5 h-5 accent-white"
            />
            <label htmlFor="confirmDrawdown" className="text-white">
              I confirm that I have read and understood all the terms and
              conditions in the drawdown notice.
            </label>
          </div>

          {paymentProcessing && (
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white">Payment in progress...</span>
              </div>
              <p className="text-gray-300 text-sm">
                A payment window has been opened. Please complete your payment in the new window.
              </p>
              <button
                onClick={handleRetryPayment}
                className="mt-3 text-white underline hover:text-gray-300 text-sm"
              >
                Open payment window again
              </button>
            </div>
          )}

          <div className="flex flex-col mt-auto pt-4">
            <button
              disabled={!confirmed || paymentProcessing}
              onClick={handleGeneratePaymentLink}
              className={`text-black font-semibold px-8 py-4 w-full transition-all duration-300 focus:outline-none ${
                confirmed && !paymentProcessing
                  ? "bg-white hover:bg-gray-100"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              {paymentProcessing ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-gray-800 rounded-lg">
          <p className="text-white text-center">
            Failed to load drawdown notice.
          </p>
        </div>
      )}
    </div>
  );
}

export default DrawDown;
