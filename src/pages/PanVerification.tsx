// const PANVerification: React.FC<PageProps> = ({ showNotification }) => {
//   const [pan, setPan] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }
//   }, []);

//   // PAN format validation: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
//   const isValidPAN = (panNumber: string) => {
//     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return panRegex.test(panNumber);
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     if (!isValidPAN(pan)) {
//       showNotification('Please enter a valid PAN number (e.g., ABCDE1234F)', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch('https://api.fundos.services/api/v1/live/kyc/pan/verify', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: userId,
//           pan_number: pan,
//           tax_identity_number: pan, // Set tax identity number same as PAN
//         }),
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         localStorage.setItem('panNumber', pan);
//         showNotification(data.message || 'PAN verified successfully', 'success');
//         window.history.pushState({}, '', '/bank-details');
//         window.location.reload();
//       } else {
//         showNotification('Invalid PAN Number. Please try again.', 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showNotification('Invalid PAN Number. Please try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => {
//     window.history.pushState({}, '', '/aadhaar-verification');
//     window.location.reload();
//   };

//   const handlePanChange = (e: any) => {
//     const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
//     if (value.length <= 10) {
//       setPan(value);
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
//           Enter Your PAN Card
//         </h1>
        
//         <p style={{
//           color: '#00ffcc',
//           fontSize: '14px',
//           marginBottom: '2rem',
//           lineHeight: '1.6'
//         }}>
//           We'll use this to verify your identity and comply with regulations.
//         </p>

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: '1.5rem' }}>
//             <input 
//               type="text" 
//               value={pan}
//               onChange={handlePanChange}
//               placeholder="Enter PAN (e.g. ABCDE1234F)"
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
//             disabled={!isValidPAN(pan)}
//             style={{
//               background: isValidPAN(pan) ? '#00fb57' : '#374151',
//               color: isValidPAN(pan) ? '#1a1a1a' : '#6b7280',
//               border: 'none',
//               padding: '1rem 2rem',
//               fontSize: '1rem',
//               fontWeight: '600',
//               borderRadius: '8px',
//               cursor: isValidPAN(pan) ? 'pointer' : 'not-allowed',
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