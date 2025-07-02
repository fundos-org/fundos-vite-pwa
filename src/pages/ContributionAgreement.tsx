// const ContributionAgreement: React.FC<PageProps> = ({ showNotification }) => {
//   const [checked, setChecked] = useState(false);
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }
//   }, []);

//   const handleContinue = async () => {
//     if (!checked) {
//       showNotification('Please confirm that you qualify as an Angel Investor before proceeding.', 'error');
//       return;
//     }

//     try {
//       const response = await fetch('https://api.fundos.services/api/v0/test/user/sign-agreement', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           agreement_signed: checked,
//           user_id: userId,
//         }),
//       });
//       const data = await response.json();
      
//       if (data.success || response.ok) {
//         showNotification(data.message || 'Agreement signed successfully', 'success');
//         window.history.pushState({}, '', '/upload-photo');
//         window.location.reload();
//       } else {
//         showNotification(data.message || 'Failed to sign agreement. Please try again.', 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showNotification('Failed to sign agreement. Please try again.', 'error');
//     }
//   };

//   const handleBack = () => {
//     window.history.pushState({}, '', '/user-details');
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
//           fontWeight: '500',
//           marginBottom: '16px'
//         }}>
//           Contribution Agreement
//         </h1>
        
//         <div style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
//           <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '12px' }}>
//             I am an individual investor who has net tangible assets of at least two crore rupees excluding value of my principal residence, and:
//           </p>
//           <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '12px' }}>
//             1. Have early-stage investment experience, or
//           </p>
//           <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '12px' }}>
//             2. Have experience as a serial entrepreneur, or
//           </p>
//           <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '12px' }}>
//             3. Am a senior management professional(s) with at least ten years of experience.
//           </p>
//           <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '12px' }}>
//             For the purpose of this clause, 'early-stage investment experience' shall mean prior experience in investing in start-up or emerging or early-stage ventures and 'serial entrepreneur' shall mean a person who has promoted or co-promoted more than one start-up venture.
//           </p>
//         </div>

//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '12px',
//           marginBottom: '2rem',
//           cursor: 'pointer'
//         }} onClick={() => setChecked(!checked)}>
//           <div style={{
//             width: '20px',
//             height: '20px',
//             minWidth: '20px',
//             minHeight: '20px',
//             border: `2px solid ${checked ? '#00fb57' : '#9ca3af'}`,
//             background: checked ? '#00fb57' : 'transparent',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             borderRadius: '50%',
//             flexShrink: 0
//           }}>
//             {checked && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
//           </div>
//           <label style={{
//             color: '#ffffff',
//             fontSize: '14px',
//             lineHeight: '20px',
//             cursor: 'pointer'
//           }}>
//             I confirm that I qualify as an Angel Investor based on the above condition(s)
//             <span style={{ fontSize: '12px' }}>*</span>
//           </label>
//         </div>

//         <button
//           onClick={handleContinue}
//           disabled={!checked}
//           style={{
//             background: checked ? '#00fb57' : '#374151',
//             color: checked ? '#1a1a1a' : '#6b7280',
//             border: 'none',
//             padding: '1rem 2rem',
//             fontSize: '1rem',
//             fontWeight: '600',
//             borderRadius: '8px',
//             cursor: checked ? 'pointer' : 'not-allowed',
//             width: '100%',
//             transition: 'all 0.3s ease'
//           }}
//         >
//           Agree and Continue
//         </button>
//       </div>
//     </div>
//   );
// };