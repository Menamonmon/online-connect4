import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../requests/api";

function inviteUser(invitedUser) {
  console.log("USER INVITED: ", invitedUser);
  return { data: { isAccepted: false } };
}

export default function UserInvitePage({
  updateGame,
  currentUser,
  invitedUser,
}) {

  async function checkInviteStatus(inviteStatus) {
    if (inviteStatus) {
      const { data: game } = await api.createGame(
        currentUser.id,
        invitedUser.id
      );
      updateGame(game);
    }
  }

  let [isInviteAccepted, setIsInviteAccepted] = useState(false);

  useEffect(() => {
    async function sendInvitation(invitedUser) {
      const {
        data: { isAccepted },
      } = await inviteUser(invitedUser);
      return isAccepted;
    }
    const isAccepted = sendInvitation(invitedUser);
    setTimeout(() => {
      setIsInviteAccepted(isAccepted);
    }, 10000);
    return async () => {};
  }, []);

  checkInviteStatus(isInviteAccepted);

  return (
    <div className="user-invite-page">
      <h1 className="user-invite-title">
        Player {invitedUser.name} has been invited to play a game with you.
      </h1>
      <h3>
        {isInviteAccepted
          ? "Your invitation has been accpeted"
          : "Pending a response......"}
      </h3>
      <img
        src="https://i.pinimg.com/originals/90/80/60/9080607321ab98fa3e70dd24b2513a20.gif"
        className="user-invitation-loading-img"
        alt="Loading animation"
      />
    </div>
  );
}
