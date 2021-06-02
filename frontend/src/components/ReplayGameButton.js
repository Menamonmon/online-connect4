import { Button } from "@chakra-ui/button";
import React, { Fragment, useState } from "react";
import { useGames } from "../contexts/GamesContext";
import InviteUserModal from "./InviteUserModal";

export default function ReplayGameButton() {
  const { currentGame } = useGames();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasGameEnded =
    currentGame?.winner !== null && currentGame?.winner !== undefined;

  return (
    <Fragment>
      <Button
        size="sm"
        onClick={() => setIsModalOpen(true)}
        colorScheme="green"
        disabled={!hasGameEnded}
      >
        Play Another Game
      </Button>
      <InviteUserModal isOpen={isModalOpen} setOpen={setIsModalOpen} />
    </Fragment>
  );
}
