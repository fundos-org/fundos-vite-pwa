// const FinalApproval: React.FC<PageProps> = ({ showNotification }) => {
//   const handleBack = () => {
//     window.history.pushState({}, '', '/upload-photo');
//     window.location.reload();
//   };

//   const handleGoToDashboard = () => {
//     showNotification('KYC process completed successfully!', 'success');
//     // Add small delay to ensure notification shows before navigation
//     setTimeout(() => {
//       window.history.pushState({}, '', '/dashboard');
//       window.location.reload();
//     }, 100);
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
//         alignItems: 'center',
//         padding: '2rem',
//         maxHeight: '100%',
//         overflowY: 'auto',
//         textAlign: 'center'
//       }}>

//         <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        
//         <h1 style={{
//           color: '#fff',
//           fontSize: '2.5rem',
//           fontWeight: 'bold',
//           marginBottom: '1rem'
//         }}>
//           Final Approval
//         </h1>
        
//         <p style={{
//           color: '#00ffcc',
//           fontSize: '16px',
//           marginBottom: '2rem',
//           lineHeight: '1.6'
//         }}>
//           Congratulations! Your KYC process has been submitted for final approval. You will be notified once it's approved.
//         </p>

//         <p style={{
//           color: '#9ca3af',
//           fontSize: '14px',
//           marginBottom: '2rem',
//           lineHeight: '1.6'
//         }}>
//           Our team will review your application and get back to you within 2-3 business days.
//         </p>

//         <button
//           onClick={handleGoToDashboard}
//           style={{
//             background: '#00fb57',
//             color: '#1a1a1a',
//             border: 'none',
//             padding: '1rem 2rem',
//             fontSize: '1rem',
//             fontWeight: '600',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             width: '100%',
//             maxWidth: '300px',
//             transition: 'all 0.3s ease'
//           }}
//         >
//           Go to Dashboard
//         </button>
//       </div>
//     </div>
//   );
// };