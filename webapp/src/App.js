import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import Home from './pages/Home';
import Plans from './pages/Plans';
import Status from './pages/Status';
import './styles/global.css';

const App = () => {
  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    
    // Set the app theme based on Telegram's color scheme
    if (WebApp.colorScheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
    
    // Set the main button visibility to false by default
    WebApp.MainButton.hide();
    
    // Expand the WebApp to its full height
    WebApp.expand();
  }, []);
  
  return (
    <Router>
      <div className="app">
        {/* Accent circles for background */}
        <div className="accent-circle accent-circle-blue"></div>
        <div className="accent-circle accent-circle-green"></div>
        <div className="accent-circle accent-circle-pink"></div>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 