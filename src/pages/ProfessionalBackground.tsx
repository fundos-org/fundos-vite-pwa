// const ProfessionalBackground: React.FC<PageProps> = ({ showNotification }) => {
//   const [formData, setFormData] = useState({
//     occupation: '',
//     income_source: '',
//     annual_income: '',
//     capital_commitment: ''
//   });
//   const [userId, setUserId] = useState('');
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(storedUserId);
//     }
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       // Don't close if clicking on dropdown button or option
//       if (openDropdown && !target.closest('[data-dropdown]')) {
//         setOpenDropdown(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [openDropdown]);

//   const options = {
//     occupation: [
//       { label: 'Founder', value: 'founder' },
//       { label: 'Employee', value: 'employee' },
//       { label: 'Self-employed', value: 'self_employed' },
//       { label: 'Other', value: 'other' },
//     ],
//     income_source: [
//       { label: 'Business', value: 'business' },
//       { label: 'Salary', value: 'salary' },
//       { label: 'Investments', value: 'investments' },
//       { label: 'Other', value: 'other' },
//     ],
//     annual_income: [
//       { label: '25L - 50L', value: '2500000' },
//       { label: '50L - 1Cr', value: '5000000' },
//       { label: '1Cr - 5Cr', value: '10000000' },
//       { label: '>5Cr', value: '50000000' },
//     ],
//     capital_commitment: [
//       { label: '25L - 50L', value: '2500000' },
//       { label: '50L - 1Cr', value: '5000000' },
//       { label: '1Cr - 5Cr', value: '10000000' },
//       { label: '>5Cr', value: '50000000' },
//     ],
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
    
//     if (!formData.occupation || !formData.income_source || !formData.annual_income || !formData.capital_commitment) {
//       showNotification('Please fill in all fields', 'error');
//       return;
//     }

//     try {
//       const response = await fetch('https://api.fundos.services/api/v0/test/user/professional-background', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: userId,
//           occupation: formData.occupation,
//           income_source: formData.income_source,
//           annual_income: parseInt(formData.annual_income),
//           capital_commitment: parseInt(formData.capital_commitment),
//         }),
//       });
//       const data = await response.json();
      
//       if (data.success || response.ok) {
//         showNotification(data.message || 'Professional background submitted successfully', 'success');
//         window.history.pushState({}, '', '/user-details');
//         window.location.reload();
//       } else {
//         showNotification('Failed to submit professional background. Please try again.', 'error');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       showNotification('Failed to submit professional background. Please try again.', 'error');
//     }
//   };

//   const handleBack = () => {
//     window.history.pushState({}, '', '/bank-details');
//     window.location.reload();
//   };

//   const renderDropdown = (name: keyof typeof options, label: string) => {
//     const isOpen = openDropdown === name;
//     const selectedOption = options[name].find(opt => opt.value === formData[name]);
    
//     const handleOptionSelect = (value: string) => {
//       setFormData({...formData, [name]: value});
//       setOpenDropdown(null);
//     };

//     const handleKeyDown = (event: React.KeyboardEvent) => {
//       if (event.key === 'Enter' || event.key === ' ') {
//         event.preventDefault();
//         setOpenDropdown(isOpen ? null : name);
//       } else if (event.key === 'Escape') {
//         setOpenDropdown(null);
//       }
//     };
    
//     return (
//       <div style={{ marginBottom: '1.5rem', position: 'relative' }} data-dropdown>
//         <label style={{
//           color: '#bbb',
//           marginBottom: '8px',
//           fontSize: '14px',
//           display: 'block'
//         }}>
//           {label}
//         </label>
//         <div style={{ position: 'relative' }} data-dropdown>
//           {/* Custom Dropdown Button */}
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               setOpenDropdown(isOpen ? null : name);
//             }}
//             onKeyDown={handleKeyDown}
//             tabIndex={0}
//             style={{
//               width: '100%',
//               padding: '1rem',
//               paddingRight: '3rem',
//               fontSize: '1rem',
//               borderRadius: '8px',
//               border: '1px solid #374151',
//               background: '#374151',
//               color: selectedOption ? 'white' : '#9ca3af',
//               outline: 'none',
//               cursor: 'pointer',
//               textAlign: 'left',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between'
//             }}
//           >
//             <span>{selectedOption ? selectedOption.label : `Select ${label}`}</span>
//             <span style={{
//               color: '#9ca3af',
//               fontSize: '1rem',
//               transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
//               transition: 'transform 0.2s ease'
//             }}>
//               ▼
//             </span>
//           </button>
          
//           {/* Custom Dropdown Options */}
//           {isOpen && (
//             <div 
//               style={{
//                 position: 'absolute',
//                 top: '100%',
//                 left: 0,
//                 right: 0,
//                 zIndex: 1000,
//                 background: '#374151',
//                 border: '1px solid #4b5563',
//                 borderRadius: '8px',
//                 marginTop: '4px',
//                 maxHeight: '200px',
//                 overflowY: 'auto',
//                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
//               }}
//               data-dropdown
//             >
//               {options[name].map((option, index) => (
//                 <button
//                   key={option.value}
//                   type="button"
//                   tabIndex={0}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleOptionSelect(option.value);
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' || e.key === ' ') {
//                       e.preventDefault();
//                       handleOptionSelect(option.value);
//                     }
//                   }}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem 1rem',
//                     fontSize: '1rem',
//                     background: formData[name] === option.value ? '#4b5563' : 'transparent',
//                     color: 'white',
//                     border: 'none',
//                     textAlign: 'left',
//                     cursor: 'pointer',
//                     transition: 'background 0.2s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     if (formData[name] !== option.value) {
//                       (e.target as HTMLElement).style.background = '#4b5563';
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (formData[name] !== option.value) {
//                       (e.target as HTMLElement).style.background = 'transparent';
//                     }
//                   }}
//                 >
//                   {option.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
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
//           Professional Background
//         </h1>
        
//         <p style={{
//           color: '#bbb',
//           fontSize: '14px',
//           marginBottom: '2rem',
//           lineHeight: '1.6'
//         }}>
//           Share your occupation details to help us better understand your background
//         </p>

//         <form onSubmit={handleSubmit}>
//           {renderDropdown('occupation', 'Occupation')}
//           {renderDropdown('income_source', 'Income Source')}
//           {renderDropdown('annual_income', 'Annual Income')}
//           {renderDropdown('capital_commitment', 'Capital Commitment (Over 5 Years)')}
          
//           <button 
//             type="submit"
//             disabled={!formData.occupation || !formData.income_source || !formData.annual_income || !formData.capital_commitment}
//             style={{
//               background: (formData.occupation && formData.income_source && formData.annual_income && formData.capital_commitment) ? '#00fb57' : '#374151',
//               color: (formData.occupation && formData.income_source && formData.annual_income && formData.capital_commitment) ? '#1a1a1a' : '#6b7280',
//               border: 'none',
//               padding: '1rem 2rem',
//               fontSize: '1rem',
//               fontWeight: '600',
//               borderRadius: '8px',
//               cursor: (formData.occupation && formData.income_source && formData.annual_income && formData.capital_commitment) ? 'pointer' : 'not-allowed',
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