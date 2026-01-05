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
import { useState } from "react";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAvatarChange = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await api.post("/users/upload-avatar", formData);
      setUser(res.data); // 🔥 updates sidebar instantly
    } catch {
      alert("Avatar upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Profile</h3>

        <div style={{ textAlign: "center" }}>
          <img
            src={user?.avatar || "/user-avatar.png"}
            style={{ width: 100, height: 100, borderRadius: "50%" }}
          />

          <label style={{ cursor: "pointer", color: "#2563eb" }}>
            Change Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleAvatarChange(e.target.files[0])}
            />
          </label>
        </div>

        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={logout} style={{ color: "red" }}>
            Logout
          </button>
          <button onClick={onClose}>Close</button>
        </div>

        {loading && <p>Updating...</p>}
      </div>
    </div>
  );
};

export default ProfileModal;

// styles
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 300,
};
