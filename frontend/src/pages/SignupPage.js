import React, { useState } from "react";
import "./SignupPage.css";
import api from "../requests/api";
import { useUsers } from "../contexts/UsersContext";
import { useSocket } from "../contexts/SocketConext";
import { store } from "react-notifications-component";

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

    const successSignupNotification = {
      title: "Signup Success",
      message: "You have signup successfully successfully.",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    };

    const failSignupNotification = {
      title: "Signup Failure",
      message: error,
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    };

    try {
      newUser = await api.signupUser({ name });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Error with server");
      }
      failSignupNotification.message = error || "Error with server";
      store.addNotification(failSignupNotification);
      setLoading(false);
      return;
    }

    setCurrentUser(newUser);
    socket.auth = { user: newUser };
    socket.connect();
    store.addNotification(successSignupNotification);
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
