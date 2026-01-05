const TypingIndicator = () => {
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      padding: window.innerWidth < 480 ? "0.5rem" : "0.75rem 1rem",
      gap: "0.5rem"
    },
    bubble: {
      backgroundColor: "#ffffff",
      padding: "0.75rem 1rem",
      borderRadius: "18px 18px 18px 4px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      gap: "0.375rem"
    },
    dot: {
      width: "8px",
      height: "8px",
      backgroundColor: "#667eea",
      borderRadius: "50%",
      animation: "bounce 1.4s infinite ease-in-out"
    },
    text: {
      fontSize: "0.8rem",
      color: "#667eea",
      fontWeight: 500,
      marginLeft: "0.5rem",
      fontStyle: "italic"
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 60%, 100% {
              transform: translateY(0);
            }
            30% {
              transform: translateY(-8px);
            }
          }
          
          .dot-1 {
            animation-delay: 0s;
          }
          
          .dot-2 {
            animation-delay: 0.2s;
          }
          
          .dot-3 {
            animation-delay: 0.4s;
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.bubble}>
          <div style={styles.dot} className="dot-1"></div>
          <div style={styles.dot} className="dot-2"></div>
          <div style={styles.dot} className="dot-3"></div>
          <span style={styles.text}>typing</span>
        </div>
      </div>
    </>
  );
};

export default TypingIndicator;