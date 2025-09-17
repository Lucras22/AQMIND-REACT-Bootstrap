import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../styles/form.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/profile");
    } catch (error) {
      alert("Erro no login: " + error.message);
    }
  };

  return (
    <form className="form" onSubmit={handleLogin}>
      <p className="title">Login</p>
      <p className="message">Sign in to access your account.</p>

      <label>
        <input
          className="input"
          type="email"
          name="email"
          required
          onChange={handleChange}
        />
        <span>Email</span>
      </label>

      <label>
        <input
          className="input"
          type="password"
          name="password"
          required
          onChange={handleChange}
        />
        <span>Password</span>
      </label>

      <button type="submit" className="submit">
        Login
      </button>

      <p className="signin">
        Don’t have an account? <Link to="/register">Signup</Link>
      </p>
    </form>
  );
}

export default Login;
