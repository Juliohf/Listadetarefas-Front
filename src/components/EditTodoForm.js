import React, { useState, useEffect } from "react";

export const EditTodoForm = ({ editTodo, task }) => {
  const [nome, setNome] = useState(task.nome);
  const [custo, setCusto] = useState(task.custo);
  const [dataLimite, setDataLimite] = useState(task.dataLimite);

  // Este efeito garante que os valores sejam atualizados se a tarefa mudar
  useEffect(() => {
    setNome(task.nome);
    setCusto(task.custo);
    setDataLimite(task.dataLimite);
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Passa os campos corretos
    editTodo({ nome, custo: parseFloat(custo), dataLimite }, task.id);
  };

  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="todo-input"
        placeholder="Nome"
        required
      />
      <input
        type="number"
        value={custo}
        onChange={(e) => setCusto(e.target.value)}
        className="todo-input"
        placeholder="Custo"
        required
      />
      <input
        type="date"
        value={dataLimite}
        onChange={(e) => setDataLimite(e.target.value)}
        className="todo-input"
        placeholder="Data Limite"
        required
      />
      <button type="submit" className="todo-btn">
        Atualizar tarefa
      </button>
    </form>
  );
};
