// const KYCStart: React.FC<PageProps> = ({ showNotification }) => {
//   const handleCompleteKYC = () => {
//     // Navigate to Aadhaar verification screen
//     window.history.pushState({}, '', '/aadhaar-verification');
//     window.location.reload();
//   };

//   const handleBack = () => {
//     window.history.pushState({}, '', '/choose-investor');
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
//           Secure Your Investments
//         </h1>
        
//         <p style={{
//           color: '#00ffcc',
//           fontSize: '14px',
//           marginBottom: '2rem',
//           lineHeight: '1.6'
//         }}>
//           We verify your identity to protect your account, ensure regulatory compliance, and give you access to exclusive deals.
//         </p>

//         <button
//           onClick={handleCompleteKYC}
//           style={{
//             backgroundColor: '#00fb57',
//             color: '#1a1a1a',
//             border: 'none',
//             padding: '1rem 2rem',
//             fontSize: '1rem',
//             fontWeight: '600',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             width: '100%',
//             transition: 'all 0.3s ease'
//           }}
//         >
//           Complete KYC Now
//         </button>
//         </div>
//     </div>
//   );
// };