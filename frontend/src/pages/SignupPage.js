import React, { useState } from "react";
import axios from "axios";
import "./SignupPage.css";
import { useHistory } from "react-router-dom";

export default function SignupPage({ updateUser }) {
  let [name, setName] = useState("");
  let [error, setError] = useState("");
  const history = useHistory();
  
  function handleChange(e) {
    setName(e.target.value);
    setError("");
  }

  async function submitForm(e) {
    let response = {};

    try {
      response = await axios.post("http://localhost:5000/users/signup", {
        name,
      });
    } catch (err) {
      setError(err.response.data.msg);
      e.preventDefault();
      return;
    }

    const newUser = await response.data;
    updateUser(newUser);
    // history.push("/users-list");
    e.preventDefault();
  }

  return (
    <div className="signup-container">
      <label htmlFor="name" className="name-label">
        Name:
      </label>
      <br />
      <input
        type="text"
        className="name-field"
        placeholder={error || "Type your name here"}
        name="name"
        value={name}
        onChange={handleChange}
      />
      <br />
      <button className="signup-submit-btn" onClick={submitForm}>
        Sign Up
      </button>
    </div>
  );
}
