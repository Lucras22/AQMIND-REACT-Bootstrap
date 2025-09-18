import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AQMIND = () => {
  const [aqmind, setAQMIND] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    formato: "cilindro",
    altura: "",
    raio: "",
    largura: "",
    comprimento: "",
  });

  // 🔹 Captura usuário logado
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        carregarReservatorios(currentUser.uid);
      } else {
        setUser(null);
        setAQMIND([]);
      }
    });
    return () => unsub();
  }, []);

  // 🔹 Função para carregar reservatórios do Firestore
  const carregarReservatorios = async (uid) => {
    try {
      const ref = collection(db, "users", uid, "reservatorios");
      const q = query(ref, orderBy("criadoEm", "desc"));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAQMIND(lista);
    } catch (error) {
      console.error("Erro ao carregar reservatórios:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calcularVolume = () => {
    if (formData.formato === "cilindro") {
      const h = parseFloat(formData.altura) || 0;
      const r = parseFloat(formData.raio) || 0;
      return Math.PI * r * r * h;
    } else {
      const h = parseFloat(formData.altura) || 0;
      const l = parseFloat(formData.largura) || 0;
      const c = parseFloat(formData.comprimento) || 0;
      return l * c * h;
    }
  };

  // 🔹 Salvar novo reservatório
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Você precisa estar logado para criar reservatórios.");
      return;
    }

    const volume = calcularVolume();

    const novoReservatorio = {
      nome: formData.nome,
      endereco: formData.endereco,
      formato: formData.formato,
      altura: formData.altura ? parseFloat(formData.altura) : null,
      raio: formData.raio ? parseFloat(formData.raio) : null,
      largura: formData.largura ? parseFloat(formData.largura) : null,
      comprimento: formData.comprimento ? parseFloat(formData.comprimento) : null,
      volume: volume,
      criadoEm: new Date(),
      usuarioId: user.uid,
    };

    try {
      const ref = collection(db, "users", user.uid, "reservatorios");
      const docRef = await addDoc(ref, novoReservatorio);

      // Atualiza localmente com ID do Firestore
      setAQMIND([{ id: docRef.id, ...novoReservatorio }, ...aqmind]);
      setShowForm(false);

      // Reset form
      setFormData({
        nome: "",
        endereco: "",
        formato: "cilindro",
        altura: "",
        raio: "",
        largura: "",
        comprimento: "",
      });
    } catch (error) {
      console.error("Erro ao salvar reservatório:", error);
    }
  };

  // 🔹 Excluir reservatório
  const handleDelete = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "reservatorios", id));
      setAQMIND(aqmind.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Erro ao excluir reservatório:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Reservatórios</h1>

      {!user ? (
        <p>⚠️ Faça login para gerenciar seus reservatórios.</p>
      ) : (
        <>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "Criar Reservatório"}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
              <div>
                <label>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Endereço:</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Formato:</label>
                <select
                  name="formato"
                  value={formData.formato}
                  onChange={handleChange}
                >
                  <option value="cilindro">Cilindro</option>
                  <option value="retangular">Retangular</option>
                </select>
              </div>

              {formData.formato === "cilindro" ? (
                <>
                  <label>Altura (m):</label>
                  <input
                    type="number"
                    name="altura"
                    value={formData.altura}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                  <label>Raio (m):</label>
                  <input
                    type="number"
                    name="raio"
                    value={formData.raio}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </>
              ) : (
                <>
                  <label>Altura (m):</label>
                  <input
                    type="number"
                    name="altura"
                    value={formData.altura}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                  <label>Largura (m):</label>
                  <input
                    type="number"
                    name="largura"
                    value={formData.largura}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                  <label>Comprimento (m):</label>
                  <input
                    type="number"
                    name="comprimento"
                    value={formData.comprimento}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </>
              )}

              <button type="submit">Salvar</button>
            </form>
          )}

          <h2 style={{ marginTop: "30px" }}>Lista de Reservatórios</h2>
          {aqmind.length === 0 ? (
            <p>Nenhum reservatório cadastrado.</p>
          ) : (
            <table border="1" cellPadding="8" cellSpacing="0">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Endereço</th>
                  <th>Formato</th>
                  <th>Volume (m³)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {aqmind.map((r) => (
                  <tr key={r.id}>
                    <td>{r.nome}</td>
                    <td>{r.endereco}</td>
                    <td>{r.formato}</td>
                    <td>{r.volume ? r.volume.toFixed(2) : "—"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{ color: "red" }}
                      >
                        🗑 Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default AQMIND;
