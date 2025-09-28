import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import Register from "../components/Register";

function Profile() {
  const [user, setUser] = useState(null);
  const [extraData, setExtraData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    cep: "",
    telefone: "",
    emailAlternativo: "",
  });
  const [reservatoriosCount, setReservatoriosCount] = useState(0);
  const [usersList, setUsersList] = useState([]); // lista de usuários

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setExtraData(docSnap.data());
          setFormData({
            firstname: docSnap.data().firstname || "",
            lastname: docSnap.data().lastname || "",
            rua: docSnap.data().rua || "",
            numero: docSnap.data().numero || "",
            bairro: docSnap.data().bairro || "",
            cidade: docSnap.data().cidade || "",
            cep: docSnap.data().cep || "",
            telefone: docSnap.data().telefone || "",
            emailAlternativo: docSnap.data().emailAlternativo || "",
          });

          // Se for admin, carrega lista de usuários
          if (docSnap.data().role === "admin") {
            loadUsers();
          }
        }

        const reservatoriosRef = collection(db, "users", currentUser.uid, "reservatorios");
        const snapshot = await getDocs(reservatoriosRef);
        setReservatoriosCount(snapshot.size);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsersList(users);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await deleteDoc(doc(db, "users", uid));
      setUsersList((prev) => prev.filter((u) => u.id !== uid));
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { ...formData });
      setExtraData(formData);
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  return (
    <div className="container mt-2 text-white">
      <h2>Perfil</h2>
      {user ? (
        <>
          <div className="bg-dark p-4 rounded mb-3">
            <h4>Informações Pessoais</h4>
            <p><b>Email:</b> {user.email}</p>
            {extraData && (
              <>
                <p><b>Firstname:</b> {extraData.firstname}</p>
                <p><b>Lastname:</b> {extraData.lastname}</p>
                <p><b>Role:</b> {extraData.role}</p>
              </>
            )}
          </div>

          <div className="bg-dark p-4 rounded mb-5">
            <h4>Informações adicionais</h4>
            <p><b>Rua:</b> {extraData?.rua || "-"}</p>
            <p><b>Número:</b> {extraData?.numero || "-"}</p>
            <p><b>Bairro:</b> {extraData?.bairro || "-"}</p>
            <p><b>Cidade:</b> {extraData?.cidade || "-"}</p>
            <p><b>CEP:</b> {extraData?.cep || "-"}</p>
            <p><b>Telefone:</b> {extraData?.telefone || "-"}</p>
            <p><b>Email alternativo:</b> {extraData?.emailAlternativo || "-"}</p>
            <p><b>Reservatórios cadastrados:</b> {reservatoriosCount}</p>

            <Button variant="primary" className="me-2" onClick={() => setShowModal(true)}>
              Editar Dados
            </Button>
            <Button variant="danger" onClick={handleLogout}>Sair</Button>

            {extraData?.role === "admin" && (
              <Button
                variant="success"
                className="ms-2"
                onClick={() => setShowRegister(true)}
              >
                Registrar novo usuário
              </Button>
            )}
          </div>

          {/* Se for admin, mostra lista de usuários */}
          {extraData?.role === "admin" && (
            <div className="bg-dark p-4 rounded mb-5">
              <h4>Usuários cadastrados</h4>
              {usersList.length === 0 ? (
                <p>Nenhum usuário encontrado.</p>
              ) : (
                <ul className="list-group">
                  {usersList.map((u) => (
                    <li
                      key={u.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{u.firstname} {u.lastname} ({u.email}) - Role: {u.role || "comum"}</span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Excluir
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Carregando...</p>
      )}

      {/* Modal de edição com TODOS os campos */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Campos de edição */}
            {Object.entries(formData).map(([key, value]) => (
              <Form.Group className="mb-3" key={key}>
                <Form.Label>{key}</Form.Label>
                <Form.Control
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={handleSave}>Salvar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal com Register (apenas admin) */}
      <Modal show={showRegister} onHide={() => setShowRegister(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Registrar Novo Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Register />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;