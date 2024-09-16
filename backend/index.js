const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Corrija o caminho conforme necessário
const cors = require('cors');

// String de conexão com MongoDB
const uri = "mongodb+srv://vinicius:TSLSp1%40281412@cluster0.p8e8r.mongodb.net/mydatabase?retryWrites=true&w=majority";

// Conexão com o MongoDB usando Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log('MongoDB connection error:', err));

// Inicializando o Express
const app = express();
app.use(express.json());
app.use(cors()); // Adicionado para permitir requisições do frontend

// Rota para registro de usuários
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o email e a senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Criar um novo usuário
    const user = new User({ email, password });

    // Tentar salvar o usuário. Isso acionará a validação definida no esquema
    await user.save();

    // Responder com sucesso
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    // Verificar se o erro é relacionado à validação de senha
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Senha não permitida: ' + error.message });
    }
    // Responder com erro genérico
    res.status(500).json({ message: 'Erro ao registrar o usuário' });
  }
});

// Rota básica para testar o servidor
app.get('/', (req, res) => {
  res.send('Servidor está funcionando corretamente!');
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
