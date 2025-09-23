// Register.jsx
import { useState } from "react";
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
    role: "comum", // novo campo com valor padrão
  });

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

      // Salva dados extras no Firestore, incluindo o role
      await setDoc(doc(db, "users", user.uid), {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        role: form.role,
      });

      alert("Cadastro realizado com sucesso!");
      // ❌ removemos navigate, pois agora está dentro do Profile
    } catch (error) {
      alert("Erro no cadastro: " + error.message);
    }
  };

  return (
    <form className="form" onSubmit={handleRegister}>
      <p className="title">Registrar novo usuário</p>

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

      <label>
        <span>Role</span>
        <select className="input" name="role" value={form.role} onChange={handleChange}>
          <option value="comum">Comum</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <button type="submit" className="submit">
        Criar usuário
      </button>
    </form>
  );
}

export default Register;
