import { eRoutes } from "@/RoutesEnum";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/lib/axiosInstance";
import { useHomeContext } from "@/Shared/useLocalContextState";
import portfolioService from "@/lib/portfolioService";

function DrawDown() {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { localContextState } = useHomeContext();
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const paymentWindowRef = useRef<Window | null>(null);
  const paymentCheckIntervalRef = useRef<number | null>(null);

  // Get current date for the drawdown notice
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get user and deal information - only use real data, no fallbacks
  const userName = localStorage.getItem("name");
  const investmentAmount = localContextState.investmentAmount ? parseFloat(localContextState.investmentAmount) : null;
  const dealDetails = localContextState.dealDetails;
  const companyName = dealDetails?.title;
  const schemeName = dealDetails?.business_model;

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
          
          paymentCheckIntervalRef.current = window.setInterval(async () => {
            // Check if window was closed
            if (paymentWindowRef.current && paymentWindowRef.current.closed) {
              // Clean up
              clearInterval(paymentCheckIntervalRef.current!);
              paymentCheckIntervalRef.current = null;
              
              // Update UI
              setPaymentProcessing(false);
              toast.success("Payment window closed");
              
              // Refresh portfolio data after payment (transaction completion)
              try {
                await portfolioService.updatePortfolioData();
                console.log("Portfolio data refreshed after payment completion");
              } catch (error) {
                console.warn("Failed to refresh portfolio data after payment:", error);
              }
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

  // Monitor payment window status
  useEffect(() => {
    // Cleanup function to handle component unmount
    return () => {
      if (paymentCheckIntervalRef.current) {
        clearInterval(paymentCheckIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full max-w-4xl justify-between h-[calc(100vh)] bg-white/5 border border-white/10 p-7 shadow-lg">
      <h1 className="text-white text-[1.8rem] font-bold mb-4">
        Drawdown notice
      </h1>

      <button
        type="button"
        onClick={() => navigate(eRoutes.DASHBOARD_HOME)}
        className="self-start mb-4 text-white border border-white/30 hover:border-white px-4 py-2 rounded"
      >
        Go back to home
      </button>

      <div className="flex flex-col flex-grow overflow-auto">
        {/* Drawdown Notice Content */}
        <div className="bg-gray-800 text-white p-8 rounded-lg mb-6 max-h-[70vh] overflow-y-auto border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold">DRAWDOWN NOTICE</h3>
          </div>

          {/* Date and Addressee */}
          <div className="mb-6">
            <p className="mb-4"><strong>Date:</strong> {getCurrentDate()}</p>
            {userName && (
              <p className="mb-4"><strong>Dear</strong> {userName.toUpperCase()}</p>
            )}
          </div>

          {/* Main Content */}
          <div className="mb-6 leading-relaxed">
            {schemeName && companyName ? (
              <p className="mb-4">
                Your consent to invest in <u><strong>{schemeName}</strong></u> scheme has been received and accepted.
                Under this Investment Scheme, the investment will be made in <u><strong>{companyName}</strong></u>.
              </p>
            ) : (
              <p className="mb-4">
                Your investment consent has been received and accepted.
              </p>
            )}

            {investmentAmount ? (
              <p className="mb-6">
                We are hereby issuing this Drawdown Notice for INR <strong>{formatCurrency(investmentAmount)}</strong> payable within
                15 business days. The particulars of the Drawdown and your Commitment are as follows:
              </p>
            ) : (
              <p className="mb-6">
                We are hereby issuing this Drawdown Notice payable within 15 business days.
              </p>
            )}
          </div>

          {/* Particulars Table - Only show if we have investment amount */}
          {investmentAmount && (
            <div className="mb-8">
              <table className="w-full border-collapse border border-white/20">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 p-3 text-left font-semibold">Particulars</th>
                    <th className="border border-white/20 p-3 text-left font-semibold">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-white/20 p-3">Investment Amount</td>
                    <td className="border border-white/20 p-3">{formatCurrency(investmentAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Additional Information */}
          <div className="mb-6 leading-relaxed">
            <p className="mb-4">
              Please remit your payment to the bank account details provided in the complete drawdown letter
              sent to your registered email address. Send a confirmation (with a screenshot or reference number) 
              of the transaction to <strong>legal@fundos.solutions</strong> no later than 7 days from remittance.
            </p>

            <p className="mb-4">
              <strong>Note:</strong> <em>Funds should be remitted from the account registered with us.</em>
            </p>

            <p className="mb-4">
              In your email please also identify the name of your remitting bank{schemeName && ` and the name of the Investment Scheme (${schemeName})`},
              so that the Investment Manager can monitor the incoming funds more easily. Thank you in
              advance for your cooperation and attention to this matter.
            </p>
          </div>
        </div>

        {/* Email Notification Message */}
        {/* <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <p className="text-white text-center">
            📧 <strong>Full drawdown letter with complete bank details has been sent to your registered email address.</strong>
          </p>
        </div> */}

        {/* Confirmation Checkbox */}
        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg mb-6">
          <input
            type="checkbox"
            id="confirmDrawdown"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-5 h-5 accent-white mt-1"
          />
          <label htmlFor="confirmDrawdown" className="text-white leading-relaxed">
            I confirm that I have read and understood all the terms and conditions in the drawdown notice.
            {/* I acknowledge that the complete drawdown letter with bank details has been sent to my registered email. */}
          </label>
        </div>

        {/* Payment Processing Status */}
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

        {/* Proceed Button */}
        <div className="flex flex-col pt-4">
          <button
            disabled={!confirmed || paymentProcessing}
            onClick={handleGeneratePaymentLink}
            className={`font-semibold px-8 py-4 w-full transition-all duration-300 focus:outline-none rounded ${
              confirmed && !paymentProcessing
                ? "bg-white text-black hover:bg-gray-100"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            {paymentProcessing ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DrawDown;
