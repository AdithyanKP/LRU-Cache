import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { BASE_URL } from "./constants";

function App() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [expirationDuration, SetExpirationDuration] = useState();
  const [getResponse, setGetResponse] = useState(null);



  const handleGet = async () => {
    try {
      setGetResponse(null);
      const response = await axios.get(`${BASE_URL}/get?key=${key}`);
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
      await axios.post(`${BASE_URL}/set`, {
        key,
        value,
        Expiration: parseInt(expirationDuration),
      });
      setKey("");
      setValue("");
      SetExpirationDuration(5)
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
      await axios.delete(`${BASE_URL}/delete?key=${key}`);
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
          placeholder="Expiration value in seconds"
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
