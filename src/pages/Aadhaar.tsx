// const AadhaarVerification: React.FC<PageProps> = ({ showNotification }) => {
//   const [showProceed, setShowProceed] = useState(false);
//   const [showRetry, setShowRetry] = useState(false);
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }
//   }, []);

//   const handleVerifyAadhaar = async () => {
//     try {
//       const response = await fetch(`https://api.fundos.services/api/v2/live/kyc/generate-url?user_id=${userId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = await response.json();
      
//       if (data.success && data.short_url) {
//         // Open Aadhaar verification URL in new tab
//         window.open(data.short_url, '_blank');
//         setShowProceed(false);
//         setShowRetry(false);
//         setTimeout(() => {
//           setShowProceed(true);
//           setShowRetry(true);
//         }, 5000);
//       } else {
//         showNotification('Failed to fetch Aadhaar redirect URL', 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showNotification('Failed to fetch Aadhaar redirect URL', 'error');
//     }
//   };

//   const handleProceedNext = async () => {
//     try {
//       const response = await fetch(`https://api.fundos.services/api/v2/live/kyc/details?user_id=${userId}`, {
//         method: 'GET',
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         showNotification(data.message || 'Aadhaar verification status checked successfully', 'success');
//         window.history.pushState({}, '', '/pan-verification');
//         window.location.reload();
//       } else {
//         showNotification(data.message || 'Please complete your Aadhaar verification', 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showNotification('Failed to check Aadhaar verification status', 'error');
//     }
//   };

//   const handleBack = () => {
//     window.history.pushState({}, '', '/kyc-start');
//     window.location.reload();
//   };

//   return (
//     <div style={{
//       height: '100vh',
//       width: '100vw',
//       background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
//       display: 'flex',
//       flexDirection: 'column',
//       color: 'white',
//       padding: '1rem',
//       overflow: 'hidden',
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       boxSizing: 'border-box'
//     }}>
//       <button 
//         onClick={handleBack}
//         style={{
//           background: 'transparent',
//           border: 'none',
//           color: '#9ca3af',
//           fontSize: '2rem',
//           cursor: 'pointer',
//           padding: '1rem',
//           alignSelf: 'flex-start',
//           zIndex: 10
//         }}
//       >
//         ←
//       </button>
      
//       <div style={{ 
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         padding: '2rem',
//         maxHeight: '100%',
//         overflowY: 'auto'
//       }}>

//         <h1 style={{
//           color: '#fff',
//           fontSize: '2.5rem',
//           fontWeight: 'bold',
//           marginBottom: '10px'
//         }}>
//           Aadhaar KYC Verification
//         </h1>
        
//         <p style={{
//           color: '#00ffcc',
//           fontSize: '14px',
//           marginBottom: '2rem',
//           lineHeight: '1.6'
//         }}>
//           Complete your Aadhaar verification to finish KYC and begin investing.
//         </p>

//         {!showProceed && (
//           <button
//             onClick={handleVerifyAadhaar}
//             style={{
//               backgroundColor: '#00fb57',
//               color: '#1a1a1a',
//               border: 'none',
//               padding: '1rem 2rem',
//               fontSize: '1rem',
//               fontWeight: '600',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               width: '100%',
//               marginBottom: '10px',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             Verify Aadhaar Now
//           </button>
//         )}

//         {showRetry && (
//           <button
//             onClick={handleVerifyAadhaar}
//             style={{
//               backgroundColor: '#ffb800',
//               color: '#1a1a1a',
//               border: 'none',
//               padding: '1rem 2rem',
//               fontSize: '1rem',
//               fontWeight: '600',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               width: '100%',
//               marginBottom: '10px',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             Retry Verification
//           </button>
//         )}

//         {showProceed && (
//           <button
//             onClick={handleProceedNext}
//             style={{
//               backgroundColor: '#00fb57',
//               color: '#1a1a1a',
//               border: 'none',
//               padding: '1rem 2rem',
//               fontSize: '1rem',
//               fontWeight: '600',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               width: '100%',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             Proceed Next
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };