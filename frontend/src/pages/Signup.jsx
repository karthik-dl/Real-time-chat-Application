// import { useState } from "react";
// import { useAuthStore } from "../store/authStore";
// import { useNavigate, Link } from "react-router-dom";

// const Signup = () => {
//   const { signup } = useAuthStore();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await signup(form);
//     navigate("/chat");
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: '100vh',
//       backgroundColor: '#f3f4f6'
//     },
//     form: {
//       backgroundColor: 'white',
//       padding: '1.5rem',
//       borderRadius: '0.375rem',
//       boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//       width: '20rem'
//     },
//     title: {
//       fontSize: '1.25rem',
//       fontWeight: '600',
//       marginBottom: '1rem'
//     },
//     input: {
//       width: '100%',
//       padding: '0.5rem',
//       border: '1px solid #d1d5db',
//       borderRadius: '0.25rem',
//       fontSize: '0.875rem',
//       outline: 'none',
//       boxSizing: 'border-box'
//     },
//     inputMargin: {
//       marginTop: '0.5rem'
//     },
//     button: {
//       width: '100%',
//       backgroundColor: '#10b981',
//       color: 'white',
//       padding: '0.5rem',
//       borderRadius: '0.25rem',
//       marginTop: '1rem',
//       border: 'none',
//       cursor: 'pointer',
//       fontSize: '1rem',
//       transition: 'background-color 0.2s'
//     },
//     text: {
//       fontSize: '0.875rem',
//       marginTop: '0.75rem',
//       textAlign: 'center'
//     },
//     link: {
//       color: '#2563eb',
//       textDecoration: 'none'
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <h2 style={styles.title}>Signup</h2>

//         <input
//           placeholder="Name"
//           style={styles.input}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />
//         <input
//           placeholder="Email"
//           style={{...styles.input, ...styles.inputMargin}}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           style={{...styles.input, ...styles.inputMargin}}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />

//         <button 
//           style={styles.button}
//           onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
//           onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
//         >
//           Signup
//         </button>

//         <p style={styles.text}>
//           Have an account?{' '}
//           <Link 
//             to="/" 
//             style={styles.link}
//             onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
//             onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
//           >
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Signup;

// ....................................................................
// .........................................
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate("/chat");
    } catch (err) {
      console.error("Signup failed");
    }
  };

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "1rem"
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: window.innerWidth < 480 ? "1.5rem" : "2.5rem",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      width: "100%",
      maxWidth: "420px",
      backdropFilter: "blur(10px)"
    },
    headerSection: {
      textAlign: "center",
      marginBottom: "2rem"
    },
    mainHeading: {
      fontSize: window.innerWidth < 480 ? "1.4rem" : "1.75rem",
      fontWeight: "700",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "0.5rem",
      letterSpacing: "-0.5px"
    },
    subtitle: {
      fontSize: window.innerWidth < 480 ? "0.85rem" : "0.95rem",
      color: "#6b7280",
      marginBottom: "1.5rem"
    },
    title: {
      fontSize: window.innerWidth < 480 ? "1.25rem" : "1.5rem",
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: "0.5rem"
    },
    inputGroup: {
      marginBottom: "1.25rem"
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "0.5rem"
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      border: "2px solid #e5e7eb",
      borderRadius: "10px",
      fontSize: "0.95rem",
      outline: "none",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      backgroundColor: "#f9fafb"
    },
    inputFocus: {
      border: "2px solid #667eea",
      backgroundColor: "white"
    },
    button: {
      width: "100%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "0.875rem",
      borderRadius: "10px",
      marginTop: "1.5rem",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)"
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed"
    },
    divider: {
      display: "flex",
      alignItems: "center",
      margin: "1.5rem 0",
      color: "#9ca3af",
      fontSize: "0.875rem"
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      backgroundColor: "#e5e7eb"
    },
    dividerText: {
      padding: "0 1rem"
    },
    text: {
      fontSize: "0.95rem",
      textAlign: "center",
      color: "#6b7280"
    },
    link: {
      color: "#667eea",
      textDecoration: "none",
      fontWeight: "600",
      transition: "color 0.3s ease"
    },
    linkHover: {
      color: "#764ba2",
      textDecoration: "underline"
    },
    icon: {
      fontSize: window.innerWidth < 480 ? "2rem" : "2.5rem",
      marginBottom: "1rem"
    }
  };

  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headerSection}>
          <div style={styles.icon}>💬</div>
          <h1 style={styles.mainHeading}>Welcome to Real-Time Chat</h1>
          <p style={styles.subtitle}>Connect instantly with friends and family</p>
          <h2 style={styles.title}>Create Account</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              placeholder="Enter your name"
              style={{
                ...styles.input,
                ...(focusedInput === "name" ? styles.inputFocus : {})
              }}
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput(null)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              style={{
                ...styles.input,
                ...(focusedInput === "email" ? styles.inputFocus : {})
              }}
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              style={{
                ...styles.input,
                ...(focusedInput === "password" ? styles.inputFocus : {})
              }}
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isSigningUp ? styles.buttonDisabled : {})
            }}
            disabled={isSigningUp}
            onMouseEnter={(e) => {
              if (!isSigningUp) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
            }}
          >
            {isSigningUp ? "Creating Account..." : "Sign Up"}
          </button>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>OR</span>
            <div style={styles.dividerLine}></div>
          </div>

          <p style={styles.text}>
            Already have an account?{" "}
            <Link
              to="/"
              style={styles.link}
              onMouseEnter={(e) => {
                e.target.style.color = "#764ba2";
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#667eea";
                e.target.style.textDecoration = "none";
              }}
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;