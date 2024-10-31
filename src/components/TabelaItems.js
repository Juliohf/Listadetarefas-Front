import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Modal from "./Modal";
import { Button } from "@mui/material";
import "./TabelaItems.css";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const TabelaItems = () => {
  const [items, setItems] = useState([]);
  const [nome, setNome] = useState("");
  const [custo, setCusto] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        "https://listadetarefas-2.onrender.com/tarefas"
      );
      setItems(response.data);
    } catch (error) {
      console.error("Erro ao buscar os itens", error);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (items.some((item) => item.nome === nome)) {
      alert("O nome da tarefa já existe. Por favor, escolha outro nome.");
      return;
    }

    const ordemApresentacao =
      items.length > 0
        ? Math.max(...items.map((item) => item.ordemApresentacao)) + 1
        : 1;

    const newItem = {
      nome,
      custo: parseFloat(custo),
      dataLimite,
      ordemApresentacao,
    };

    try {
      await axios.post(
        "https://listadetarefas-2.onrender.com/tarefas",
        newItem
      );
      fetchItems();
      setNome("");
      setCusto("");
      setDataLimite("");
    } catch (error) {
      console.error(
        "Erro ao adicionar item",
        error.response ? error.response.data : error.message
      );
    }
  };

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Você tem certeza que deseja excluir este item?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://listadetarefas-2.onrender.com/tarefas/${id}`
        );
        fetchItems();
      } catch (error) {
        console.error("Erro ao excluir o item", error);
      }
    }
  };

  const startEditing = (item) => {
    setIsEditing(item);
    setNome(item.nome);
    setCusto(item.custo);
    setDataLimite(item.dataLimite);
    setIsModalOpen(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();

    // Verifica se o novo nome já existe, ignorando o item atual
    const nameExists = items.some(
      (item) => item.nome === nome && item.id !== isEditing.id
    );
    if (nameExists) {
      alert("O nome da tarefa já existe. Por favor, escolha outro nome.");
      return;
    }

    const updatedItem = {
      ...isEditing,
      nome,
      custo: parseFloat(custo),
      dataLimite,
    };

    try {
      await axios.put(
        `https://listadetarefas-2.onrender.com/tarefas/${isEditing.id}`,
        updatedItem
      );

      setItems((prevItems) =>
        prevItems.map((item) => (item.id === isEditing.id ? updatedItem : item))
      );

      setIsEditing(null);
      setIsModalOpen(false);
      setNome("");
      setCusto("");
      setDataLimite("");
    } catch (error) {
      console.error("Erro ao editar item", error);
    }
  };

  const moveItem = (index, direction) => {
    const newItems = [...items];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const tempOrder = newItems[index].ordemApresentacao;
    newItems[index].ordemApresentacao = newItems[targetIndex].ordemApresentacao;
    newItems[targetIndex].ordemApresentacao = tempOrder;

    newItems.sort((a, b) => a.ordemApresentacao - b.ordemApresentacao);
    setItems(newItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container">
      <h1>Lista de Tarefas</h1>
      <form onSubmit={addItem}>
        <input
          type="text"
          placeholder="Nome da Tarefa"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Custo"
          value={custo}
          onChange={(e) => setCusto(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Data Limite"
          value={dataLimite}
          onChange={(e) => setDataLimite(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Adicionar Item
        </Button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Ações</th>
            <th>ID</th>
            <th>Nome</th>
            <th>Custo</th>
            <th>Data Limite</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className={item.custo >= 1000 ? "highlight" : ""}>
              <td>
                <IconButton
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  aria-label="mover para cima"
                >
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  aria-label="mover para baixo"
                >
                  <ArrowDownwardIcon />
                </IconButton>
              </td>
              <td>{item.id}</td> {/* ID aqui */}
              <td>{item.nome}</td> {/* Nome aqui */}
              <td>R$ {item.custo.toFixed(2).replace(".", ",")}</td>{" "}
              {/* Custo com símbolo */}
              <td>{format(new Date(item.dataLimite), "dd-MM-yyyy")}</td>{" "}
              {/* Data Limite */}
              <td>
                <IconButton
                  onClick={() => startEditing(item)}
                  color="sucess"
                  aria-label="editar"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => deleteItem(item.id)}
                  color="error"
                  aria-label="excluir"
                >
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Editar Tarefa</h2>
        <form onSubmit={saveEdit}>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Nome da Tarefa"
          />
          <input
            type="number"
            value={custo}
            onChange={(e) => setCusto(e.target.value)}
            required
            placeholder="Custo"
          />
          <input
            type="date"
            value={dataLimite}
            onChange={(e) => setDataLimite(e.target.value)}
            required
            placeholder="Data Limite"
          />
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default TabelaItems;
