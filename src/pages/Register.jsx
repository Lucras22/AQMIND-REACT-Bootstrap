import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../styles/form.css";

function Register() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      // Cria usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      // Salva dados extras no Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/profile");
    } catch (error) {
      alert("Erro no cadastro: " + error.message);
    }
  };

  return (
    <form className="form" onSubmit={handleRegister}>
      <p className="title">Register</p>
      <p className="message">Signup now and get full access to our app.</p>

      <div className="flex">
        <label>
          <input
            className="input"
            type="text"
            name="firstname"
            required
            onChange={handleChange}
          />
          <span>Firstname</span>
        </label>

        <label>
          <input
            className="input"
            type="text"
            name="lastname"
            required
            onChange={handleChange}
          />
          <span>Lastname</span>
        </label>
      </div>

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

      <label>
        <input
          className="input"
          type="password"
          name="confirmPassword"
          required
          onChange={handleChange}
        />
        <span>Confirm password</span>
      </label>

      <button type="submit" className="submit">
        Submit
      </button>

      <p className="signin">
        Already have an account? <Link to="/login">Signin</Link>
      </p>
    </form>
  );
}

export default Register;
