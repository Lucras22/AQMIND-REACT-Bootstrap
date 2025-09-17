import React, { useState } from "react";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
} from "recharts";

const Dashboard = () => {
  const [period, setPeriod] = useState("daily");

  // Dados fictícios (você pode substituir pelos reais)
  const dataPie = [
    { name: "Produto A", value: 400 },
    { name: "Produto B", value: 300 },
    { name: "Produto C", value: 300 },
    { name: "Produto D", value: 200 },
  ];

  const dataLine = [
    { date: "01", value: 30 },
    { date: "02", value: 45 },
    { date: "03", value: 28 },
    { date: "04", value: 60 },
    { date: "05", value: 50 },
  ];

  const dataBar = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 2000 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard</h1>

      {/* Filtros de período */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setPeriod("daily")} style={{ marginRight: "10px" }}>Diário</button>
        <button onClick={() => setPeriod("weekly")} style={{ marginRight: "10px" }}>Semanal</button>
        <button onClick={() => setPeriod("monthly")} style={{ marginRight: "10px" }}>Mensal</button>
        <button onClick={() => setPeriod("yearly")}>Anual</button>
      </div>

      {/* Gráficos */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
        {/* Pizza */}
        <div>
          <h3>Distribuição de Produtos</h3>
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
        </div>

        {/* Linha */}
        <div>
          <h3>Vendas ao longo do período ({period})</h3>
          <LineChart width={500} height={300} data={dataLine}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </div>

        {/* Barras */}
        <div>
          <h3>Vendas Mensais</h3>
          <BarChart width={500} height={300} data={dataBar}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
