// App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [getResponse, setGetResponse] = useState(null);

  const handleGet = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/get?key=${key}`);
      setGetResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSet = async () => {
    try {
      await axios.post('http://localhost:8080/set', { key, value });
      setKey('');
      setValue('');
      setGetResponse(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/delete?key=${key}`);
      setGetResponse(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>LRU Cache</h1>
      <div className="input-container">
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="Key"
        />
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Value"
        />
        <button onClick={handleSet}>Set</button>
        <button onClick={handleGet}>Get</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
      {getResponse && (
        <p className="response">
          Value for key <strong>{key}</strong>: {JSON.stringify(getResponse)}
        </p>
      )}
    </div>
  );
}

export default App;
