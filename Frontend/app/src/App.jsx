import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [expirationDuration, SetExpirationDuration] = useState(5);
  const [getResponse, setGetResponse] = useState(null);

  const handleGet = async () => {
    try {
      setGetResponse(null);
      const response = await axios.get(`http://localhost:8080/get?key=${key}`);
      console.log("response", response);
      setGetResponse(response.data);
      toast("Cache retrived successFully", {
        position: "top-right",
        type: "success",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast("Something went wrong", {
        position: "top-right",
        type: "error",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleSet = async () => {
    try {
      await axios.post("http://localhost:8080/set", {
        key,
        value,
        Expiration: parseInt(expirationDuration),
      });
      setKey("");
      setValue("");
      setGetResponse(null);
      toast("Cache added successfully", {
        position: "top-right",
        type: "success",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast(error, {
        position: "top-right",
        type: "error",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/delete?key=${key}`);
      setGetResponse(null);
      toast("Cache removed successfully", {
        position: "top-right",
        type: "success",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast(error, {
        position: "top-right",
        type: "error",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <h1>LRU Cache</h1>
      <div className="input-container">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
        />
        <input
          type="text"
          value={expirationDuration}
          onChange={(e) => SetExpirationDuration(e.target.value)}
          placeholder="Expiration"
        />
        <div className="buttons-container">
          <button onClick={handleSet}>Set</button>
          <button onClick={handleGet}>Get</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
      {getResponse && (
        <p className="response">
          Value for key <strong>{getResponse?.key}</strong>:{" "}
          {getResponse?.value}
        </p>
      )}
    </div>
  );
}

export default App;
