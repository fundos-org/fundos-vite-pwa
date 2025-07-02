import { eRoutes } from '@/RoutesEnum';
import React, { useState, useEffect } from 'react';
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

// interface CommitInvestmentProps {
//   dealId: string;
//   showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
//   onBack: () => void;
//   onTermSheet: (dealId: string, investmentAmount: string) => void;
// }

const CommitInvestment: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>();
      const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [parsedAmount, setParsedAmount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  useEffect(() => {
    const cleanAmount = investmentAmount.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanAmount);
    setParsedAmount(isNaN(num) ? 0 : num);
  }, [investmentAmount]);

  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) {
      return '₹ 0';
    }
    return `₹ ${value.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    })}`;
  };

  const handleInvestmentAmountChange = (text: string) => {
    const cleanText = text.replace(/[^0-9.]/g, '');
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      return;
    }
    setInvestmentAmount(cleanText);
  };

  const handleInputChange = () => {
    const value = parseFloat(investmentAmount) || 0;
    const minValue = deal?.minimum_investment || 0;
    
    if (value < minValue) {
      toast.error(`Minimum Investment Amount: ${formatCurrency(minValue)}`);
    } else {
      setModalVisible(true);
    }
  };

  const handleContinue = () => {
    if (!checked) {
      toast.error('Please check the acknowledgment to continue');
      return;
    }

    try {
      navigate(
        `${eRoutes.TERM_SHEET_HOME}?dealId=${dealId}&investmentAmount=${parsedAmount}`
      );
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Navigation failed. Please try again.');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  const managementFeeRate = deal?.management_fee || 0;
  const managementFee = parsedAmount * (managementFeeRate / 100);
  const gst = managementFee * 0.18;
  const total = parsedAmount + managementFee + gst;

  const isInvestmentValid = parsedAmount > 0 && parsedAmount >= (deal?.minimum_investment || 0);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        boxSizing: 'border-box'
      }}>
        {/* Back Icon */}
        <button 
          onClick={() => navigate(eRoutes.DEAL_DETAILS_HOME.replace(':dealId', dealId || ''))}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '2rem',
            cursor: 'pointer',
            padding: '1rem',
            alignSelf: 'flex-start',
            zIndex: 10
          }}
        >
          ←
        </button>
        {/* Scrollable Content */}
        <div style={{
          flex: 1,
          padding: '2rem',
          overflow: 'auto',
          paddingBottom: '6rem',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '400px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #374151',
              borderTop: '4px solid #00fb57',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '500',
              color: '#FDFDFD',
              margin: '0 0 10px 0'
            }}>
              Loading Deal Details
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              margin: 0
            }}>
              Please wait while we load your investment details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        boxSizing: 'border-box'
      }}>
        {/* Back Icon */}
        <button 
          onClick={() => navigate(eRoutes.DEAL_DETAILS_HOME.replace(':dealId', dealId || ''))}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '2rem',
            cursor: 'pointer',
            padding: '1rem',
            alignSelf: 'flex-start',
            zIndex: 10
          }}
        >
          ←
        </button>
        {/* Scrollable Content */}
        <div style={{
          flex: 1,
          padding: '2rem',
          overflow: 'auto',
          paddingBottom: '6rem',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '400px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '500',
              color: '#FDFDFD',
              margin: '0 0 20px 0'
            }}>
              Deal Not Found
            </h2>
            <button
              onClick={() => navigate(eRoutes.DASHBOARD_HOME)}
              style={{
                background: '#00fb57',
                color: '#1a1a1a',
                border: 'none',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      boxSizing: 'border-box'
    }}>
      {/* Back Icon */}
      <button 
        onClick={() => navigate(eRoutes.DEAL_DETAILS_HOME.replace(':dealId', dealId || ''))}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          fontSize: '2rem',
          cursor: 'pointer',
          padding: '1rem',
          alignSelf: 'flex-start',
          zIndex: 10
        }}
      >
        ←
      </button>
      {/* Scrollable Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
        overflow: 'auto',
        paddingBottom: '6rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          margin: '0 0 2rem 0'
        }}>
          💰 Commit Investment
        </h1>

        {/* Deal Info Card */}
        <div>
          <h2 style={{
            color: '#00fb57',
            fontSize: '1.2rem',
            fontWeight: '600',
            margin: '0 0 0.5rem 0'
          }}>
            {deal.title}
          </h2>
          <p style={{
            color: '#ccc',
            fontSize: '14px',
            margin: '0 0 2rem 0',
            lineHeight: '1.5'
          }}>
            {deal.description}
          </p>
        </div>

        {/* Investment Input Section */}
        <div>
          <h3 style={{
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: '600',
            margin: '0 0 1rem 0'
          }}>
            📊 Investment Amount
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              color: '#9ca3af',
              fontSize: '14px',
              marginBottom: '8px',
              display: 'block',
              fontWeight: '600'
            }}>
              Enter amount in INR
            </label>
            <input
              type="text"
              value={investmentAmount}
              onChange={(e) => handleInvestmentAmountChange(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '18px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                outline: 'none',
                fontWeight: 'bold',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px'
            }}>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                margin: '0'
              }}>
                Minimum: {formatCurrency(deal.minimum_investment)}
              </p>
              {parsedAmount > 0 && (
                <p style={{
                  color: parsedAmount >= deal.minimum_investment ? '#00fb57' : '#ef4444',
                  fontSize: '14px',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  {parsedAmount >= deal.minimum_investment ? '✓ Valid Amount' : '✗ Below Minimum'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleInputChange}
            disabled={!isInvestmentValid}
            style={{
              backgroundColor: isInvestmentValid ? '#00fb57' : 'rgba(255, 255, 255, 0.1)',
              color: isInvestmentValid ? '#1a1a1a' : '#9ca3af',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '14px',
              border: isInvestmentValid ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              cursor: isInvestmentValid ? 'pointer' : 'not-allowed',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            📈 Calculate Investment Summary
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 0 1.5rem 0',
              textAlign: 'center'
            }}>
              📊 Investment Summary
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{ color: '#ccc', fontSize: '14px' }}>Investment Amount:</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                  {formatCurrency(parsedAmount)}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{ color: '#ccc', fontSize: '14px' }}>
                  Management Fee ({managementFeeRate}%):
                </span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                  {formatCurrency(managementFee)}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{ color: '#ccc', fontSize: '14px' }}>GST (18%):</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                  {formatCurrency(gst)}
                </span>
              </div>
              
              <div style={{
                height: '1px',
                backgroundColor: '#333',
                margin: '15px 0'
              }}></div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#00fb57', fontSize: '16px', fontWeight: 'bold' }}>
                  Total Amount:
                </span>
                <span style={{ color: '#00fb57', fontSize: '16px', fontWeight: 'bold' }}>
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Acknowledgment Checkbox */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '1.5rem',
              gap: '10px'
            }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={toggleCheckbox}
                style={{
                  marginTop: '2px',
                  cursor: 'pointer'
                }}
              />
              <label
                onClick={toggleCheckbox}
                style={{
                  color: '#ccc',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  cursor: 'pointer'
                }}
              >
                I acknowledge that I have read and understood the investment terms and conditions. 
                I confirm that the investment amount and associated fees are correct.
              </label>
            </div>

            {/* Modal Buttons */}
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={handleModalClose}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                disabled={!checked}
                style={{
                  backgroundColor: checked ? '#00fb57' : 'rgba(255, 255, 255, 0.1)',
                  color: checked ? '#1a1a1a' : '#9ca3af',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '12px',
                  border: checked ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  cursor: checked ? 'pointer' : 'not-allowed',
                  flex: 1
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitInvestment;
