import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import './index.css'; 
import { Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', { email, password });
      setSuccess(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response.data.message);
      setSuccess('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const passwordCriteria = {
    minLength: password.length >= 8,
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  };

  return (
    <div className="register-page">
      <Container className="register-container">
        <h1 className="text-center mb-4">Registro de Usuário</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="position-relative">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="password-icon"
             
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </Form.Group>

          <ul className="password-criteria">
            <li>
              {passwordCriteria.minLength && <FaCheck className='criteria-icon' color="green" />} Mínimo de 8 caracteres
            </li>
            <li>
              {passwordCriteria.upperCase && <FaCheck className='criteria-icon' color="green" />} Pelo menos uma letra maiúscula
            </li>
            <li>
              {passwordCriteria.lowerCase && <FaCheck className='criteria-icon' color="green" />} Pelo menos uma letra minúscula
            </li>
            <li>
              {passwordCriteria.specialChar && <FaCheck className='criteria-icon' color="green" />} Pelo menos um caractere especial
            </li>
          </ul>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3">{success}</Alert>}

          <Button variant="primary" type="submit" className="mt-3">
            Registrar
          </Button>
          <p className='p-link'>Já tem uma conta? <Link to="/login">Entre aqui</Link></p>
        </Form>
      </Container>
    </div>
  );
};

export default Register;
