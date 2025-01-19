# To-Do List com React e Node.js

## Descrição

Este é um projeto de gerenciamento de tarefas desenvolvido com React no front-end e Node.js no back-end. A aplicação permite que os usuários adicionem, editem, excluam e concluam tarefas, além de gerenciar categorias, prioridades e exibir relatórios e estatísticas.

## Tecnologias Utilizadas

### Front-End
- **React**: Framework JavaScript para construção de interfaces de usuário.
- **React DnD**: Biblioteca para funcionalidade de drag and drop.
- **React Icons**: Para uso de ícones.
- **React-Bootstrap**: Biblioteca para componentes estilizados.

### Back-End
- **Node.js**: Plataforma para execução de JavaScript no servidor.
- **Express.js**: Framework para criação de APIs RESTful.
- **MongoDB**: Banco de dados NoSQL para armazenamento das tarefas.
- **Mongoose**: Biblioteca para modelagem de dados no MongoDB.

### Outras Ferramentas
- **CSS**: Para estilização customizada.
- **Bootstrap**: Para layout responsivo.
- **MongoDB Atlas**: Serviço em nuvem para hospedagem do banco de dados.

## Funcionalidades

- Cadastro de tarefas com:
  - Nome
  - Data e hora
  - Prioridade (Alta, Média, Baixa)
  - Categoria (Trabalho, Lazer, Casa, Família)
- Barra de busca para filtrar tarefas.
- Sistema de **drag and drop** para organizar tarefas entre os containers:
  - Tarefas para Hoje
  - Tarefas Futuras
  - Tarefas Concluídas
- Modo claro e escuro (Dark Mode).
- Sistema de edição de tarefas com modal.
- Página de relatórios e estatísticas:
  - Quantidade de tarefas concluídas e excluídas.
  - Tarefas mais frequentes.

## Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 14 ou superior)
- **MongoDB** (Atlas ou localmente)
- Gerenciador de pacotes: **npm** ou **yarn**

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
