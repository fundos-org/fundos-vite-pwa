import { eRoutes } from '@/RoutesEnum';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

interface Deal {
  deal_id: string;
  description: string;
  title: string;
  current_valuation: number;
  round_size: number;
  minimum_investment: number;
  commitment: number;
  instruments: string;
  fund_raised_till_now: number;
  logo_url: string;
  management_fee: number;
  company_stage: string;
  carry: number;
  business_model: string;
}

const DealDetails = () => {
    const { dealId } = useParams<{ dealId: string }>();
    const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchDealDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.fundos.services/api/v1/live/deals/?deal_id=${dealId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch deal details');
        }
        
        const data = await response.json();
        setDeal(data);
      } catch (error) {
        console.error('Error fetching deal details:', error);
        toast.error('Failed to load deal details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (dealId) {
      fetchDealDetails();
    }
  }, [dealId]);

  const convertToCrores = (value: number) => {
    return `${(value / 10000000).toFixed(2)} Cr`;
  };

  const handleCommit = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      // Check MCA status first
      const mcaResponse = await fetch(`https://api.fundos.services/api/v1/live/deals/mca/status?user_id=${userId}`);
      
      if (!mcaResponse.ok) {
        throw new Error('Failed to check MCA status');
      }
      
      
        navigate(eRoutes.COMMIT_INVESTMENT_HOME.replace(':dealId', dealId ?? ''));
        //temp comment
    //   const mcaData = await mcaResponse.json();
    // if (mcaData.sent_status === 'success' && mcaData.request_status === 'completed') {
    //       toast.success(mcaData.message);
    //     navigate(eRoutes.COMMIT_INVESTMENT_HOME.replace(':dealId', dealId ?? ''));
    //   } else if (mcaData.sent_status === 'success' && mcaData.request_status === 'inprogress') {
    //     toast.error('Signing Docs in progress. Please contact admin.');
    //   } else {
    //     toast.error('Ask your fund manager to sign the docs!');
    //   }
    } catch (error) {
      console.error('Error in commit process:', error);
      toast.error('Failed to apply for declarations. Please try again.');
    }
  };

  const handleNotInterested = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      const response = await fetch(`https://api.fundos.services/api/v1/live/deals/interaction?deal_id=${dealId}&user_id=${userId}&not_interested=true`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to set not interested');
      }
      
      const data = await response.json();
      
      if (data?.message) {
        toast.success(data.message);
      }

      navigate(eRoutes.DASHBOARD_HOME) // Go back to dashboard
    } catch (error) {
      console.error('Error setting not interested:', error);
      toast.error('Failed to set not interested. Please try again.');
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex items-center justify-center text-white p-8">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 backdrop-blur text-center">
        <div className="w-15 h-15 border-4 border-gray-700 border-t-[#00fb57] rounded-full animate-spin mx-auto mb-5"></div>
        <h2 className="text-2xl font-medium text-[#FDFDFD] mb-2">
        Loading Deal Details
        </h2>
        <p className="text-sm text-gray-400 m-0">
        Please wait while we fetch the deal information...
        </p>
      </div>
    </div>
    );
  }

  if (!deal) {
    return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white p-8">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 backdrop-blur text-center">
        <h2 className="text-2xl font-medium text-[#FDFDFD] mb-5">
        Deal Not Found
        </h2>
        <button
        onClick={() => navigate(eRoutes.DASHBOARD_HOME)}
        className="bg-[#00fb57] text-[#1a1a1a] border-none px-6 py-3 text-sm font-semibold rounded cursor-pointer"
        >
        Back to Dashboard
        </button>
      </div>
    </div>
    );
  }

  return (
      
      <>
          <div>
        <h1 className="text-white text-2xl font-bold mb-4">
          {deal.title}
        </h1>

        {/* Description */}
        <div className="mb-8">
          <p
            className={`text-gray-300 text-sm m-0 leading-relaxed ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}
            style={{ display: isDescriptionExpanded ? 'block' : '-webkit-box' }}
          >
            {deal.description}
          </p>
          {deal.description && deal.description.length > 150 && (
            <button
              onClick={toggleDescription}
              className="bg-transparent border-none text-[#00fb57] text-sm cursor-pointer p-0 mt-2"
            >
              {isDescriptionExpanded ? 'See Less' : 'See More'}
            </button>
          )}
        </div>

        {/* Deal Details Card */}
        <div className="mb-8">
          <h2 className="text-white text-lg font-semibold mb-4">
            📊 Deal Information
          </h2>

          {/* Current Valuation - Featured */}
          <div className="mb-6 p-4 bg-[#00fb571a] border border-[#00fb574d]">
            <p className="text-[#00fb57] text-xs mb-1 font-semibold">
              CURRENT VALUATION
            </p>
            <p className="text-white text-2xl font-bold m-0">
              INR {convertToCrores(deal.current_valuation)}{' '}
              <span className="text-gray-400 text-base font-normal">
                (Post)
              </span>
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-xs mb-1 font-semibold">
                STAGE
              </p>
              <p className="text-white text-sm font-bold m-0">
                {deal.company_stage?.toUpperCase() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1 font-semibold">
                INSTRUMENT
              </p>
              <p className="text-white text-sm font-bold m-0">
                {deal.instruments?.toUpperCase() || 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-xs mb-1 font-semibold">
                ROUND SIZE
              </p>
              <p className="text-white text-sm font-bold m-0">
                INR {convertToCrores(deal.round_size)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1 font-semibold">
                MIN. INVESTMENT
              </p>
              <p className="text-white text-sm font-bold m-0">
                INR {convertToCrores(deal.minimum_investment)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-400 text-xs mb-1 font-semibold">
                COMMITMENTS
              </p>
              <p className="text-white text-sm font-bold m-0">
                INR {convertToCrores(deal.commitment)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1 font-semibold">
                VALUATION
              </p>
              <p className="text-white text-sm font-bold m-0">
                INR {convertToCrores(2500000)}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div>
            <p className="text-[#00fb57] text-sm mb-2 font-semibold">
              📈 {deal.fund_raised_till_now}% funds raised till now
            </p>
            <div className="h-2 bg-white/10 rounded overflow-hidden border border-white/20">
              <div
                className="h-full bg-gradient-to-r from-[#00fb57] to-[#00d647] transition-all duration-300"
                style={{ width: `${deal.fund_raised_till_now}%` }}
              ></div>
            </div>
          </div>
          </div>
          </div>
          

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCommit}
            className="bg-[#00fb57] text-[#1a1a1a] text-base font-bold py-3 border-none cursor-pointer w-full transition-all duration-300"
          >
            💰 Commit Investment
          </button>
          <button
            onClick={handleNotInterested}
            className="bg-white/10 text-white text-sm font-semibold py-3 border border-white/30 cursor-pointer w-full transition-all duration-300"
          >
            Not Interested
          </button>
        </div>
      </>
  );
};

export default DealDetails;
