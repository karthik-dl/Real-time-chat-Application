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

  // fetch users
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((u) => u !== id)
        : [...prev, id]
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

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />

      <div style={styles.modal}>
        <h3>Create Group</h3>

        <input
          style={styles.input}
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={styles.userList}>
          {users.map((u) => (
            <label key={u._id} style={styles.userItem}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(u._id)}
                onChange={() => toggleUser(u._id)}
              />
              {u.name}
            </label>
          ))}
        </div>

        <div style={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={createGroup} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </>
  );
};

export default GroupModal;

/* ---------- styles ---------- */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 50,
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    width: 360,
    padding: 16,
    borderRadius: 8,
    zIndex: 51,
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 10,
  },
  userList: {
    maxHeight: 180,
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: 8,
    marginBottom: 10,
  },
  userItem: {
    display: "flex",
    gap: 8,
    marginBottom: 6,
    fontSize: 14,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },
};
