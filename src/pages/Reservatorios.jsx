import React, { useState } from "react";

const Reservatorios = () => {
  const [reservatorios, setReservatorios] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    formato: "cilindro",
    altura: "",
    raio: "",
    largura: "",
    comprimento: "",
  });

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
      // retangular
      const h = parseFloat(formData.altura) || 0;
      const l = parseFloat(formData.largura) || 0;
      const c = parseFloat(formData.comprimento) || 0;
      return l * c * h;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const volume = calcularVolume();
    setReservatorios([...reservatorios, { ...formData, volume }]);
    setShowForm(false);
    setFormData({
      nome: "",
      endereco: "",
      formato: "cilindro",
      altura: "",
      raio: "",
      largura: "",
      comprimento: "",
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Reservatórios</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Criar Reservatório"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label>Nome:</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Endereço:</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
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

          {/* Campos que mudam conforme formato */}
          {formData.formato === "cilindro" ? (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label>Altura (m):</label>
                <input
                  type="number"
                  name="altura"
                  value={formData.altura}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Raio (m):</label>
                <input
                  type="number"
                  name="raio"
                  value={formData.raio}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label>Altura (m):</label>
                <input
                  type="number"
                  name="altura"
                  value={formData.altura}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Largura (m):</label>
                <input
                  type="number"
                  name="largura"
                  value={formData.largura}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Comprimento (m):</label>
                <input
                  type="number"
                  name="comprimento"
                  value={formData.comprimento}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>
            </>
          )}

          <button type="submit">Salvar</button>
        </form>
      )}

      <div style={{ marginTop: "30px" }}>
        <h2>Lista de Reservatórios</h2>
        {reservatorios.length === 0 ? (
          <p>Nenhum reservatório cadastrado.</p>
        ) : (
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Endereço</th>
                <th>Formato</th>
                <th>Volume (m³)</th>
              </tr>
            </thead>
            <tbody>
              {reservatorios.map((r, index) => (
                <tr key={index}>
                  <td>{r.nome}</td>
                  <td>{r.endereco}</td>
                  <td>{r.formato}</td>
                  <td>{r.volume.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reservatorios;
