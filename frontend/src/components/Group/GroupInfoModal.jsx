import api from "../../services/api";

const GroupInfoModal = ({ chat, userId, onClose }) => {
  const isAdmin = chat.admins?.includes(userId);

  const leaveGroup = async () => {
    try {
      await api.post(`/groups/${chat._id}/leave`);
      onClose();
    } catch (err) {
      console.error("Leave group failed", err);
    }
  };

  const deleteGroup = async () => {
    try {
      await api.delete(`/groups/${chat._id}`);
      onClose();
    } catch (err) {
      console.error("Delete group failed", err);
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 60,
    },
    modal: {
      backgroundColor: "white",
      width: "22rem",
      borderRadius: "0.5rem",
      padding: "1rem",
      boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    },
    title: {
      fontSize: "1.125rem",
      fontWeight: 600,
      marginBottom: "0.5rem",
    },
    membersTitle: {
      fontSize: "0.875rem",
      fontWeight: 600,
      marginTop: "0.75rem",
      marginBottom: "0.25rem",
    },
    member: {
      fontSize: "0.875rem",
      padding: "0.25rem 0",
    },
    actions: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      marginTop: "1rem",
    },
    leaveBtn: {
      backgroundColor: "#f3f4f6",
      border: "1px solid #d1d5db",
      borderRadius: "0.25rem",
      padding: "0.4rem",
      cursor: "pointer",
    },
    deleteBtn: {
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "0.25rem",
      padding: "0.4rem",
      cursor: "pointer",
    },
    closeBtn: {
      marginTop: "0.75rem",
      background: "none",
      border: "none",
      color: "#2563eb",
      cursor: "pointer",
      fontSize: "0.875rem",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>{chat.groupName}</h3>

        <div style={styles.membersTitle}>Members</div>
        {chat.members.map((m) => (
          <div key={m._id} style={styles.member}>
            {m.name}
          </div>
        ))}

        <div style={styles.actions}>
          <button style={styles.leaveBtn} onClick={leaveGroup}>
            Leave Group
          </button>

          {isAdmin && (
            <button style={styles.deleteBtn} onClick={deleteGroup}>
              Delete Group
            </button>
          )}
        </div>

        <button style={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default GroupInfoModal;
