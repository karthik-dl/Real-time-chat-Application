// import { useState } from "react";
// import api from "../../services/api";
// import { useAuthStore } from "../../store/authStore";

// const ProfileModal = ({ isOpen, onClose }) => {
//   const { user, logout } = useAuthStore();

//   const [name, setName] = useState(user?.name || "");
//   const [status, setStatus] = useState(user?.status || "");
//   const [avatar, setAvatar] = useState(user?.avatar || "");
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   // Upload profile picture
//   const handleAvatarChange = async (file) => {
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setLoading(true);
//       const res = await api.post("/users/upload-avatar", formData);
//       setAvatar(res.data.avatar);
//     } catch (err) {
//       console.error("Avatar upload failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Save profile
//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       await api.put("/users/profile", {
//         name,
//         status
//       });
//       window.location.reload(); // simple refresh to update state
//     } catch (err) {
//       console.error("Profile update failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     window.location.href = "/";
//   };

//   const styles = {
//     overlay: {
//       position: 'fixed',
//       inset: 0,
//       backgroundColor: 'rgba(0, 0, 0, 0.4)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 50
//     },
//     modal: {
//       backgroundColor: 'white',
//       width: '24rem',
//       borderRadius: '0.5rem',
//       boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//       overflow: 'hidden'
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '0.75rem 1rem',
//       backgroundColor: '#3b82f6',
//       color: 'white'
//     },
//     headerTitle: {
//       fontWeight: '500',
//       margin: 0
//     },
//     closeButton: {
//       fontSize: '1.25rem',
//       background: 'none',
//       border: 'none',
//       color: 'white',
//       cursor: 'pointer',
//       padding: 0
//     },
//     body: {
//       padding: '1rem'
//     },
//     avatarContainer: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       marginBottom: '1rem'
//     },
//     avatarWrapper: {
//       position: 'relative'
//     },
//     avatar: {
//       width: '6rem',
//       height: '6rem',
//       borderRadius: '50%',
//       objectFit: 'cover'
//     },
//     avatarLabel: {
//       position: 'absolute',
//       bottom: 0,
//       right: 0,
//       backgroundColor: '#10b981',
//       color: 'white',
//       padding: '0.5rem',
//       borderRadius: '50%',
//       cursor: 'pointer',
//       fontSize: '0.875rem'
//     },
//     avatarInput: {
//       display: 'none'
//     },
//     fieldContainer: {
//       marginBottom: '0.75rem'
//     },
//     label: {
//       fontSize: '0.875rem',
//       color: '#6b7280',
//       display: 'block',
//       marginBottom: '0.25rem'
//     },
//     input: {
//       width: '100%',
//       padding: '0.5rem 0.75rem',
//       border: '1px solid #d1d5db',
//       borderRadius: '0.25rem',
//       fontSize: '0.875rem',
//       outline: 'none',
//       boxSizing: 'border-box'
//     },
//     inputDisabled: {
//       backgroundColor: '#f3f4f6'
//     },
//     buttonContainer: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     },
//     logoutButton: {
//       color: '#dc2626',
//       background: 'none',
//       border: 'none',
//       cursor: 'pointer',
//       fontSize: '0.875rem',
//       textDecoration: 'none'
//     },
//     actionButtons: {
//       display: 'flex',
//       gap: '0.5rem'
//     },
//     cancelButton: {
//       padding: '0.5rem 1rem',
//       border: '1px solid #d1d5db',
//       borderRadius: '0.25rem',
//       backgroundColor: 'white',
//       cursor: 'pointer',
//       fontSize: '0.875rem'
//     },
//     saveButton: {
//       padding: '0.5rem 1rem',
//       backgroundColor: '#10b981',
//       color: 'white',
//       borderRadius: '0.25rem',
//       border: 'none',
//       cursor: 'pointer',
//       fontSize: '0.875rem',
//       transition: 'background-color 0.2s'
//     },
//     saveButtonDisabled: {
//       opacity: 0.5,
//       cursor: 'not-allowed'
//     }
//   };

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.modal}>
//         {/* Header */}
//         <div style={styles.header}>
//           <h3 style={styles.headerTitle}>Profile</h3>
//           <button onClick={onClose} style={styles.closeButton}>
//             ✕
//           </button>
//         </div>

//         {/* Body */}
//         <div style={styles.body}>
//           {/* Avatar */}
//           <div style={styles.avatarContainer}>
//             <div style={styles.avatarWrapper}>
//               <img
//                 src={avatar || "/user-avatar.png"}
//                 alt="profile"
//                 style={styles.avatar}
//               />

//               <label
//                 htmlFor="avatarUpload"
//                 style={styles.avatarLabel}
//               >
//                 📷
//               </label>

//               <input
//                 type="file"
//                 id="avatarUpload"
//                 style={styles.avatarInput}
//                 accept="image/*"
//                 onChange={(e) => handleAvatarChange(e.target.files[0])}
//               />
//             </div>
//           </div>

//           {/* Email (Read Only) */}
//           <div style={styles.fieldContainer}>
//             <label style={styles.label}>Email</label>
//             <input
//               type="text"
//               value={user.email}
//               disabled
//               style={{...styles.input, ...styles.inputDisabled}}
//             />
//           </div>

//           {/* Name */}
//           <div style={styles.fieldContainer}>
//             <label style={styles.label}>Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               style={styles.input}
//             />
//           </div>

//           {/* Status */}
//           <div style={{...styles.fieldContainer, marginBottom: '1rem'}}>
//             <label style={styles.label}>Status</label>
//             <input
//               type="text"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               style={styles.input}
//             />
//           </div>

//           {/* Buttons */}
//           <div style={styles.buttonContainer}>
//             <button
//               onClick={handleLogout}
//               style={styles.logoutButton}
//               onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
//               onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
//             >
//               Logout
//             </button>

//             <div style={styles.actionButtons}>
//               <button
//                 onClick={onClose}
//                 style={styles.cancelButton}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={loading}
//                 style={{
//                   ...styles.saveButton,
//                   ...(loading ? styles.saveButtonDisabled : {})
//                 }}
//                 onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
//                 onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#10b981')}
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileModal;

// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import { useAuthStore } from "../../store/authStore";

// const ProfileModal = ({ isOpen, onClose }) => {
//   const { user, logout } = useAuthStore();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // ----------------------------
//   // FETCH PROFILE
//   // ----------------------------
//   useEffect(() => {
//     if (!isOpen) return;

//     api.get("/users/me").then((res) => {
//       setProfile(res.data);
//     });
//   }, [isOpen]);

//   if (!isOpen || !profile) return null;

//   // ----------------------------
//   // AVATAR UPLOAD (FIXED)
//   // ----------------------------
//   const handleAvatarChange = async (file) => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file); // ✅ MUST BE "image"

//     try {
//       setLoading(true);

//       const res = await api.post(
//         "/users/upload-avatar",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setProfile(res.data); // instant UI update
//     } catch (err) {
//       console.error("Avatar upload failed", err);
//       alert("Avatar upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----------------------------
//   // SAVE NAME / STATUS
//   // ----------------------------
//   const handleSave = async () => {
//     try {
//       setLoading(true);

//       await api.put("/users/profile", {
//         name: profile.name,
//         status: profile.status,
//       });

//       onClose();
//     } catch (err) {
//       console.error("Profile update failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     window.location.href = "/";
//   };

//   return (
//     <div style={overlayStyle}>
//       <div style={modalStyle}>
//         {/* HEADER */}
//         <div style={headerStyle}>
//           <h3>Profile</h3>
//           <button onClick={onClose}>✕</button>
//         </div>

//         {/* BODY */}
//         <div style={{ padding: 16 }}>
//           {/* AVATAR */}
//           <div style={{ textAlign: "center", marginBottom: 16 }}>
//             <img
//               src={profile.avatar || "/user-avatar.png"}
//               alt="avatar"
//               style={{ width: 96, height: 96, borderRadius: "50%" }}
//             />

//             <label style={uploadBtn}>
//               📷 Change
//               <input
//                 type="file"
//                 hidden
//                 accept="image/*"
//                 onChange={(e) =>
//                   handleAvatarChange(e.target.files[0])
//                 }
//               />
//             </label>
//           </div>

//           {/* EMAIL */}
//           <Field label="Email">
//             <input value={profile.email} disabled style={inputStyle} />
//           </Field>

//           {/* NAME */}
//           <Field label="Name">
//             <input
//               value={profile.name}
//               onChange={(e) =>
//                 setProfile({ ...profile, name: e.target.value })
//               }
//               style={inputStyle}
//             />
//           </Field>

//           {/* STATUS */}
//           <Field label="Status">
//             <input
//               value={profile.status || ""}
//               onChange={(e) =>
//                 setProfile({ ...profile, status: e.target.value })
//               }
//               style={inputStyle}
//             />
//           </Field>

//           {/* FOOTER */}
//           <div style={footerStyle}>
//             <button onClick={handleLogout} style={{ color: "red" }}>
//               Logout
//             </button>

//             <div>
//               <button onClick={onClose}>Cancel</button>
//               <button
//                 onClick={handleSave}
//                 disabled={loading}
//                 style={saveBtn}
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ----------------------------
// // SMALL REUSABLE COMPONENTS
// // ----------------------------
// const Field = ({ label, children }) => (
//   <div style={{ marginBottom: 12 }}>
//     <label style={{ fontSize: 13, color: "#6b7280" }}>{label}</label>
//     {children}
//   </div>
// );

// // ----------------------------
// // STYLES
// // ----------------------------
// const overlayStyle = {
//   position: "fixed",
//   inset: 0,
//   backgroundColor: "rgba(0,0,0,0.4)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 50,
// };

// const modalStyle = {
//   backgroundColor: "white",
//   width: 360,
//   borderRadius: 8,
// };

// const headerStyle = {
//   padding: "12px 16px",
//   backgroundColor: "#3b82f6",
//   color: "white",
//   display: "flex",
//   justifyContent: "space-between",
// };

// const inputStyle = {
//   width: "100%",
//   padding: 8,
//   border: "1px solid #d1d5db",
//   borderRadius: 4,
// };

// const footerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
// };

// const uploadBtn = {
//   display: "inline-block",
//   marginTop: 8,
//   cursor: "pointer",
//   color: "#2563eb",
// };

// const saveBtn = {
//   marginLeft: 8,
//   backgroundColor: "#10b981",
//   color: "white",
//   padding: "6px 12px",
//   borderRadius: 4,
// };

// export default ProfileModal;
import { useAuthStore } from "../../store/authStore";
import api from "../../services/api";
import { useState, useEffect } from "react";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAvatarChange = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await api.post("/users/upload-avatar", formData);
      setUser(res.data);
    } catch {
      alert("Avatar upload failed");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      animation: "fadeIn 0.3s ease"
    },
    modal: {
      background: "#ffffff",
      width: window.innerWidth < 480 ? "90%" : "420px",
      maxWidth: "500px",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      animation: "slideUp 0.3s ease",
      overflow: "hidden"
    },
    header: {
      padding: window.innerWidth < 480 ? "1.25rem 1.25rem 1rem" : "1.5rem 1.5rem 1rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      position: "relative"
    },
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    title: {
      fontSize: window.innerWidth < 480 ? "1.25rem" : "1.5rem",
      fontWeight: 700,
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    closeButton: {
      background: "rgba(255, 255, 255, 0.2)",
      border: "none",
      color: "white",
      fontSize: "1.5rem",
      cursor: "pointer",
      padding: "0.25rem 0.5rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
      width: "2rem",
      height: "2rem"
    },
    content: {
      padding: window.innerWidth < 480 ? "1.5rem" : "2rem"
    },
    avatarSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "2rem"
    },
    avatarWrapper: {
      position: "relative",
      cursor: "pointer"
    },
    avatar: {
      width: window.innerWidth < 480 ? "120px" : "140px",
      height: window.innerWidth < 480 ? "120px" : "140px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #667eea",
      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
      transition: "all 0.3s ease"
    },
    avatarOverlay: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0,
      transition: "opacity 0.3s ease",
      cursor: "pointer"
    },
    avatarIcon: {
      fontSize: "2rem",
      color: "white"
    },
    uploadButton: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      padding: "0.625rem 1.5rem",
      borderRadius: "24px",
      fontSize: "0.875rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    infoSection: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginBottom: "2rem"
    },
    infoCard: {
      backgroundColor: "#f9fafb",
      padding: "1rem 1.25rem",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      transition: "all 0.2s ease"
    },
    infoLabel: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "#667eea",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: "0.25rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    infoValue: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#1f2937",
      margin: 0,
      wordBreak: "break-word"
    },
    footer: {
      padding: window.innerWidth < 480 ? "1rem 1.5rem" : "1.25rem 2rem",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      gap: "0.75rem",
      justifyContent: "space-between",
      backgroundColor: "#f9fafb"
    },
    button: {
      flex: 1,
      padding: "0.75rem 1.5rem",
      borderRadius: "12px",
      fontSize: "0.95rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem"
    },
    logoutButton: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      border: "1px solid #fecaca"
    },
    closeButtonFooter: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      border: "1px solid #e5e7eb"
    },
    loadingOverlay: {
      position: "absolute",
      inset: 0,
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(2px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      borderRadius: "20px",
      zIndex: 10
    },
    loadingSpinner: {
      width: "40px",
      height: "40px",
      border: "4px solid #e5e7eb",
      borderTop: "4px solid #667eea",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    loadingText: {
      fontSize: "0.95rem",
      fontWeight: 600,
      color: "#667eea"
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .avatar-wrapper:hover .avatar-overlay {
            opacity: 1;
          }
          
          .avatar-wrapper:hover .avatar {
            transform: scale(1.05);
          }
        `}
      </style>

      {/* OVERLAY */}
      <div style={styles.overlay} onClick={onClose}>
        {/* MODAL */}
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* LOADING OVERLAY */}
          {loading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Updating your profile...</p>
            </div>
          )}

          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerContent}>
              <h2 style={styles.title}>
                <span>👤</span>
                My Profile
              </h2>
              <button
                style={styles.closeButton}
                onClick={onClose}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                  e.target.style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.transform = "rotate(0deg)";
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div style={styles.content}>
            {/* AVATAR SECTION */}
            <div style={styles.avatarSection}>
              <label style={styles.avatarWrapper} className="avatar-wrapper">
                <img
                  src={user?.avatar || "/user-avatar.png"}
                  alt={user?.name}
                  style={styles.avatar}
                  className="avatar"
                />
                <div style={styles.avatarOverlay} className="avatar-overlay">
                  <span style={styles.avatarIcon}>📷</span>
                </div>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleAvatarChange(e.target.files[0])}
                  disabled={loading}
                />
              </label>

              <label>
                <button
                  style={styles.uploadButton}
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  disabled={loading}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                  }}
                >
                  <span>📷</span>
                  Change Photo
                </button>
              </label>
            </div>

            {/* INFO SECTION */}
            <div style={styles.infoSection}>
              <div
                style={styles.infoCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={styles.infoLabel}>
                  <span>👤</span>
                  Name
                </div>
                <p style={styles.infoValue}>{user?.name || "Not set"}</p>
              </div>

              <div
                style={styles.infoCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={styles.infoLabel}>
                  <span>📧</span>
                  Email
                </div>
                <p style={styles.infoValue}>{user?.email || "Not set"}</p>
              </div>

              <div
                style={styles.infoCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={styles.infoLabel}>
                  <span>📅</span>
                  Member Since
                </div>
                <p style={styles.infoValue}>
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={styles.footer}>
            <button
              style={{
                ...styles.button,
                ...styles.logoutButton,
                ...(hoveredButton === 'logout' ? {
                  backgroundColor: "#fecaca",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)"
                } : {})
              }}
              onClick={logout}
              onMouseEnter={() => setHoveredButton('logout')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <span>🚪</span>
              Logout
            </button>

            <button
              style={{
                ...styles.button,
                ...styles.closeButtonFooter,
                ...(hoveredButton === 'close' ? {
                  backgroundColor: "#e5e7eb",
                  transform: "translateY(-2px)"
                } : {})
              }}
              onClick={onClose}
              onMouseEnter={() => setHoveredButton('close')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;