// const BankDetails: React.FC<PageProps> = ({ showNotification }) => {
//   const [accountNumber, setAccountNumber] = useState('');
//   const [ifscCode, setIfscCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState('');
//   const [panNumber, setPanNumber] = useState('');

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     const storedPanNumber = localStorage.getItem('panNumber');
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }
//     if (storedPanNumber) {
//       setPanNumber(storedPanNumber);
//     }
//   }, []);

//   // Bank account number validation (9-18 digits, numeric only)
//   const isValidAccountNumber = (accNumber: string) => {
//     const accountRegex = /^[0-9]{9,18}$/;
//     return accountRegex.test(accNumber);
//   };

//   // IFSC code validation (4 letters + 1 digit + 6 alphanumeric)
//   const isValidIFSC = (ifsc: string) => {
//     const ifscRegex = /^[A-Z]{4}[0-9]{1}[A-Z0-9]{6}$/;
//     return ifscRegex.test(ifsc);
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     if (!isValidAccountNumber(accountNumber)) {
//       showNotification('Please enter a valid bank account number (9-18 digits)', 'error');
//       return;
//     }
//     if (!isValidIFSC(ifscCode)) {
//       showNotification('Please enter a valid IFSC code (e.g., SBIN0001234)', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch('https://api.fundos.services/api/v1/live/kyc/pan/bank/link/verify', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: userId,
//           pan_number: panNumber,
//           bank_account_number: accountNumber,
//           ifsc_code: ifscCode,
//           tax_identity_number: panNumber, // Set tax identity number same as PAN
//         }),
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         showNotification(data.message || 'Bank details verified successfully', 'success');
//         window.history.pushState({}, '', '/professional-background');
//         window.location.reload();
//       } else {
//         showNotification(data.message || 'Failed to verify bank. Please try again.', 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showNotification('Bank Verification failed', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => {
//     window.history.pushState({}, '', '/pan-verification');
//     window.location.reload();
//   };

//   const handleAccountNumberChange = (e: any) => {
//     const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
//     setAccountNumber(value);
//   };

//   const handleIfscChange = (e: any) => {
//     const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Allow only alphanumeric
//     if (value.length <= 11) { // IFSC is 11 characters
//       setIfscCode(value);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         color: 'white'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{
//             width: '40px',
//             height: '40px',
//             border: '4px solid #374151',
//             borderTop: '4px solid #00fb57',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             margin: '0 auto 20px'
//           }}></div>
//           <h2 style={{ fontSize: '2.5rem', fontWeight: '500', color: '#FDFDFD' }}>
//             Please wait...
//           </h2>
//         </div>
//       </div>
//     );
//   }

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
//           Bank Details
//         </h1>
        
//         <p style={{
//           color: '#00ffcc',
//           fontSize: '14px',
//           marginBottom: '2rem',
//           lineHeight: '1.6'
//         }}>
//           Share your bank account details.
//         </p>

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: '1.5rem' }}>
//             <input 
//               type="text" 
//               inputMode="numeric"
//               pattern="[0-9]*"
//               value={accountNumber}
//               onChange={handleAccountNumberChange}
//               placeholder="Enter your bank account number"
//               style={{
//                 width: '100%',
//                 padding: '1rem',
//                 fontSize: '1rem',
//                 borderRadius: '8px',
//                 border: '1px solid #374151',
//                 background: '#374151',
//                 color: 'white',
//                 outline: 'none'
//               }}
//             />
//           </div>
          
//           <div style={{ marginBottom: '1.5rem' }}>
//             <input 
//               type="text" 
//               value={ifscCode}
//               onChange={handleIfscChange}
//               placeholder="Enter your IFSC"
//               autoCapitalize="characters"
//               autoComplete="off"
//               style={{
//                 width: '100%',
//                 padding: '1rem',
//                 fontSize: '1rem',
//                 borderRadius: '8px',
//                 border: '1px solid #374151',
//                 background: '#374151',
//                 color: 'white',
//                 outline: 'none',
//                 textTransform: 'uppercase',
//                 letterSpacing: '1px'
//               }}
//             />
//           </div>
          
//           <button 
//             type="submit"
//             disabled={!isValidAccountNumber(accountNumber) || !isValidIFSC(ifscCode)}
//             style={{
//               background: (isValidAccountNumber(accountNumber) && isValidIFSC(ifscCode)) ? '#00fb57' : '#374151',
//               color: (isValidAccountNumber(accountNumber) && isValidIFSC(ifscCode)) ? '#1a1a1a' : '#6b7280',
//               border: 'none',
//               padding: '1rem 2rem',
//               fontSize: '1rem',
//               fontWeight: '600',
//               borderRadius: '8px',
//               cursor: (isValidAccountNumber(accountNumber) && isValidIFSC(ifscCode)) ? 'pointer' : 'not-allowed',
//               width: '100%',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             Next
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };