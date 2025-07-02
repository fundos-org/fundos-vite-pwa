// const UploadPhoto: React.FC<PageProps> = ({ showNotification }) => {
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }
//   }, []);

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedImage(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedImage) {
//       showNotification('Please select an image first', 'error');
//       return;
//     }

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('image', selectedImage); // API expects 'image' field name

//       const response = await fetch(`https://api.fundos.services/api/v0/test/user/upload-photo?expiration=3600&user_id=${userId}`, {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await response.json();
      
//       if (data.success || response.ok) {
//         showNotification(data.message || 'Photo uploaded successfully', 'success');
//         window.history.pushState({}, '', '/final-approval');
//         window.location.reload();
//       } else {
//         showNotification(data.message || 'Failed to upload photo. Please try again.', 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showNotification('Failed to upload photo. Please try again.', 'error');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleBack = () => {
//     window.history.pushState({}, '', '/contribution-agreement');
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
//           Upload Photo
//         </h1>
        
//         <p style={{
//           color: '#00ffcc',
//           fontSize: '14px',
//           marginBottom: '2rem',
//           lineHeight: '1.6'
//         }}>
//           Please upload a clear photo of yourself for verification purposes.
//         </p>

//         <div style={{ marginBottom: '1.5rem' }}>
//           <input 
//             type="file"
//             accept="image/*"
//             onChange={handleImageSelect}
//             style={{
//               width: '100%',
//               padding: '1rem',
//               fontSize: '1rem',
//               borderRadius: '8px',
//               border: '1px solid #374151',
//               background: '#374151',
//               color: 'white',
//               outline: 'none'
//             }}
//           />
//         </div>

//         {selectedImage && (
//           <div style={{ 
//             marginBottom: '1.5rem', 
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             <img 
//               src={URL.createObjectURL(selectedImage)}
//               alt="Selected"
//               style={{
//                 maxWidth: '200px',
//                 maxHeight: '200px',
//                 borderRadius: '8px',
//                 border: '1px solid #374151',
//                 display: 'block'
//               }}
//             />
//             <p style={{ 
//               color: '#9ca3af', 
//               fontSize: '14px', 
//               marginTop: '0.5rem',
//               textAlign: 'center'
//             }}>
//               {selectedImage.name}
//             </p>
//           </div>
//         )}

//         <button
//           onClick={handleUpload}
//           disabled={!selectedImage || uploading}
//           style={{
//             background: (selectedImage && !uploading) ? '#00fb57' : '#374151',
//             color: (selectedImage && !uploading) ? '#1a1a1a' : '#6b7280',
//             border: 'none',
//             padding: '1rem 2rem',
//             fontSize: '1rem',
//             fontWeight: '600',
//             borderRadius: '8px',
//             cursor: (selectedImage && !uploading) ? 'pointer' : 'not-allowed',
//             width: '100%',
//             transition: 'all 0.3s ease'
//           }}
//         >
//           {uploading ? 'Uploading...' : 'Upload Photo'}
//         </button>
//       </div>
//     </div>
//   );
// };