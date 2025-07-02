// const UserDetails: React.FC<PageProps> = ({ showNotification }) => {
//   const [loading, setLoading] = useState(true);
//   const [userProfile, setUserProfile] = useState({
//     full_name: '',
//     email: '',
//     phone_number: '',
//     address: '',
//     father_name: '',
//     entity_type: '',
//     pan_number: '',
//     capital_commitment: '',
//     resident: '',
//     date_of_birth: '',
//     tax_identity_number: '' // Add this field for backend compatibility
//   });
//   const [originalProfile, setOriginalProfile] = useState({
//     address: '',
//     father_name: ''
//   });
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       const storedUserId = localStorage.getItem('userId');
//       if (storedUserId) {
//         setUserId(storedUserId);
//         try {
//           const response = await fetch(`https://api.fundos.services/api/v0/test/user/details?user_id=${storedUserId}`);
//           const data = await response.json();
          
//           if (data.success) {
//             // Function to format date from various formats to DD/MM/YYYY for display
//             const formatDateForDisplay = (dateString: string) => {
//               if (!dateString) return '';
              
//               // If already in DD/MM/YYYY or DD-MM-YYYY format, return as is
//               if (dateString.match(/^\d{2}[/-]\d{2}[/-]\d{4}$/)) {
//                 return dateString.replace(/-/g, '/');
//               }
              
//               // If in YYYY-MM-DD format, convert to DD/MM/YYYY
//               if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
//                 const [year, month, day] = dateString.split('-');
//                 return `${day}/${month}/${year}`;
//               }
              
//               // Try to parse as a date and format
//               try {
//                 const date = new Date(dateString);
//                 const day = date.getDate().toString().padStart(2, '0');
//                 const month = (date.getMonth() + 1).toString().padStart(2, '0');
//                 const year = date.getFullYear();
//                 return `${day}/${month}/${year}`;
//               } catch {
//                 return dateString; // Return original if parsing fails
//               }
//             };

//             const profileData = {
//               full_name: data.data.full_name || '',
//               email: data.data.email || '',
//               phone_number: data.data.phone_number || '',
//               address: data.data.address || '',
//               father_name: data.data.father_name || '',
//               entity_type: data.data.entity_type || '',
//               pan_number: data.data.pan_number || '',
//               capital_commitment: data.data.capital_commitment?.toString() || '',
//               resident: data.data.resident || '',
//               date_of_birth: formatDateForDisplay(data.data.date_of_birth || ''),
//               tax_identity_number: data.data.tax_identity_number || data.data.pan_number || '' // Use PAN as tax identity
//             };
            
//             setUserProfile(profileData);
//             // Store original editable values for comparison
//             setOriginalProfile({
//               address: profileData.address,
//               father_name: profileData.father_name
//             });
//           }
//         } catch (error) {
//           console.error('Error fetching user details:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
    
//     // Check for empty editable required fields (only address and father_name are editable)
//     const editableRequiredFields = ['address', 'father_name'];
//     const emptyEditableFields = editableRequiredFields.filter(field => !userProfile[field as keyof typeof userProfile]);
    
//     if (emptyEditableFields.length > 0) {
//       showNotification('Please fill in the address and father\'s name fields.', 'error');
//       return;
//     }

//     try {
//       // Only send editable fields for update (address and father_name)
//       const updateableFields = {
//         address: userProfile.address,
//         father_name: userProfile.father_name
//       };

//       const response = await fetch('https://api.fundos.services/api/v0/test/user/details/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: userId,
//           ...updateableFields
//         }),
//       });
//       const data = await response.json();
      
//       if (data.success || response.ok) {
//         showNotification('Details Updated successfully', 'success');
//         window.history.pushState({}, '', '/contribution-agreement');
//         window.location.reload();
//       } else {
//         showNotification('Failed to update user details', 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showNotification('Failed to update user details', 'error');
//     }
//   };

//   const handleBack = () => {
//     window.history.pushState({}, '', '/professional-background');
//     window.location.reload();
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setUserProfile(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Check if user made changes to editable fields
//   const hasChanges = () => {
//     return userProfile.address !== originalProfile.address || 
//            userProfile.father_name !== originalProfile.father_name;
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
//             Please Wait...
//           </h2>
//         </div>
//       </div>
//     );
//   }

//   const fields = [
//     { key: 'full_name', label: 'Full Name', type: 'text', editable: false }, // Read-only - prefilled from KYCcd
//     { key: 'email', label: 'Email', type: 'email', editable: false }, // Read-only
//     { key: 'phone_number', label: 'Phone Number', type: 'tel', editable: false }, // Read-only
//     { key: 'address', label: 'Address', type: 'textarea', editable: true }, // Editable
//     { key: 'father_name', label: "Father's Name", type: 'text', editable: true }, // Editable
//     { key: 'entity_type', label: 'Entity Type', type: 'text', editable: false }, // Read-only - prefilled from KYC
//     { key: 'pan_number', label: 'PAN Number', type: 'text', editable: false }, // Read-only
//     { key: 'capital_commitment', label: 'Capital Commitment', type: 'number', editable: false }, // Read-only - prefilled from KYC
//     { key: 'resident', label: 'Resident', type: 'text', editable: false }, // Read-only - prefilled from KYC
//     { key: 'date_of_birth', label: 'Date of Birth (DD/MM/YYYY)', type: 'text', editable: false } // Read-only - prefilled from KYC
//     // tax_identity_number is handled internally, not shown to users like in Android app
//   ];

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
//           User Details
//         </h1>
        
//         <p style={{
//           color: '#bbb',
//           fontSize: '14px',
//           marginBottom: '2rem',
//           lineHeight: '1.6'
//         }}>
//           Review your KYC details. Only address and father's name can be edited. All other information is prefilled from your verification.
//         </p>

//         <form onSubmit={handleSubmit}>
//           {fields.map((field) => (
//             <div key={field.key} style={{ marginBottom: '1rem' }}>
//               <label style={{
//                 display: 'block',
//                 marginBottom: '0.5rem',
//                 color: '#e5e7eb',
//                 fontSize: '0.9rem'
//               }}>
//                 {field.label}
//               </label>
//               {field.type === 'textarea' ? (
//                 <textarea
//                   value={userProfile[field.key as keyof typeof userProfile]}
//                   onChange={(e) => handleInputChange(field.key, e.target.value)}
//                   disabled={!field.editable}
//                   placeholder={field.editable ? `Enter ${field.label.toLowerCase()}` : ''}
//                   rows={3}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     fontSize: '1rem',
//                     borderRadius: '8px',
//                     border: field.editable ? '1px solid #374151' : '1px solid #4b5563',
//                     background: field.editable ? '#374151' : '#4b5563',
//                     color: field.editable ? 'white' : '#9ca3af',
//                     outline: 'none',
//                     resize: 'vertical',
//                     cursor: field.editable ? 'text' : 'not-allowed'
//                   }}
//                 />
//               ) : (
//                 <input
//                   type={field.type}
//                   value={userProfile[field.key as keyof typeof userProfile]}
//                   onChange={(e) => handleInputChange(field.key, e.target.value)}
//                   disabled={!field.editable}
//                   placeholder={field.editable ? `Enter ${field.label.toLowerCase()}` : ''}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     fontSize: '1rem',
//                     borderRadius: '8px',
//                     border: field.editable ? '1px solid #374151' : '1px solid #4b5563',
//                     background: field.editable ? '#374151' : '#4b5563',
//                     color: field.editable ? 'white' : '#9ca3af',
//                     outline: 'none',
//                     cursor: field.editable ? 'text' : 'not-allowed'
//                   }}
//                 />
//               )}
//             </div>
//           ))}
          
//           <button 
//             type="submit"
//             style={{
//               background: '#00fb57',
//               color: '#1a1a1a',
//               border: 'none',
//               padding: '1rem 2rem',
//               fontSize: '1rem',
//               fontWeight: '600',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               width: '100%',
//               marginTop: '1rem',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             {hasChanges() ? 'Update Details' : 'Next'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };