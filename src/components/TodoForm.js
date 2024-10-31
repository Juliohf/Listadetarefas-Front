import React, { useState } from "react";

export const TodoForm = ({ addTodo }) => {
  const [nome, setNome] = useState("");
  const [custo, setCusto] = useState(0);
  const [dataLimite, setDataLimite] = useState("");
  const [ordemApresentacao, setOrdemApresentacao] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo({ nome, custo, dataLimite, ordemApresentacao });
    setNome("");
    setCusto(0);
    setDataLimite("");
    setOrdemApresentacao(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome da tarefa"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Custo"
        value={custo}
        onChange={(e) => setCusto(parseFloat(e.target.value))}
        required
      />
      <input
        type="date"
        placeholder="Data Limite"
        value={dataLimite}
        onChange={(e) => setDataLimite(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Ordem de Apresentação"
        value={ordemApresentacao}
        onChange={(e) => setOrdemApresentacao(parseInt(e.target.value))}
        required
      />
      <button type="submit">Adicionar Tarefa</button>
    </form>
  );
};
