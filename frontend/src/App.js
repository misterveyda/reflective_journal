import React, { useState, useEffect } from 'react';
import './App.css';
import JournalEntries from './components/JournalEntries';
import JournalForm from './components/JournalForm';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchEntries();
    }
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/entries/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    fetchEntries();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setEntries([]);
  };

  const handleEntryCreated = (newEntry) => {
    setEntries([newEntry, ...entries]);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>✨ Reflective Journal</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      <main className="container">
        <JournalForm onEntryCreated={handleEntryCreated} />
        {loading ? <p>Loading...</p> : <JournalEntries entries={entries} />}
      </main>
    </div>
  );
}

export default App;
