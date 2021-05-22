export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};
export const matchUserStatus = (status, types) => {
  const keys = Object.keys(types);
  const values = Object.values(types);

  const valIndex = values.indexOf(status);
  if (!(valIndex >= 0)) {
    return "";
  }

  return keys[valIndex].toLowerCase();
};

export function isActive(userStatusString) {
  return userStatusString === "active";
}

export function formatDate(createdAt) {
  return `${createdAt.getMonth()}/${createdAt.getDate()}/${createdAt.getFullYear()}`;
}

export const evaluateUsersColors = (currentUser, invitedUser, game) => {
  const colors = {
    currentUserColor: null,
    invitedUserColor: null,
  };

  if (game.player_1_id === currentUser.id) {
    colors.currentUserColor = game.player_1_color;
  } else if (game.player_1_id === invitedUser.id) {
    colors.invitedUserColor = game.player_1_color;
  }

  if (game.player_2_id === currentUser.id) {
    if (colors.currentUserColor) {
      throw Error(
        "The game does not have distinct user id's for user 1 and user 2"
      );
    }

    colors.currentUserColor = game.player_2_color;
  } else if (game.player_2_id === invitedUser.id) {
    if (colors.invitedUserColor) {
      throw Error(
        "The game does not have distinct user id's for user 1 and user 2"
      );
    }

    colors.invitedUserColor = game.player_2_color;
  }

  if (
    !colors.currentUserColor ||
    !colors.invitedUserColor ||
    colors.currentUserColor === colors.invitedUserColor
  ) {
    throw Error(
      `Problem with matching the user colors (${JSON.stringify(
        colors,
        null,
        2
      )})`
    );
  }
  return colors;
};
