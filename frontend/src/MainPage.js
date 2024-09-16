import React, { useState } from 'react';
import './index.css';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import { FaCheck, FaTimes, FaEdit, FaSun, FaMoon } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = {
  TASK: 'task',
};

const Task = ({ task, type, moveTask, removeTask, completeTask, editTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.TASK,
    item: { task, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const taskStyle = {
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: task.priorityColor,
  };

  return (
    <div className="task-item" ref={drag} style={taskStyle}>
      <div className="category-flag" style={{ backgroundColor: task.categoryColor }}>
        {task.categoryIcon}
      </div>
      <p>{task.task}</p>
      <p>{task.date} {task.time}</p>
      <div className="task-icons">
        {type !== 'completed' && <FaCheck onClick={() => completeTask(task, type)} />}
        <FaEdit onClick={() => editTask(task, type)} />
        <FaTimes onClick={() => removeTask(task, type)} />
      </div>
    </div>
  );
};

const TaskContainer = ({ title, tasks, type, moveTask, removeTask, completeTask, editTask }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (draggedItem) => moveTask(draggedItem, type),
  }));

  return (
    <div className="task-container" ref={drop}>
      <h2>{title}</h2>
      {tasks.map((task) => (
        <Task
          key={`${task.task}-${task.date}-${task.time}`}
          task={task}
          type={type}
          moveTask={moveTask}
          removeTask={removeTask}
          completeTask={completeTask}
          editTask={editTask}
        />
      ))}
    </div>
  );
};

const MainPage = () => {
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('low');
  const [category, setCategory] = useState('trabalho');
  const [tasksForToday, setTasksForToday] = useState([]);
  const [futureTasks, setFutureTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleRegisterTask = (e) => {
    e.preventDefault();
    if (task && date && time) {
      const categoryColors = {
        trabalho: '#FFA500',
        lazer: '#FFA500',
        casa: '#FFA500',
        familia: '#FFA500',
      };

      const categoryIcons = {
        trabalho: '💼',
        lazer: '🎉',
        casa: '🏠',
        familia: '👪',
      };

      const priorityColor = priority === 'high' ? '#f44336' : priority === 'medium' ? '#ffeb3b' : '#4caf50';
      const taskData = { 
        task, 
        date, 
        time, 
        priority, 
        priorityColor, 
        category, 
        categoryColor: categoryColors[category],
        categoryIcon: categoryIcons[category]
      };
      const today = new Date().toISOString().split('T')[0];

      if (date === today) {
        setTasksForToday([...tasksForToday, taskData]);
      } else if (date > today) {
        setFutureTasks([...futureTasks, taskData]);
      }

      setTask('');
      setDate('');
      setTime('');
      setPriority('low');
      setCategory('trabalho');
    }
  };

  const moveTask = (draggedItem, targetType) => {
    const { task, type } = draggedItem;
  
    // Remover a tarefa do container de origem
    if (type === 'today') {
      setTasksForToday(prevTasks => prevTasks.filter(t => t.task !== task.task || t.date !== task.date || t.time !== task.time));
    } else if (type === 'future') {
      setFutureTasks(prevTasks => prevTasks.filter(t => t.task !== task.task || t.date !== task.date || t.time !== task.time));
    } else if (type === 'completed') {
      setCompletedTasks(prevTasks => prevTasks.filter(t => t.task !== task.task || t.date !== task.date || t.time !== task.time));
    }
  
    // Atualizar data e hora conforme o container de destino
    let updatedTask = { ...task };
  
    if (targetType === 'today') {
      updatedTask.date = new Date().toISOString().split('T')[0];
    } else if (targetType === 'future') {
      const newDate = prompt('Escolha uma nova data para a tarefa (YYYY-MM-DD):', task.date);
      const newTime = prompt('Escolha uma nova hora para a tarefa (HH:MM):', task.time);
  
      if (newDate && newTime) {
        updatedTask.date = newDate;
        updatedTask.time = newTime;
      }
    }
  
    // Adicionar a tarefa ao container de destino
    if (targetType === 'today') {
      setTasksForToday(prevTasks => [...prevTasks, updatedTask]);
    } else if (targetType === 'future') {
      setFutureTasks(prevTasks => [...prevTasks, updatedTask]);
    } else if (targetType === 'completed') {
      setCompletedTasks(prevTasks => [...prevTasks, updatedTask]);
    }
  };
  
  const handleDeleteTask = (taskToDelete, type) => {
    if (type === 'today') {
      setTasksForToday(prevTasks => prevTasks.filter(task => task.task !== taskToDelete.task || task.date !== taskToDelete.date || task.time !== taskToDelete.time));
    } else if (type === 'future') {
      setFutureTasks(prevTasks => prevTasks.filter(task => task.task !== taskToDelete.task || task.date !== taskToDelete.date || task.time !== taskToDelete.time));
    } else if (type === 'completed') {
      setCompletedTasks(prevTasks => prevTasks.filter(task => task.task !== taskToDelete.task || task.date !== taskToDelete.date || task.time !== taskToDelete.time));
    }
  };

  const handleCompleteTask = (taskToComplete, type) => {
    handleDeleteTask(taskToComplete, type);
    setCompletedTasks(prevTasks => [...prevTasks, taskToComplete]);
  };

  const handleEditTask = (taskToEdit, type) => {
    setEditingTask({ ...taskToEdit, originalType: type });
    setTask(taskToEdit.task);
    setDate(taskToEdit.date);
    setTime(taskToEdit.time);
    setPriority(taskToEdit.priority);
    setCategory(taskToEdit.category);
    setShowModal(true);
  };

  const saveEditedTask = () => {
    handleDeleteTask(editingTask, editingTask.originalType);
    handleRegisterTask({ preventDefault: () => {} });
    setShowModal(false);
  };

  const filteredTasks = (tasks) => {
    return tasks.filter((task) =>
      task.task.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`main-page ${darkMode ? 'dark-mode' : ''}`}>
        <div className="toggle-container">
          <span className="icon sun-icon"><FaSun /></span>
          <label className="toggle-switch">
            <input type="checkbox" onChange={toggleDarkMode} checked={darkMode} />
            <span className="slider"></span>
          </label>
          <span className="icon moon-icon"><FaMoon /></span>
        </div>

        <Container className="register-container">
          <h1 className="text-center mb-4">Cadastro de Tarefas</h1>
          <Form onSubmit={handleRegisterTask}>
            <Form.Group controlId="taskInput">
              <Form.Label>Tarefa</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a tarefa"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="dateInput">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="timeInput">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="priorityInput">
              <Form.Label>Prioridade</Form.Label>
              <Form.Control
                as="select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="categoryInput">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="trabalho">Trabalho</option>
                <option value="lazer">Lazer</option>
                <option value="casa">Casa</option>
                <option value="familia">Família</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Registrar
            </Button>
          </Form>
        </Container>

        <div className="search-and-stats">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar tarefa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="info" className="stats-button">
            Estatísticas
          </Button>
        </div>

        <div className="task-containers">
          <TaskContainer
            title="Tarefas para Hoje"
            tasks={filteredTasks(tasksForToday)}
            type="today"
            moveTask={moveTask}
            removeTask={handleDeleteTask}
            completeTask={handleCompleteTask}
            editTask={handleEditTask}
          />
          <TaskContainer
            title="Tarefas Futuras"
            tasks={filteredTasks(futureTasks)}
            type="future"
            moveTask={moveTask}
            removeTask={handleDeleteTask}
            completeTask={handleCompleteTask}
            editTask={handleEditTask}
          />
          <TaskContainer
            title="Tarefas Concluídas"
            tasks={filteredTasks(completedTasks)}
            type="completed"
            moveTask={moveTask}
            removeTask={handleDeleteTask}
            completeTask={handleCompleteTask}
            editTask={handleEditTask}
          />
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Tarefa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="taskInput">
                <Form.Label>Tarefa</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite a tarefa"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="dateInput">
                <Form.Label>Data</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="timeInput">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="priorityInput">
                <Form.Label>Prioridade</Form.Label>
                <Form.Control
                  as="select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="categoryInput">
                <Form.Label>Categoria</Form.Label>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="trabalho">Trabalho</option>
                  <option value="lazer">Lazer</option>
                  <option value="casa">Casa</option>
                  <option value="familia">Família</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={saveEditedTask}>
              Salvar Alterações
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DndProvider>
  );
};

export default MainPage;



