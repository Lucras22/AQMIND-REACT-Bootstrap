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
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

// Função para gerar chave única
const gerarChave = () => {
  return crypto.randomUUID();
};

const Reservatorios = () => {
  const [reservatorios, setReservatorios] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReservatorio, setCurrentReservatorio] = useState(null);

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [reservatorioSelecionado, setReservatorioSelecionado] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    formato: "cilindro",
    altura: "",
    raio: "",
    largura: "",
    comprimento: "",
    uso: "Uso pessoal",
    quantidadePessoas: "",
  });

  // Verifica usuário logado
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          if (docSnap.data().role === "admin") {
            carregarTodosReservatorios();
          } else {
            carregarReservatorios(currentUser.uid);
          }
        }
      } else {
        setUser(null);
        setUserData(null);
        setReservatorios([]);
      }
    });
    return () => unsub();
  }, []);

  // Carregar reservatórios do usuário
  const carregarReservatorios = async (uid) => {
    try {
      const ref = collection(db, "users", uid, "reservatorios");
      const q = query(ref, orderBy("criadoEm", "desc"));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        usuarioId: uid,
        ...doc.data(),
      }));
      setReservatorios(lista);
    } catch (error) {
      console.error("Erro ao carregar reservatórios:", error);
    }
  };

  // Carregar reservatórios de todos os usuários (admin)
  const carregarTodosReservatorios = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      let listaFinal = [];

      for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;
        const dadosUser = userDoc.data();
        const ref = collection(db, "users", uid, "reservatorios");
        const q = query(ref, orderBy("criadoEm", "desc"));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          usuarioId: uid,
          usuarioNome: `${dadosUser.firstname || ""} ${
            dadosUser.lastname || ""
          }`.trim(),
          usuarioEmail: dadosUser.email || "",
          ...doc.data(),
        }));
        listaFinal = [...listaFinal, ...lista];
      }

      setReservatorios(listaFinal);
    } catch (error) {
      console.error("Erro ao carregar todos reservatórios:", error);
    }
  };

  // Controle de formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calcula volume
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

  // Salvar reservatório
  const handleSave = async () => {
    if (!user) return alert("Você precisa estar logado.");

    const volume = calcularVolume();
    const dados = {
      ...formData,
      altura: formData.altura ? parseFloat(formData.altura) : null,
      raio: formData.raio ? parseFloat(formData.raio) : null,
      largura: formData.largura ? parseFloat(formData.largura) : null,
      comprimento: formData.comprimento
        ? parseFloat(formData.comprimento)
        : null,
      quantidadePessoas:
        formData.uso === "Uso pessoal"
          ? parseInt(formData.quantidadePessoas) || 0
          : null,
      volume,
      criadoEm: new Date(),
      usuarioId: currentReservatorio?.usuarioId || user.uid,
      reservatorioKey:
        currentReservatorio?.reservatorioKey || gerarChave(), // 🔑 chave única
    };

    try {
      if (isEditing && currentReservatorio) {
        const ref = doc(
          db,
          "users",
          currentReservatorio.usuarioId,
          "reservatorios",
          currentReservatorio.id
        );
        await updateDoc(ref, dados);
        setReservatorios(
          reservatorios.map((r) =>
            r.id === currentReservatorio.id &&
            r.usuarioId === currentReservatorio.usuarioId
              ? { ...r, ...dados }
              : r
          )
        );
      } else {
        const ref = collection(db, "users", user.uid, "reservatorios");
        const docRef = await addDoc(ref, dados);
        setReservatorios([
          { id: docRef.id, usuarioId: user.uid, ...dados },
          ...reservatorios,
        ]);
      }

      handleClose();
    } catch (error) {
      console.error("Erro ao salvar reservatório:", error);
    }
  };

  // Excluir
  const handleDelete = async (reservatorio) => {
    try {
      await deleteDoc(
        doc(
          db,
          "users",
          reservatorio.usuarioId,
          "reservatorios",
          reservatorio.id
        )
      );
      setReservatorios(
        reservatorios.filter(
          (r) =>
            !(
              r.id === reservatorio.id && r.usuarioId === reservatorio.usuarioId
            )
        )
      );
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  // Editar
  const handleEdit = (reservatorio) => {
    setIsEditing(true);
    setCurrentReservatorio(reservatorio);
    setFormData(reservatorio);
    setShowModal(true);
  };

  // Criar
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
      uso: "Uso pessoal",
      quantidadePessoas: "",
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentReservatorio(null);
  };

  // Abrir modal chave ESP32
  const handleShowKey = (reservatorio) => {
    setReservatorioSelecionado(reservatorio);
    setShowKeyModal(true);
  };

  const handleCloseKey = () => {
    setReservatorioSelecionado(null);
    setShowKeyModal(false);
  };

  return (
    <div
      className="container py-4"
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Reservatórios</h1>
        {user && userData?.role !== "admin" && (
          <Button variant="primary" onClick={handleOpen}>
            <i className="bi bi-plus-circle me-1"></i> Criar Reservatório
          </Button>
        )}
      </div>

      {!user ? (
        <p className="text-warning">
          ⚠️ Faça login para gerenciar seus reservatórios.
        </p>
      ) : (
        <>
          <h2 className="mt-3">
            {userData?.role === "admin"
              ? "Todos os Reservatórios"
              : "Seus Reservatórios"}
          </h2>

          {reservatorios.length === 0 ? (
            <p>Nenhum reservatório cadastrado.</p>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-dark table-striped table-hover align-middle">
                <thead>
                  <tr>
                    {userData?.role === "admin" && <th>Usuário</th>}
                    <th>Nome</th>
                    <th>Endereço</th>
                    <th>Uso</th>
                    <th>Pessoas</th>
                    <th>Formato</th>
                    <th>Volume (m³)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {reservatorios.map((r) => (
                    <tr key={`${r.usuarioId}-${r.id}`}>
                      {userData?.role === "admin" && (
                        <td>{r.usuarioNome || r.usuarioEmail || r.usuarioId}</td>
                      )}
                      <td>{r.nome}</td>
                      <td>{r.endereco}</td>
                      <td>{r.uso}</td>
                      <td>
                        {r.uso === "Uso pessoal" ? r.quantidadePessoas : "—"}
                      </td>
                      <td>{r.formato}</td>
                      <td>
                        {r.volume ? (
                          <span className="badge bg-info">
                            {r.volume.toFixed(2)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowKey(r)}
                          title="Ver Código ESP32"
                        >
                          <i className="bi bi-cpu"></i>
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(r)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(r)}
                          title="Excluir"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal Cadastro/Edição */}
          <Modal show={showModal} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditing ? "Editar Reservatório" : "Novo Reservatório"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* Nome e Endereço */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Endereço</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                </div>

                {/* Uso */}
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Uso do Reservatório</Form.Label>
                      <Form.Select
                        name="uso"
                        value={formData.uso}
                        onChange={handleChange}
                      >
                        <option value="Uso pessoal">Uso pessoal</option>
                        <option value="Agricultura">Agricultura</option>
                        <option value="Pecuária">Pecuária</option>
                        <option value="Agropecuária">Agropecuária</option>
                      </Form.Select>
                    </Form.Group>
                  </div>

                  {formData.uso === "Uso pessoal" && (
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label>Quantas pessoas usam?</Form.Label>
                        <Form.Control
                          type="number"
                          name="quantidadePessoas"
                          value={formData.quantidadePessoas}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </div>
                  )}
                </div>

                {/* Formato */}
                <div className="row g-3 mt-2">
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Formato</Form.Label>
                      <Form.Select
                        name="formato"
                        value={formData.formato}
                        onChange={handleChange}
                      >
                        <option value="cilindro">Cilindro</option>
                        <option value="retangular">Retangular</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>

                {/* Dimensões */}
                {formData.formato === "cilindro" ? (
                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <Form.Label>Altura (m)</Form.Label>
                      <Form.Control
                        type="number"
                        name="altura"
                        value={formData.altura}
                        onChange={handleChange}
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-6">
                      <Form.Label>Raio (m)</Form.Label>
                      <Form.Control
                        type="number"
                        name="raio"
                        value={formData.raio}
                        onChange={handleChange}
                        step="0.01"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="row g-3 mt-2">
                    <div className="col-md-4">
                      <Form.Label>Altura (m)</Form.Label>
                      <Form.Control
                        type="number"
                        name="altura"
                        value={formData.altura}
                        onChange={handleChange}
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4">
                      <Form.Label>Largura (m)</Form.Label>
                      <Form.Control
                        type="number"
                        name="largura"
                        value={formData.largura}
                        onChange={handleChange}
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4">
                      <Form.Label>Comprimento (m)</Form.Label>
                      <Form.Control
                        type="number"
                        name="comprimento"
                        value={formData.comprimento}
                        onChange={handleChange}
                        step="0.01"
                      />
                    </div>
                  </div>
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

          {/* Modal chave ESP32 */}
          <Modal show={showKeyModal} onHide={handleCloseKey} centered>
            <Modal.Header closeButton>
              <Modal.Title>Código para ESP32</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {reservatorioSelecionado && (
                <>
                  <p>
                    <strong>Reservatório:</strong>{" "}
                    {reservatorioSelecionado.nome}
                  </p>
                  <p>
                    <strong>ID único:</strong>
                  </p>
                  <code>{reservatorioSelecionado.reservatorioKey}</code>
                  <hr />
                  <p>
                    👉 Use este ID no seu ESP32 para enviar os dados de{" "}
                    <b>nível</b> e <b>fluxo</b> para este reservatório.
                  </p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseKey}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Reservatorios;
