import './App.css';
import CounterString from './Components/CounterString'; // CounterString component import
import React, { useState } from 'react'; // React and useState import

function App() {
  // Theme state, default is 'dark' for dark mode
  const [theme, setTheme] = useState('dark');

  // Toggle theme between light and dark
  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.body.className = theme === 'light' ? 'dark' : '';
  };
// www.https://github.com/farahn0104/counter-app.git
  // Main app render
  return (
    <div className={`App${theme === 'dark' ? ' dark' : ''}`}>
      <div className="logo-area">
        <div className="logo-title">BroCoder</div>
      </div>
      {/* CounterString component with theme and toggle handler */}
      <CounterString theme={theme} onToggleTheme={handleToggleTheme} />
      {/* Footer with author name */}
      <footer className="footer">Farhan Ansari 2025</footer>
    </div>
  );
}

export default App; // Export App component