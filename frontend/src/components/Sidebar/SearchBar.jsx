import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  const styles = {
    container: {
      padding: window.innerWidth < 480 ? "0.75rem" : "1rem 1.25rem",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e5e7eb"
    },
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    searchIcon: {
      position: "absolute",
      left: "1rem",
      fontSize: "1.1rem",
      color: isFocused ? "#667eea" : "#9ca3af",
      transition: "color 0.3s ease",
      pointerEvents: "none"
    },
    input: {
      width: "100%",
      padding: window.innerWidth < 480 
        ? "0.625rem 2.5rem 0.625rem 2.75rem" 
        : "0.75rem 2.75rem 0.75rem 3rem",
      borderRadius: "24px",
      backgroundColor: isFocused ? "#ffffff" : "#f3f4f6",
      border: isFocused ? "2px solid #667eea" : "2px solid #e5e7eb",
      outline: "none",
      fontSize: window.innerWidth < 480 ? "0.875rem" : "0.95rem",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      boxShadow: isFocused ? "0 0 0 3px rgba(102, 126, 234, 0.1)" : "none"
    },
    clearButton: {
      position: "absolute",
      right: "0.75rem",
      background: "none",
      border: "none",
      color: "#9ca3af",
      cursor: "pointer",
      fontSize: "1.1rem",
      padding: "0.25rem",
      display: query ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      transition: "all 0.2s ease",
      width: "1.5rem",
      height: "1.5rem"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputWrapper}>
        <span style={styles.searchIcon}>🔍</span>
        
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search chats..."
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <button
          style={styles.clearButton}
          onClick={clearSearch}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f3f4f6";
            e.target.style.color = "#374151";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#9ca3af";
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SearchBar;