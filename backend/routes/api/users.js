const express = require("express");
const router = express.Router();
const { users: db } = require("../../db/queries");

router.get("/:id", async (request, response) => {
  const id = request.params.id;
  let user = {};
  try {
    user = await db.getUserById(id);
  } catch (err) {
    response.status(404).json({ msg: err.message });
    return;
  }
  response.status(200).json(user);
});

router.get("/active/:id", async (request, response) => {
  const userId = request.params.id;
  response.status(200).json(await db.getActiveUsers(userId));
});

router.post("/signup", async (request, response) => {
  const name = request.body.name;
  if (!name) {
    response.status(400).json({ msg: "Invalid name for user" });
    return;
  }
  const newUser = await db.createUser(name);
  response.status(200).json(newUser);
});

router.put("/update/:id", async (request, response) => {
  const newName = request.body.name;
  const newStatus = requeest.body.status;
  const id = request.params.id;
  let updatedUser = {};
  // Checking that the request is only updating the name and the status
  if (newName && newStatus) {
    response
      .status(400)
      .json({ msg: "Cannot update name and status in the same request" });
  }

  // Updating the name
  if (newName) {
    try {
      updatedUser = await db.updateUserName(id, newName);
    } catch (err) {
      response.status(400).json({ msg: err.message });
      return;
    }

    response.status(200).json(updatedUser);
    return;
  }

  // Updating the user status
  else if (newStatus) {
    try {
      updatedUser = await db.updateUserStatus(id, newStatus);
    } catch (err) {
      response.status(400).json({ msg: err.message });
      return;
    }

    response.status(200).json(updatedUser);
    return;
  }
  response
    .status(400)
    .json({ msg: "You must provide a new name or a new status" });
});

module.exports = router;
