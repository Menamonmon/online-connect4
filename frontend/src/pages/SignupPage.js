import React, { useState } from "react";
import "./SignupPage.css";
import api from "../requests/api";
import { useUsers } from "../contexts/UsersContext";
import { useSocket } from "../contexts/SocketConext";

export default function SignupPage() {
  let { setCurrentUser } = useUsers();

  let [name, setName] = useState("");
  let [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  function handleChange(e) {
    setName(e.target.value);
    setError("");
  }

  async function submitForm(e) {
    e.preventDefault();
    let newUser = {};
    setLoading(true);
    try {
      newUser = await api.signupUser({ name });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Error with server");
      }
      setLoading(false);
      return;
    }

    setCurrentUser(newUser);
    socket.auth = { user: newUser };
    socket.connect();
    setLoading(false);
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
      <button
        className="signup-submit-btn"
        onClick={submitForm}
        disabled={loading}
      >
        Sign Up
      </button>
    </div>
  );
}
