import React, { useState } from "react";
// import "./SignupPage.css";
import api from "../requests/api";
import { useUsers } from "../contexts/UsersContext";
import { useSocket } from "../contexts/SocketConext";
import { store } from "react-notifications-component";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";

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
    <VStack justifyContent="center" h="100vh">
      <Heading m={10}>Welcome To Online Connect 4</Heading>
      <FormControl
        onSubmit={submitForm}
        as="form"
        id="signup-form"
        w="500px"
        minW="300px"
        maxW="500px"
        p={5}
        mx="auto"
        borderRadius="15px"
        isRequired
      >
        <FormLabel color="blue.900">Name</FormLabel>
        <Input
          colorScheme="blue"
          name="name"
          type="text"
          placeholder={error || "Type your name here..."}
          value={name}
          onChange={handleChange}
        />
        <Button mt={5} type="submit" disabled={loading} colorScheme="yellow">
          {!loading ? "Proceed to Game" : "Loading..."}
        </Button>
      </FormControl>
    </VStack>
  );
}
