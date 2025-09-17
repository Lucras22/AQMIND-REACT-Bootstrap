import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Image, Form } from "react-bootstrap";

function Home() {
  const [user, setUser] = useState(null);
  const [firstname, setFirstname] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFirstname(docSnap.data().firstname);
        }
      } else {
        setUser(null);
        setFirstname("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container className="mt-5">
      {/* Boas-vindas */}
      <div className="text-center mb-5">
        <h1>Bem-vindo a CETHAP 🌀</h1>
        {user ? (
          <p className="lead">Olá, {firstname || user.email}! Que bom te ver de volta.</p>
        ) : (
          <p className="lead">
            <Link to="/login">Login</Link> ou <Link to="/register">Registre-se</Link> para começar.
          </p>
        )}
      </div>

      {/* Cards principais */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card bg="dark" text="white" className="h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title>Perfil</Card.Title>
              <Card.Text>Veja e edite suas informações pessoais.</Card.Text>
              {user ? (
                <Button as={Link} to="/profile" variant="primary">
                  Ir para Perfil
                </Button>
              ) : (
                <Button as={Link} to="/register" variant="primary">
                  Criar Conta
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="dark" text="white" className="h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title>Novidades</Card.Title>
              <Card.Text>Fique por dentro das últimas atualizações do app.</Card.Text>
              <Button variant="primary">Ver Novidades</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="dark" text="white" className="h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title>Suporte</Card.Title>
              <Card.Text>Precisa de ajuda ou tem alguma dúvida? Entre em contato.</Card.Text>
              <Button variant="primary">Contato</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section Sobre */}
      <Row className="align-items-center mb-5">
        <Col md={6}>
          <Image
            src="https://via.placeholder.com/500x300"
            alt="Sobre"
            fluid
            rounded
          />
        </Col>
        <Col md={6}>
          <h2>Sobre o Nosso App</h2>
          <p>
            Nosso aplicativo foi criado para fornecer uma experiência completa
            aos usuários, combinando funcionalidades de login, perfil, novidades
            e suporte. É simples, intuitivo e seguro.
          </p>
          <Button as={Link} to="/sobre" variant="primary">
            Saiba Mais
          </Button>
        </Col>
      </Row>

      {/* Section Contato */}
      <Row className="align-items-start mb-5">
        <Col md={6} className="mb-3">
          <h2>Nosso Local</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63582.86999989665!2d-39.7213696!3d-5.1150848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7bde893a7028ce9%3A0x1deba2f9a7f5a23b!2sInstituto%20Federal%20de%20Educa%C3%A7%C3%A3o%2C%20Ci%C3%AAncia%20e%20Tecnologia%20do%20Cear%C3%A1%20%7C%20Campus%20Boa%20Viagem!5e0!3m2!1spt-BR!2sbr!4v1758152255360!5m2!1spt-BR!2sbr"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa"
          ></iframe>
        </Col>

        <Col md={6}>
          <h2>Contato</h2>
          <Form>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" placeholder="Seu nome" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Seu email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMensagem">
              <Form.Label>Mensagem</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Digite sua mensagem" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>

          <div className="mt-4">
            <h5>Outros Contatos</h5>
            <p>Email: contato@meuapp.com</p>
            <p>Telefone: +55 11 99999-9999</p>
            <p>Endereço: Rua Exemplo, 123, São Paulo - SP</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
