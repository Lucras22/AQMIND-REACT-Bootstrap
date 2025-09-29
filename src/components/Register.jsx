// src/pages/Register.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "comum",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        role: form.role,
        createdAt: new Date(),
      });

      setSuccess("Usuário criado com sucesso!");
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "comum",
      });

      // Opcional: redirecionar para login ou outra página
      // navigate("/login");
    } catch (err) {
      setError("Erro no cadastro: " + err.message);
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow p-4 border-0"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}
      >
        <h3 className="text-center text-primary mb-4 fw-bold">Registrar Usuário</h3>

        {error && <div className="alert alert-danger py-2 text-center">{error}</div>}
        {success && <div className="alert alert-success py-2 text-center">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label text-secondary">Nome</label>
            <input
              type="text"
              name="firstname"
              className="form-control"
              required
              value={form.firstname}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary">Sobrenome</label>
            <input
              type="text"
              name="lastname"
              className="form-control"
              required
              value={form.lastname}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary">Senha</label>
            <input
              type="password"
              name="password"
              className="form-control"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary">Confirmar senha</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              required
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary">Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="comum">Comum</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Criar usuário
          </button>
        </form>
      </div>
    </div>
  );
}
