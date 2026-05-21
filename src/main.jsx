import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { getIPLDataset } from './utils/iplData';

console.log('CricIQ IPL Dataset utility loaded:', typeof getIPLDataset);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

