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
        <h1 className="text-primary fw-bold">🌀 Bem-vindo à CETHAP – Centro de Tecnologia Hídrica Aplicada à Preservação 🌀</h1>
        {user ? (
          <p className="lead text-secondary">
            Olá, {firstname || user.email}! Que bom te ver de volta.
          </p>
        ) : (
          <p className="lead text-secondary">
            <Link to="/login" className="text-primary fw-bold">Login</Link> para começar.
          </p>
        )}
      </div>

      {/* Cards principais */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="h-100 shadow border-0">
            <Card.Img
              variant="top"
              src="https://img.icons8.com/clouds/500/user.png"
              alt="Perfil"
              style={{ height: "180px", objectFit: "contain" }}
            />
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-primary">Perfil</Card.Title>
              <Card.Text>Veja e edite suas informações pessoais.</Card.Text>
              {user ? (
                <Button as={Link} to="/profile" variant="primary" className="mt-auto">
                  Ir para Perfil
                </Button>
              ) : (
                <Button as={Link} to="/register" variant="success" className="mt-auto">
                  Criar Conta
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow border-0">
            <Card.Img
              variant="top"
              src="https://img.icons8.com/clouds/500/news.png"
              alt="Novidades"
              style={{ height: "180px", objectFit: "contain" }}
            />
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-primary">Novidades</Card.Title>
              <Card.Text>Fique por dentro das últimas atualizações da CETHAP.</Card.Text>
              <Button variant="primary" className="mt-auto">Ver Novidades</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow border-0">
            <Card.Img
              variant="top"
              src="https://img.icons8.com/clouds/500/help.png"
              alt="Suporte"
              style={{ height: "180px", objectFit: "contain" }}
            />
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-primary">Suporte</Card.Title>
              <Card.Text>Precisa de ajuda ou tem alguma dúvida? Entre em contato.</Card.Text>
              <Button variant="outline-primary" className="mt-auto">Contato</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section Sobre */}
      <Row className="align-items-center mb-5">
        <Col md={6}>
          <Image
            src="https://cethap.vercel.app/IMG/equipe.png"
            alt="Sobre"
            fluid
            rounded
            className="shadow"
          />
        </Col>
        <Col md={6}>
          <h2 className="text-primary">Quem somos?</h2>
          <p className="text-secondary">
            O CETHAP é uma iniciativa dedicada ao desenvolvimento de soluções acessíveis, sustentáveis e tecnológicas para o monitoramento e a gestão inteligente da água. Com foco em comunidades e pequenos e médios empreendimentos, atuamos para promover o uso responsável dos recursos hídricos, aliando eficiência e cuidado ambiental.
          </p>
          <h2 className="text-primary">Tecnologia para transformar realidades</h2>
          <p className="text-secondary">Por meio de sensores inteligentes, plataformas digitais e capacitação técnica, o CETHAP leva inovação a regiões que enfrentam desafios hídricos. Nosso trabalho integra ciência, tecnologia e conhecimento local para fortalecer comunidades e proteger um dos recursos mais essenciais: a água.</p>
          <p className="text-secondary">Com uma equipe multidisciplinar e o apoio de parceiros acadêmicos e da iniciativa privada, o CETHAP constrói uma ponte entre o conhecimento científico e a aplicação prática. Nosso compromisso é gerar impacto positivo onde a água é mais do que um recurso — é sinônimo de vida, desenvolvimento e dignidade.</p>
          <Button as={Link} to="/sobre" variant="primary">
            Saiba Mais
          </Button>
        </Col>
      </Row>

      {/* Section Contato */}
      <Row className="align-items-start mb-5">
        <Col md={6} className="mb-3">
          <h2 className="text-primary">Nosso Local</h2>
          <div className="shadow rounded overflow-hidden">
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
          </div>
        </Col>

        <Col md={6}>
          <h2 className="text-primary">Contato</h2>
          <Card className="shadow border-0 p-3">
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

            <div className="mt-4 text-secondary">
              <h5 className="text-primary">Outros Contatos</h5>
              <p><b>Email:</b> contato@meuapp.com</p>
              <p><b>Telefone:</b> +55 11 99999-9999</p>
              <p><b>Endereço:</b> Rua Exemplo, 123, São Paulo - SP</p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
