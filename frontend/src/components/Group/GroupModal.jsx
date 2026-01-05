// import { useState } from "react";
// import api from "../../services/api";
// import { useChatStore } from "../../store/chatStore";

// const GroupModal = ({ isOpen, onClose, users }) => {
//   const [groupName, setGroupName] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const { fetchChats } = useChatStore();

//   if (!isOpen) return null;

//   const toggleUser = (userId) => {
//     setSelectedUsers((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const handleCreateGroup = async () => {
//     if (!groupName || selectedUsers.length < 2) {
//       alert("Enter group name & select at least 2 users");
//       return;
//     }

//     try {
//       await api.post("/groups", {
//         name: groupName,
//         members: selectedUsers,
//       });

//       await fetchChats();
//       setGroupName("");
//       setSelectedUsers([]);
//       onClose();
//     } catch (err) {
//       console.error("Group creation failed", err);
//     }
//   };

//   const styles = {
//     overlay: {
//       position: "fixed",
//       inset: 0,
//       backgroundColor: "rgba(0,0,0,0.4)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 50,
//     },
//     modal: {
//       backgroundColor: "white",
//       width: "24rem",
//       borderRadius: "0.5rem",
//       padding: "1rem",
//     },
//     title: {
//       fontSize: "1.125rem",
//       fontWeight: 600,
//       marginBottom: "0.75rem",
//     },
//     input: {
//       width: "100%",
//       padding: "0.5rem",
//       border: "1px solid #d1d5db",
//       borderRadius: "0.25rem",
//       marginBottom: "0.75rem",
//     },
//     userList: {
//       maxHeight: "10rem",
//       overflowY: "auto",
//       border: "1px solid #d1d5db",
//       borderRadius: "0.25rem",
//       padding: "0.5rem",
//     },
//     userLabel: {
//       display: "flex",
//       alignItems: "center",
//       gap: "0.5rem",
//       padding: "0.25rem 0",
//       cursor: "pointer",
//     },
//     actions: {
//       display: "flex",
//       justifyContent: "flex-end",
//       gap: "0.5rem",
//       marginTop: "1rem",
//     },
//     cancelBtn: {
//       border: "1px solid #d1d5db",
//       backgroundColor: "white",
//       borderRadius: "0.25rem",
//       padding: "0.25rem 0.75rem",
//       cursor: "pointer",
//     },
//     createBtn: {
//       backgroundColor: "#10b981",
//       color: "white",
//       border: "none",
//       borderRadius: "0.25rem",
//       padding: "0.25rem 0.75rem",
//       cursor: "pointer",
//     },
//   };

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.modal}>
//         <h3 style={styles.title}>Create Group</h3>

//         <input
//           placeholder="Group name"
//           value={groupName}
//           onChange={(e) => setGroupName(e.target.value)}
//           style={styles.input}
//         />

//         <div style={styles.userList}>
//           {users.map((u) => (
//             <label key={u._id} style={styles.userLabel}>
//               <input
//                 type="checkbox"
//                 checked={selectedUsers.includes(u._id)}
//                 onChange={() => toggleUser(u._id)}
//               />
//               {u.name}
//             </label>
//           ))}
//         </div>

//         <div style={styles.actions}>
//           <button style={styles.cancelBtn} onClick={onClose}>
//             Cancel
//           </button>
//           <button style={styles.createBtn} onClick={handleCreateGroup}>
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GroupModal;


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


import { useEffect, useState } from "react";
import api from "../../services/api";
import { useChatStore } from "../../store/chatStore";

const GroupModal = ({ onClose }) => {
  const { fetchChats, fetchUsers, users = [] } = useChatStore();

  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const createGroup = async () => {
    if (!name.trim() || selectedUsers.length < 1) {
      alert("Group name and at least 1 user required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/chats/group", {
        name,
        users: selectedUsers,
      });

      await fetchChats();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Group creation failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      animation: "fadeIn 0.3s ease"
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#ffffff",
      width: window.innerWidth < 480 ? "90%" : "440px",
      maxWidth: "500px",
      maxHeight: "85vh",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      zIndex: 1001,
      display: "flex",
      flexDirection: "column",
      animation: "slideUp 0.3s ease",
      overflow: "hidden"
    },
    header: {
      padding: window.innerWidth < 480 ? "1.25rem 1.25rem 1rem" : "1.5rem 1.5rem 1rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white"
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
    subtitle: {
      fontSize: "0.875rem",
      opacity: 0.9,
      marginTop: "0.5rem"
    },
    content: {
      padding: window.innerWidth < 480 ? "1rem" : "1.5rem",
      flex: 1,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem"
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem"
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#374151",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      border: isFocused ? "2px solid #667eea" : "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "0.95rem",
      outline: "none",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      backgroundColor: isFocused ? "#ffffff" : "#f9fafb",
      boxShadow: isFocused ? "0 0 0 3px rgba(102, 126, 234, 0.1)" : "none"
    },
    searchInput: {
      width: "100%",
      padding: "0.625rem 1rem 0.625rem 2.75rem",
      border: "2px solid #e5e7eb",
      borderRadius: "24px",
      fontSize: "0.875rem",
      outline: "none",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      backgroundColor: "#f3f4f6"
    },
    searchWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    searchIcon: {
      position: "absolute",
      left: "1rem",
      fontSize: "1rem",
      color: "#9ca3af"
    },
    selectedChips: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      minHeight: "2rem"
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.375rem 0.75rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      borderRadius: "16px",
      fontSize: "0.85rem",
      fontWeight: 500,
      animation: "scaleIn 0.2s ease"
    },
    chipRemove: {
      background: "rgba(255, 255, 255, 0.3)",
      border: "none",
      color: "white",
      cursor: "pointer",
      fontSize: "0.875rem",
      padding: "0.125rem 0.25rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease"
    },
    userList: {
      maxHeight: "240px",
      overflowY: "auto",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      backgroundColor: "#f9fafb"
    },
    userItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.875rem",
      padding: "0.875rem 1rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      borderBottom: "1px solid #e5e7eb"
    },
    userItemSelected: {
      backgroundColor: "#f0f4ff"
    },
    checkbox: {
      width: "1.25rem",
      height: "1.25rem",
      cursor: "pointer",
      accentColor: "#667eea"
    },
    userAvatar: {
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #e5e7eb"
    },
    userInfo: {
      flex: 1,
      minWidth: 0
    },
    userName: {
      fontSize: "0.95rem",
      fontWeight: 500,
      color: "#1f2937",
      margin: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    userEmail: {
      fontSize: "0.8rem",
      color: "#6b7280",
      margin: 0
    },
    emptyState: {
      textAlign: "center",
      padding: "2rem",
      color: "#9ca3af"
    },
    emptyIcon: {
      fontSize: "2.5rem",
      marginBottom: "0.5rem"
    },
    emptyText: {
      fontSize: "0.95rem",
      fontWeight: 500
    },
    footer: {
      padding: window.innerWidth < 480 ? "1rem" : "1.25rem 1.5rem",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      gap: "0.75rem",
      justifyContent: "flex-end",
      backgroundColor: "#f9fafb"
    },
    button: {
      padding: "0.75rem 1.5rem",
      borderRadius: "12px",
      fontSize: "0.95rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "none",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    cancelButton: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      border: "1px solid #e5e7eb"
    },
    createButton: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
    },
    createButtonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      boxShadow: "none"
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
              transform: translate(-50%, -45%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
          
          @keyframes scaleIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .user-list::-webkit-scrollbar {
            width: 6px;
          }
          .user-list::-webkit-scrollbar-track {
            background: transparent;
          }
          .user-list::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .user-list::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
          
          .modal-content::-webkit-scrollbar {
            width: 6px;
          }
          .modal-content::-webkit-scrollbar-track {
            background: transparent;
          }
          .modal-content::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
        `}
      </style>

      {/* OVERLAY */}
      <div style={styles.overlay} onClick={onClose} />

      {/* MODAL */}
      <div style={styles.modal}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h2 style={styles.title}>
              <span>👥</span>
              Create Group
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
          <p style={styles.subtitle}>
            Create a group and add members to start chatting
          </p>
        </div>

        {/* CONTENT */}
        <div style={styles.content} className="modal-content">
          {/* GROUP NAME INPUT */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span>📝</span>
              Group Name
            </label>
            <input
              style={styles.input}
              placeholder="Enter group name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={50}
            />
          </div>

          {/* SELECTED USERS CHIPS */}
          {selectedUsers.length > 0 && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Selected Members ({selectedUsers.length})
              </label>
              <div style={styles.selectedChips}>
                {selectedUsers.map((userId) => {
                  const user = users.find((u) => u._id === userId);
                  return (
                    <div key={userId} style={styles.chip}>
                      <span>{user?.name}</span>
                      <button
                        style={styles.chipRemove}
                        onClick={() => toggleUser(userId)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SEARCH USERS */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span>👤</span>
              Add Members
            </label>
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                style={styles.searchInput}
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* USER LIST */}
          <div style={styles.userList} className="user-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const isSelected = selectedUsers.includes(u._id);
                return (
                  <div
                    key={u._id}
                    style={{
                      ...styles.userItem,
                      ...(isSelected ? styles.userItemSelected : {})
                    }}
                    onClick={() => toggleUser(u._id)}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={isSelected}
                      onChange={() => toggleUser(u._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <img
                      src={u.avatar || "/user-avatar.png"}
                      alt={u.name}
                      style={styles.userAvatar}
                    />
                    <div style={styles.userInfo}>
                      <p style={styles.userName}>{u.name}</p>
                      {u.email && (
                        <p style={styles.userEmail}>{u.email}</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>😕</div>
                <p style={styles.emptyText}>
                  {searchQuery ? "No users found" : "No users available"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f3f4f6";
            }}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...styles.createButton,
              ...(loading || !name.trim() || selectedUsers.length < 1
                ? styles.createButtonDisabled
                : {})
            }}
            onClick={createGroup}
            disabled={loading || !name.trim() || selectedUsers.length < 1}
            onMouseEnter={(e) => {
              if (!loading && name.trim() && selectedUsers.length >= 1) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
            }}
          >
            {loading ? (
              <>
                <span>⏳</span>
                Creating...
              </>
            ) : (
              <>
                <span>✨</span>
                Create Group
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default GroupModal;