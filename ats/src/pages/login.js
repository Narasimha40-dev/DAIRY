import React, { useState } from "react";

// --- NEW BACKGROUND & LAYOUT ---
export default function AuthPage(props) {
  const [showLogin, setShowLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [signupDetails, setSignupDetails] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
        background: "#97b7b7",
      }}
    >
      {/* Main container with left info and right form */}
      <div
        style={{
          display: "flex",
          width: "90vw",
          maxWidth: 1100,
          minHeight: 520,
          background: "none",
          borderRadius: 28,
          boxShadow: "0 8px 32px 0 rgba(56,182,255,0.13)",
          overflow: "hidden",
        }}
      >
        {/* Left info panel */}
        <div
          style={{
            flex: 1.2,
            background: "linear-gradient(135deg, #e0eafc 0%, #b2fefa 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "48px 48px 48px 56px",
            position: "relative",
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 180,
            height: 180,
            background: "rgba(67,198,172,0.18)",
            borderRadius: "50%",
            zIndex: 0,
          }} />
          <div style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 160,
            height: 160,
            background: "rgba(67,198,172,0.18)",
            borderRadius: "50%",
            zIndex: 0,
          }} />
          {/* Info text */}
          <div style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            textAlign: "left",
          }}>
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "#232946",
              marginBottom: 10,
              letterSpacing: "1.5px",
            }}>
              Astrolite Tech Solutions
            </h1>
            <div style={{
              fontSize: "1.18rem",
              color: "#232946",
              marginBottom: 28,
              fontWeight: 500,
              opacity: 0.8,
            }}>
              Empowering Dairy with Technology
            </div>
            <div style={{
              fontSize: "1.15rem",
              color: "#232946",
              fontWeight: 700,
              marginBottom: 10,
            }}>
              Welcome to MilkDash!
            </div>
            <div style={{
              fontSize: "1.08rem",
              color: "#232946",
              fontWeight: 500,
              lineHeight: 1.6,
            }}>
              Your modern dairy management dashboard.<br />
              Sign up or log in to continue.
            </div>
          </div>
        </div>
        {/* Right login/signup card */}
        <div
          style={{
            flex: 1,
            minWidth: 340,
            maxWidth: 420,
            background: "rgba(255,255,255,0.85)",
            borderRadius: "0 24px 24px 0",
            boxShadow: "0 8px 32px 0 rgba(56,182,255,0.18)",
            backdropFilter: "blur(18px)",
            border: "1.5px solid rgba(56,182,255,0.18)",
            padding: "38px 32px 32px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            color: "#232946",
            letterSpacing: "2px",
            marginBottom: 8,
            textShadow: "0 2px 12px #b2fefa",
          }}>
            <i className="bi bi-shield-lock" style={{ marginRight: 10, color: "#43c6ac" }} />
            Dairy Login
          </div>
          <div style={{ width: "100%", marginTop: 8 }}>
            {showForgot ? (
              <ForgotPasswordForm onBack={() => setShowForgot(false)} />
            ) : showLogin ? (
              <LoginForm
                onSwitch={() => setShowLogin(false)}
                onAuth={props.onAuth}
                onForgot={() => setShowForgot(true)}
                signupDetails={signupDetails}
              />
            ) : (
              <SignupForm
                onSwitch={() => setShowLogin(true)}
                onAuth={() => {
                  setShowLogin(true); // After sign up, show login
                }}
                setUserImage={props.setUserImage}
                setSignupDetails={setSignupDetails}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- FORM COMPONENTS (fields unchanged, only style updated) ---
function LoginForm({ onSwitch, onAuth, onForgot, signupDetails }) {
  const [email, setEmail] = useState(signupDetails?.email || "");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (signupDetails && (email !== signupDetails.email || password !== signupDetails.password)) {
      alert("Please enter the same email and password you used for sign up.");
      return;
    }
    onAuth();
  }

  return (
    <form style={formStyles.formBox} onSubmit={handleSubmit}>
      <div style={formStyles.formTitle}>Login</div>
      {signupDetails && (
        <div style={{ color: "#43c6ac", marginBottom: 10, fontSize: 15 }}>
          Please login with the details you just signed up:<br />
          <b>Name:</b> {signupDetails.name}<br />
          <b>Email:</b> {signupDetails.email}
        </div>
      )}
      <label style={formStyles.label}>Email <span style={{ color: "#e53935" }}>*</span></label>
      <input
        style={formStyles.input}
        type="email"
        placeholder="Eg: abcd@gmail.com"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <label style={formStyles.label}>Password <span style={{ color: "#e53935" }}>*</span></label>
      <input
        style={formStyles.input}
        type="password"
        placeholder="Enter your password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div style={{ textAlign: "right", marginBottom: 10 }}>
        <span style={formStyles.link} onClick={onForgot}>
          Forgot password?
        </span>
      </div>
      <button style={formStyles.button} type="submit">
        Login
      </button>
      <div style={formStyles.switchText}>
        Don't have an account?{" "}
        <span style={formStyles.link} onClick={onSwitch}>
          Sign Up
        </span>
      </div>
    </form>
  );
}

function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSaved(true);
  }

  return (
    <form style={formStyles.formBox} onSubmit={handleSubmit}>
      <div style={formStyles.formTitle}>Forgot Password</div>
      {saved ? (
        <div style={{ textAlign: "center", color: "#43c6ac", margin: 20 }}>
          Your password has been reset.<br />
          <span style={formStyles.link} onClick={onBack}>
            Back to Login
          </span>
        </div>
      ) : (
        <>
          <label style={formStyles.label}>Email <span style={{ color: "#e53935" }}>*</span></label>
          <input
            style={formStyles.input}
            type="email"
            placeholder="Eg: abcd@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label style={formStyles.label}>New Password <span style={{ color: "#e53935" }}>*</span></label>
          <input
            style={formStyles.input}
            type="password"
            placeholder="Enter new password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label style={formStyles.label}>Confirm Password <span style={{ color: "#e53935" }}>*</span></label>
          <input
            style={formStyles.input}
            type="password"
            placeholder="Re-enter new password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <div style={{ color: "#e53935", marginBottom: 8, fontSize: 14 }}>
              {error}
            </div>
          )}
          <button style={formStyles.button} type="submit">
            Save Password
          </button>
          <div style={formStyles.switchText}>
            <span style={formStyles.link} onClick={onBack}>
              Back to Login
            </span>
          </div>
        </>
      )}
    </form>
  );
}

function SignupForm({ onSwitch, onAuth, setUserImage, setSignupDetails }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (setUserImage && preview) setUserImage(preview);
    if (setSignupDetails) {
      setSignupDetails({
        name,
        email,
        password,
      });
    }
    onAuth();
  }

  return (
    <form style={formStyles.formBox} onSubmit={handleSubmit}>
      <div style={formStyles.formTitle}>Sign Up</div>
      <label style={formStyles.label}>Full Name <span style={{ color: "#e53935" }}>*</span></label>
      <input
        style={formStyles.input}
        type="text"
        placeholder="Nanu s"
        required
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <label style={formStyles.label}>Email <span style={{ color: "#e53935" }}>*</span></label>
      <input
        style={formStyles.input}
        type="email"
        placeholder="Eg: abcd@gmail.com"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <label style={formStyles.label}>Password <span style={{ color: "#e53935" }}>*</span></label>
      <input
        style={formStyles.input}
        type="password"
        placeholder="At least 6 characters"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <label style={formStyles.label}>Confirm Password <span style={{ color: "#e53935" }}>*</span></label>
      <input
        style={formStyles.input}
        type="password"
        placeholder="Re-enter password"
        required
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <label style={formStyles.label}>Profile Image</label>
      <input
        type="file"
        accept="image/*"
        style={{ marginBottom: 10 }}
        onChange={handleImageChange}
      />
      {preview && (
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <img
            src={preview}
            alt="Preview"
            style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "2px solid #43c6ac" }}
          />
        </div>
      )}
      <button style={formStyles.button} type="submit">
        Sign Up
      </button>
      <div style={formStyles.switchText}>
        Already have an account?{" "}
        <span style={formStyles.link} onClick={onSwitch}>
          Login
        </span>
      </div>
    </form>
  );
}

// --- FORM STYLES (glassmorphism, modern) ---
const formStyles = {
  formBox: {
    background: "rgba(255,255,255,0.82)",
    borderRadius: 18,
    boxShadow: "0 0 16px #38b6ff44",
    padding: "18px 24px",
    minWidth: 0,
    maxWidth: "100%",
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    maxHeight: "none",
    border: "1px solid #38b6ff22",
    backdropFilter: "blur(8px)",
  },
  formTitle: {
    textAlign: "center",
    color: "#38b6ff",
    fontWeight: 700,
    fontSize: "1.35rem",
    marginBottom: 18,
    letterSpacing: "1px",
    textShadow: "0 2px 8px #b2fefa",
  },
  label: {
    fontWeight: 600,
    color: "#23395d",
    marginBottom: 2,
    marginTop: 10,
    fontSize: "1rem",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0 10px 0",
    borderRadius: 8,
    border: "1.5px solid #bfc9d1",
    fontSize: "1rem",
    background: "#f4f7fa",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    boxShadow: "0 1px 4px rgba(79, 140, 255, 0.04)",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: 10,
    background: "linear-gradient(90deg, #38b6ff 60%, #43c6ac 100%)",
    color: "white",
    fontSize: 17,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    letterSpacing: 1,
    boxShadow: "0 2px 8px rgba(67, 198, 172, 0.13)",
    transition: "background 0.2s, transform 0.1s",
  },
  link: {
    color: "#38b6ff",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.97em",
  },
  switchText: {
    textAlign: "center",
    marginTop: 18,
    color: "#444",
    fontSize: "1em",
  },
};