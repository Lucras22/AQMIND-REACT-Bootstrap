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
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Modal, Button, Form } from "react-bootstrap";

const AQMIND = () => {
  const [aqmind, setAQMIND] = useState([]);
  const [user, setUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReservatorio, setCurrentReservatorio] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    formato: "cilindro",
    altura: "",
    raio: "",
    largura: "",
    comprimento: "",
  });

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

  const handleSave = async () => {
    if (!user) return alert("Você precisa estar logado.");

    const volume = calcularVolume();
    const dados = {
      ...formData,
      altura: formData.altura ? parseFloat(formData.altura) : null,
      raio: formData.raio ? parseFloat(formData.raio) : null,
      largura: formData.largura ? parseFloat(formData.largura) : null,
      comprimento: formData.comprimento ? parseFloat(formData.comprimento) : null,
      volume,
      criadoEm: new Date(),
      usuarioId: user.uid,
    };

    try {
      if (isEditing && currentReservatorio) {
        // Atualizar
        const ref = doc(db, "users", user.uid, "reservatorios", currentReservatorio.id);
        await updateDoc(ref, dados);
        setAQMIND(
          aqmind.map((r) =>
            r.id === currentReservatorio.id ? { ...r, ...dados } : r
          )
        );
      } else {
        // Criar novo
        const ref = collection(db, "users", user.uid, "reservatorios");
        const docRef = await addDoc(ref, dados);
        setAQMIND([{ id: docRef.id, ...dados }, ...aqmind]);
      }

      handleClose();
    } catch (error) {
      console.error("Erro ao salvar reservatório:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "reservatorios", id));
      setAQMIND(aqmind.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const handleEdit = (reservatorio) => {
    setIsEditing(true);
    setCurrentReservatorio(reservatorio);
    setFormData(reservatorio);
    setShowModal(true);
  };

  const handleOpen = () => {
    setIsEditing(false);
    setFormData({
      nome: "",
      endereco: "",
      formato: "cilindro",
      altura: "",
      raio: "",
      largura: "",
      comprimento: "",
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentReservatorio(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Reservatórios</h1>

      {!user ? (
        <p>⚠️ Faça login para gerenciar seus reservatórios.</p>
      ) : (
        <>
          <Button variant="primary" onClick={handleOpen}>
            Criar Reservatório
          </Button>

          <h2 className="mt-4">Lista de Reservatórios</h2>
          {aqmind.length === 0 ? (
            <p>Nenhum reservatório cadastrado.</p>
          ) : (
            <table className="table table-dark table-striped mt-3">
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
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(r)}
                      >
                        ✏ Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(r.id)}
                      >
                        🗑 Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Modal de Cadastro/Edição */}
          <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditing ? "Editar Reservatório" : "Novo Reservatório"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Nome:</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Endereço:</Form.Label>
                  <Form.Control
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Formato:</Form.Label>
                  <Form.Select
                    name="formato"
                    value={formData.formato}
                    onChange={handleChange}
                  >
                    <option value="cilindro">Cilindro</option>
                    <option value="retangular">Retangular</option>
                  </Form.Select>
                </Form.Group>

                {formData.formato === "cilindro" ? (
                  <>
                    <Form.Label>Altura (m):</Form.Label>
                    <Form.Control
                      type="number"
                      name="altura"
                      value={formData.altura}
                      onChange={handleChange}
                      step="0.01"
                    />
                    <Form.Label>Raio (m):</Form.Label>
                    <Form.Control
                      type="number"
                      name="raio"
                      value={formData.raio}
                      onChange={handleChange}
                      step="0.01"
                    />
                  </>
                ) : (
                  <>
                    <Form.Label>Altura (m):</Form.Label>
                    <Form.Control
                      type="number"
                      name="altura"
                      value={formData.altura}
                      onChange={handleChange}
                      step="0.01"
                    />
                    <Form.Label>Largura (m):</Form.Label>
                    <Form.Control
                      type="number"
                      name="largura"
                      value={formData.largura}
                      onChange={handleChange}
                      step="0.01"
                    />
                    <Form.Label>Comprimento (m):</Form.Label>
                    <Form.Control
                      type="number"
                      name="comprimento"
                      value={formData.comprimento}
                      onChange={handleChange}
                      step="0.01"
                    />
                  </>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="success" onClick={handleSave}>
                Salvar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AQMIND;
