import React from 'react';
import { createRoot } from 'react-dom/client'; // Importe createRoot
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Crie o root
root.render(<App />);
