import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

function Profile() {
  const [user, setUser] = useState(null);
  const [extraData, setExtraData] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Buscar dados extras
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
        }

        // Contar reservatórios
        const reservatoriosRef = collection(db, "users", currentUser.uid, "reservatorios");
        const snapshot = await getDocs(reservatoriosRef);
        setReservatoriosCount(snapshot.size);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
              </>
            )}
          </div>

          {/* Dados extras */}
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
          </div>
        </>
      ) : (
        <p>Carregando...</p>
      )}

      {/* Modal de edição */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Firstname</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lastname</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rua</Form.Label>
              <Form.Control
                type="text"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CEP</Form.Label>
              <Form.Control
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email alternativo</Form.Label>
              <Form.Control
                type="email"
                name="emailAlternativo"
                value={formData.emailAlternativo}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={handleSave}>Salvar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Profile;
