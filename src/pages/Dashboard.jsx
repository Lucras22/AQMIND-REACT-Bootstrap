import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
} from "recharts";
import { Button, Card } from "react-bootstrap";

const Dashboard = () => {
  const [period, setPeriod] = useState("diário");

  // Estado dos gráficos
  const [dataPie, setDataPie] = useState([
    { name: "Água", value: 400 },
    { name: "Refrigerante", value: 300 },
    { name: "Suco", value: 200 },
    { name: "Cerveja", value: 100 },
  ]);

  const [dataLine, setDataLine] = useState([
    { date: "01", vendas: 30 },
    { date: "02", vendas: 45 },
    { date: "03", vendas: 28 },
    { date: "04", vendas: 60 },
    { date: "05", vendas: 50 },
  ]);

  const [dataBar, setDataBar] = useState([
    { mes: "Jan", vendas: 4000 },
    { mes: "Fev", vendas: 3000 },
    { mes: "Mar", vendas: 5000 },
    { mes: "Abr", vendas: 2000 },
  ]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Atualização automática dos dados
  useEffect(() => {
    const interval = setInterval(() => {
      // Atualiza pizza
      setDataPie((prev) =>
        prev.map((item) => ({
          ...item,
          value: Math.floor(Math.random() * 500) + 100,
        }))
      );

      // Atualiza linha
      setDataLine((prev) =>
        prev.map((item) => ({
          ...item,
          vendas: Math.floor(Math.random() * 70) + 10,
        }))
      );

      // Atualiza barras
      setDataBar((prev) =>
        prev.map((item) => ({
          ...item,
          vendas: Math.floor(Math.random() * 6000) + 1000,
        }))
      );
    }, 3000); // Atualiza a cada 3s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-primary mb-4">Painel de Consumo</h1>
asdfg
      {/* Botões de filtro */}
      <div className="mb-4">
        {["diário", "semanal", "mensal", "anual"].map((p) => (
          <Button
            key={p}
            variant={period === p ? "primary" : "outline-primary"}
            className="me-2"
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      {/* Layout dos gráficos */}
      <div className="row g-4">
        {/* Pizza */}
        <div className="col-lg-4 col-md-6">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="bg-white rounded">
              <h5 className="text-primary">Distribuição do Uso da Água</h5>
              <PieChart width={300} height={300}>
                <Pie
                  data={dataPie}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </Card.Body>
          </Card>
        </div>

        {/* Linha */}
        <div className="col-lg-8 col-md-6">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="bg-light rounded">
              <h5 className="text-primary">
                Consumo de Água ({period})
              </h5>
              <LineChart width={500} height={300} data={dataLine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vendas"
                  stroke="#0088FE"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </Card.Body>
          </Card>
        </div>

        {/* Barras */}
        <div className="col-lg-12">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="bg-white rounded">
              <h5 className="text-primary">Consumo Mensal</h5>
              <BarChart width={800} height={300} data={dataBar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill="#00C49F" />
              </BarChart>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
